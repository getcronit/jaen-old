import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {setTokenPair, sq} from '@snek-functions/origin'

export interface AutenticationContext {
  isAuthenticated: boolean
  isDemo: boolean
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
  demoLogin: () => Promise<void>
  openLoginModal: () => void
}

export const AuthenticationContext = createContext<AutenticationContext>({
  isAuthenticated: false,
  isDemo: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  demoLogin: async () => {},
  openLoginModal: () => {}
})

const useDemoLogin = (): [
  isDemo: boolean,
  setIsDemo: React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const storedIsDemo = localStorage.getItem('isDemo')
    setIsDemo(storedIsDemo === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('isDemo', isDemo ? 'true' : 'false')
  }, [isDemo])

  return [isDemo, setIsDemo]
}

const useAuthenticated = (): [
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
] => {
  const getIsAuthenticated = useCallback(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  }, [])

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(getIsAuthenticated())
  }, [])

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated ? 'true' : 'false')
  }, [isAuthenticated])

  return [isAuthenticated, setIsAuthenticated]
}

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
  const [isAuthenticated, setIsAuthenticated] = useAuthenticated()

  const [user, setUser] = useState<AutenticationContext['user']>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [isDemo, setIsDemo] = useDemoLogin()

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
    if (isDemo) {
      setIsDemo(false)
    } else {
      // const [data, errors] = await sq.mutate(m =>
      //   m.userSignOut({
      //     resourceId: props.snekResourceId
      //   })
      // )

      // const isSuccess = !!data && !errors

      // if (!isSuccess) {
      //   throw new Error('Logout failed')
      // }

      setTokenPair(null)
    }

    setIsAuthenticated(false)
  }, [isDemo])

  const demoLogin = useCallback(async () => {
    setIsDemo(true)
    setIsAuthenticated(true)
  }, [])

  const bootstrap = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (isDemo) {
      setUser({
        id: 'demo',
        primaryEmail: 'snekman@snek.at',
        username: 'snekman'
      })
    } else {
      if (isAuthenticated) {
        setIsLoading(true)
        void bootstrap()
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
  }, [isDemo, isAuthenticated])

  const children = useMemo(() => {
    return props.children
  }, [])

  const value = useMemo(() => {
    return {
      isAuthenticated,
      isDemo,
      isLoading,
      user,
      login,
      logout,
      demoLogin,
      openLoginModal
    }
  }, [
    isAuthenticated,
    isDemo,
    isLoading,
    user,
    login,
    logout,
    demoLogin,
    openLoginModal
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
      {children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext)
}
