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

export interface AutenticationContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    primaryEmail: string
    username: string
    details?: {
      firstName?: string
      lastName?: string
    }
  } | null
  login: (
    login: string,
    password: string,
    logMeOutAfterwards?: boolean
  ) => Promise<void>
  logout: () => Promise<void>
  openLoginModal: () => void
}

export const AuthenticationContext = createContext<AutenticationContext>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  openLoginModal: () => {}
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
            }
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
        }
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

  const value = useMemo(() => {
    return {
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      openLoginModal
    }
  }, [isAuthenticated, isLoading, user, login, logout, , openLoginModal])

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
