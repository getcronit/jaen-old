import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import {setTokenPair, sq} from '@snek-functions/origin/client'
import {snekResourceId} from '../../snekResourceId.js'
import {redirectAfterDelay} from '../../utils/redirectAfterDelay.js'
import {useStatus} from '../hooks/useStatus.js'

export interface AutenticationContext {
  isAuthenticated: boolean
  isDemo: boolean
  user: {
    id: string
    primaryEmail: string
    username: string
  } | null
  isLoading: boolean
  login: (
    login: string,
    password: string,
    logMeOutAfterwards?: boolean
  ) => Promise<void>
  logout: () => Promise<void>
  demoLogin: () => Promise<void>
}

export const AuthenticationContext = createContext<AutenticationContext>({
  isAuthenticated: false,
  isDemo: false,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  demoLogin: async () => {}
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

export const AuthenticationProvider: React.FC<{
  children: React.ReactNode
}> = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [user, setUser] = useState<AutenticationContext['user']>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [isDemo, setIsDemo] = useDemoLogin()
  const isEditing = useStatus()

  const login = useCallback(
    async (login: string, password: string, logMeOutAfterwards?: boolean) => {
      setIsLoading(true)
      console.log(`Logging in with ${login}...`, logMeOutAfterwards)
      const [data, errors] = await sq.mutate(m => {
        const signIn = m.signIn({
          login: login,
          password: password,
          resourceId: snekResourceId
        })

        const u = signIn.user

        return {
          user: {username: u.username, primaryEmail: u.primaryEmail, id: u.id},
          tokenPair: {
            accessToken: signIn.tokenPair.accessToken,
            refreshToken: signIn.tokenPair.refreshToken
          }
        }
      })

      const isSuccess = !!data && !errors

      setIsLoading(false)

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
    setIsLoading(true)
    console.log('Logging out...')
    const [data, errors] = await sq.mutate(m =>
      m.signOut({
        resourceId: snekResourceId
      })
    )

    const isSuccess = !!data && !errors

    setIsLoading(false)

    if (!isSuccess) {
      throw new Error('Logout failed')
    }

    setTokenPair(null)

    setIsAuthenticated(false)

    isEditing.setEditing(false)

    redirectAfterDelay('/admin/login?loggedOut=true')
  }, [])

  const demoLogin = useCallback(async () => {
    setIsLoading(true)
    setIsDemo(true)
    setIsAuthenticated(true)
    setIsLoading(false)

    console.log(
      'Demo login is enabled. You can use the following credentials to login:'
    )

    redirectAfterDelay('/admin')
  }, [])

  const bootstrap = useCallback(async () => {
    setIsLoading(true)
    const [users, errors] = await sq.query(q => {
      return q.me({resourceId: snekResourceId}).map(({user}) => ({
        id: user.id,
        primaryEmail: user.primaryEmail,
        username: user.username
      }))
    })

    const isSuccess = !!users && !errors

    setIsLoading(false)

    if (isSuccess && users[0]) {
      setIsAuthenticated(true)
      setUser(users[0])
    }
  }, [])

  useEffect(() => {
    if (isDemo) {
      setUser({
        id: 'demo',
        primaryEmail: 'snekman@snek/.at',
        username: 'snekman'
      })
    } else {
      bootstrap()
    }
  }, [isDemo])

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        isDemo,
        user,
        isLoading,
        login,
        logout,
        demoLogin
      }}>
      {props.children}
    </AuthenticationContext.Provider>
  )
}

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}
