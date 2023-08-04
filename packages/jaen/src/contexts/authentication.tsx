import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {setTokenPair, getTokenPair, sq} from '@snek-functions/origin'
import {PageConfig} from '../types'

interface SnekUser {
  id: string
  primaryEmail: string
  username: string
  details?: {
    firstName?: string
    lastName?: string
  }
  emails?: Array<{
    id: string
    emailAddress: string
    isVerified?: boolean
    isPrimary?: boolean
  }>
}

export interface AutenticationContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: SnekUser | null
  login: (
    login: string,
    password: string,
    logMeOutAfterwards?: boolean
  ) => Promise<void>
  logout: () => Promise<void>
  openLoginModal: () => void

  updateDetails: (details: SnekUser['details']) => Promise<void>

  addEmail: (emailAddress: string) => Promise<void>
  removeEmail: (emailId: string) => Promise<void>

  updatePassword: (password: string) => Promise<void>
}

export const AuthenticationContext = createContext<AutenticationContext>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  openLoginModal: () => {},
  updateDetails: () => Promise.resolve(),
  addEmail: () => Promise.resolve(),
  removeEmail: () => Promise.resolve(),
  updatePassword: () => Promise.resolve()
})

export const AuthenticationProvider: React.FC<{
  snekResourceId: string
  JaenLoginComponent: React.LazyExoticComponent<
    React.FC<{
      onSignIn: (values: {
        login: string
        password: string
        logMeOut?: boolean
      }) => Promise<void>
      goBackPath?: string
      onGoBack?: () => void
      forgotPasswordPath?: string
      onForgotPassword?: () => void
      signUpPath?: string
      onSignUp?: () => void
      isModal?: boolean
    }>
  >
  children: React.ReactNode
}> = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [user, setUser] = useState<AutenticationContext['user']>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openLoginModal = useCallback(() => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
    }
  }, [isAuthenticated])

  // Test which status attributes are causing the re-render

  const login = useCallback(
    async (login: string, password: string, logMeOutAfterwards?: boolean) => {
      const [data, errors] = await sq.mutate(m => {
        const signIn = m.userSignIn({
          login,
          password,
          resourceId: props.snekResourceId
        })

        const u = signIn.user

        return {
          user: {
            username: u.username,
            primaryEmail: u.primaryEmailAddress,
            id: u.id,
            details: {
              firstName: u.details?.firstName ?? undefined,
              lastName: u.details?.lastName ?? undefined
            },
            emails: u.emails?.map(e => ({
              id: e.id,
              emailAddress: e.emailAddress,
              isVerified: false,
              isPrimary: e.isPrimary
            }))
          },
          tokenPair: {
            accessToken: signIn.tokenPair.accessToken,
            refreshToken: signIn.tokenPair.refreshToken
          }
        }
      })

      const isSuccess = !!data && !errors

      if (!isSuccess) {
        throw new Error('Login failed')
      }

      setTokenPair(data.tokenPair, logMeOutAfterwards)
      setUser(data.user)

      setIsAuthenticated(true)
    },
    []
  )

  const logout = useCallback(async () => {
    setIsAuthenticated(false)

    setTokenPair(null)
  }, [setIsAuthenticated])

  const bootstrap = useCallback(async () => {
    // skip bootstrap if no token pair is present
    if (getTokenPair() === null) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const [me, errors] = await sq.query(q => {
      const user = q.userMe

      return {
        id: user.id,
        primaryEmail: user.primaryEmailAddress,
        username: user.username,
        details: {
          firstName: user.details?.firstName ?? undefined,
          lastName: user.details?.lastName ?? undefined
        },
        emails: user.emails?.map(e => ({
          id: e.id,
          emailAddress: e.emailAddress,
          isVerified: e.isPrimary ? true : false,
          isPrimary: e.isPrimary
        }))
      }
    })

    const isSuccess = !!me && !errors

    if (isSuccess) {
      setIsAuthenticated(true)
      setUser(me)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    void bootstrap()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null)
    }
  }, [isAuthenticated])

  const updateDetails = useCallback(
    async (details: {firstName?: string; lastName?: string}) => {
      if (!user) return

      // Assuming you have a function to update user details from your backend, e.g., updateUserDetails
      const [updatedUser, errors] = await sq.mutate(m => {
        const updateUser = m.userUpdate({
          id: user.id,
          values: {
            details: {
              firstName: details.firstName,
              lastName: details.lastName
            }
          }
        })

        return {
          ...user,
          details: {
            firstName: updateUser.details?.firstName ?? undefined,
            lastName: updateUser.details?.lastName ?? undefined
          }
        }
      })

      const isSuccess = !!updatedUser && !errors

      if (isSuccess) {
        setUser(
          prevUser =>
            ({
              ...prevUser,
              details: updatedUser.details
            } as AutenticationContext['user'])
        )
      }
    },
    [user]
  )

  const addEmail = useCallback(async (emailAddress: string) => {
    // Assuming you have a function to add an email address from your backend, e.g., addEmailAddress
    const [newEmail, errors] = await sq.mutate(m => {
      const addEmail = m.userEmailCreate({
        emailAddress,
        isPrimary: false
      })

      return {
        id: addEmail.id,
        emailAddress: addEmail.emailAddress,
        isVerified: false,
        isPrimary: addEmail.isPrimary
      }
    })

    const isSuccess = !!newEmail && !errors

    if (isSuccess) {
      setUser(
        prevUser =>
          ({
            ...prevUser,
            emails: [
              ...(prevUser?.emails || []),
              {
                id: newEmail.id,
                emailAddress: newEmail.emailAddress,
                isVerified: false,
                isPrimary: newEmail.isPrimary
              }
            ]
          } as AutenticationContext['user'])
      )
    }
  }, [])

  const removeEmail = useCallback(async (emailId: string) => {
    // Assuming you have a function to remove an email address from your backend, e.g., removeEmailAddress
    const [removedEmail, errors] = await sq.mutate(m => {
      const success = m.userEmailDelete({
        emailId: emailId
      })

      return success
    })

    const isSuccess = !!removedEmail && !errors

    if (isSuccess) {
      setUser(
        prevUser =>
          ({
            ...prevUser,
            emails: prevUser?.emails?.filter(e => e.id !== emailId)
          } as AutenticationContext['user'])
      )
    }
  }, [])

  const updatePassword = useCallback(
    async (password: string) => {
      if (!user) return

      // Assuming you have a function to update the password from your backend, e.g., updatePassword
      const [updatedUser, errors] = await sq.mutate(m => {
        const updateUser = m.userUpdate({
          id: user?.id,
          values: {
            password
          }
        })

        return updateUser
      })

      const isSuccess = !!updatedUser && !errors

      if (isSuccess) {
        alert('Password updated successfully')
      }
    },
    [user]
  )

  const value = useMemo(() => {
    return {
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      openLoginModal,
      updateDetails,
      addEmail,
      removeEmail,
      updatePassword
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    openLoginModal,
    updateDetails,
    addEmail,
    removeEmail,
    updatePassword
  ])

  const JaenLogin = props.JaenLoginComponent

  return (
    <AuthenticationContext.Provider value={value}>
      {isLoginModalOpen && (
        <React.Suspense fallback={null}>
          <JaenLogin
            isModal
            onSignIn={async function (values): Promise<void> {
              await login(values.login, values.password, values.logMeOut)

              setIsLoginModalOpen(false)
            }}
            onGoBack={() => {
              setIsLoginModalOpen(false)
            }}
            signUpPath="/signup"
            onSignUp={() => {
              setIsLoginModalOpen(false)
            }}
            forgotPasswordPath="/password_reset"
            onForgotPassword={() => {
              setIsLoginModalOpen(false)
            }}
          />
        </React.Suspense>
      )}
      {props.children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext)
}

export const withAuthentication = <P extends {}>(
  Component: React.ComponentType<P>,
  pageConfig?: PageConfig,
  options?: {
    forceAuth?: boolean
    onRedirectToLogin?: () => void
  }
): React.FC<P> => {
  const WithAuthentication: React.FC<P> = props => {
    const {isAuthenticated, isLoading} = useAuthenticationContext()

    if (pageConfig?.auth?.isRequired) {
      if (isLoading) {
        return null
      }

      if (!isAuthenticated) {
        if (options?.onRedirectToLogin) {
          options.onRedirectToLogin()
        }

        return null
      }
    }

    if (options?.forceAuth && !isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }

  return WithAuthentication
}