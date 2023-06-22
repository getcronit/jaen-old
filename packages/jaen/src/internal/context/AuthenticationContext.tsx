import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {setTokenPair, sq} from '@snek-functions/origin'
import {snekResourceId} from '../../snekResourceId.js'
import {redirectAfterDelay} from '../../utils/redirectAfterDelay.js'
import {useStatus} from '../hooks/useStatus.js'

export interface AutenticationContext {
  isAuthenticated: boolean
  isDemo: boolean
  isLoading: boolean
  user: {
    id: string
    primaryEmail: string
    username: string
  } | null
  login: (
    login: string,
    password: string,
    logMeOutAfterwards?: boolean
  ) => Promise<void>
  logout: () => Promise<void>
  demoLogin: () => Promise<void>
  redirectToSSO: () => Promise<void>
}

export const AuthenticationContext = createContext<AutenticationContext>({
  isAuthenticated: false,
  isDemo: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  demoLogin: async () => {},
  redirectToSSO: async () => {}
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
  children: React.ReactNode
}> = props => {
  const [isAuthenticated, setIsAuthenticated] = useAuthenticated()

  const [user, setUser] = useState<AutenticationContext['user']>(null)

  const [isLoading, setIsLoading] = useState(isAuthenticated)

  const [isDemo, setIsDemo] = useDemoLogin()
  const status = useStatus()

  // Test which status attributes are causing the re-render

  const login = useCallback(
    async (login: string, password: string, logMeOutAfterwards?: boolean) => {
      const [data, errors] = await sq.mutate(m => {
        const signIn = m.userSignIn({
          login,
          password,
          resourceId: snekResourceId
        })

        const u = signIn.user

        return {
          user: {
            username: u.username,
            primaryEmail: u.primaryEmailAddress,
            id: u.id
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
      redirectAfterDelay('/admin')
    },
    []
  )

  const logout = useCallback(async () => {
    if (isDemo) {
      setIsDemo(false)
    } else {
      // const [data, errors] = await sq.mutate(m =>
      //   m.userSignOut({
      //     resourceId: snekResourceId
      //   })
      // )

      // const isSuccess = !!data && !errors

      // if (!isSuccess) {
      //   throw new Error('Logout failed')
      // }

      setTokenPair(null)
    }

    setIsAuthenticated(false)
    status.setEditing(false)

    redirectAfterDelay('/admin/login?loggedOut=true')
  }, [isDemo])

  const demoLogin = useCallback(async () => {
    setIsDemo(true)
    setIsAuthenticated(true)

    redirectAfterDelay('/admin')
  }, [])

  const bootstrap = useCallback(async () => {
    const [me, errors] = await sq.query(q => {
      const user = q.userMe

      return {
        id: user.id,
        primaryEmail: user.primaryEmailAddress,
        username: user.username
      }
    })

    const isSuccess = !!me && !errors

    setIsLoading(false)

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
        void bootstrap()
      }
    }
  }, [isDemo, isAuthenticated])

  const redirectToSSO = useCallback(async () => {
    window.location.href = `https://access.snek.at?resourceId=${snekResourceId}`
  }, [])

  useEffect(() => {
    const accessFromLocation = new URLSearchParams(window.location.search).get(
      'access'
    )

    if (accessFromLocation) {
      // try to json parse the access object and get accessToken and refreshToken

      try {
        const access = JSON.parse(accessFromLocation)

        if (access.accessToken && access.refreshToken) {
          const tokenPair = {
            accessToken: access.accessToken,
            refreshToken: access.refreshToken
          }

          const isSession = access.isSession

          setTokenPair(tokenPair, isSession)

          void bootstrap().then(() => {
            redirectAfterDelay('/admin', 0)
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

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
      redirectToSSO
    }
  }, [
    isAuthenticated,
    isDemo,
    isLoading,
    user,
    login,
    logout,
    demoLogin,
    redirectToSSO
  ])

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}
