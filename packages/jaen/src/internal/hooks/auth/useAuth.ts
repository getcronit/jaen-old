import {useCallback, useEffect, useState} from 'react'
import {storage} from 'snek-query'

import {sq} from '../../../origin-api/index.js'
import {redirectAfterDelay} from '../../../utils/redirectAfterDelay.js'

export const useAuth = () => {
  const [user, setUser] =
    useState<{
      email: string
    } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const persist = async () => {
      setIsLoading(true)
      await storage.set('isAuthenticated', isAuthenticated.toString())
      setIsLoading(false)
    }

    if (isReady) {
      persist()
    }
  }, [isReady, isAuthenticated])

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true)

      const isAuthenticated = await storage.get('isAuthenticated')

      setIsAuthenticated(isAuthenticated === 'true')

      setIsLoading(false)
    }

    bootstrap()

    setIsReady(true)
  }, [])

  const login = useCallback(
    async (
      params: {email: string; password: string},
      details: {
        logMeOutAfterwards?: boolean
      }
    ) => {
      console.log(`Logging in with ${params.email}...`, params, details)
      const [data, errors] = await sq.mutate(m =>
        m.login({
          fnArgs: {
            username: params.email,
            password: params.password,
            resource: 'resource-uuid-1'
          }
        })
      )

      const isAuthenticated = !!data && !errors

      if (!isAuthenticated) {
        throw new Error('Login failed')
      }
    },
    []
  )

  const demoLogin = useCallback(() => {
    setIsAuthenticated(true)
    setUser(null)

    redirectAfterDelay('/admin')
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)

    await sq.mutate(m => m.logout({fnArgs: {}}))

    setIsAuthenticated(false)

    setUser(null)

    redirectAfterDelay('/admin/login?loggedOut=true')
  }, [])

  return {
    isAuthenticated,
    user,
    isLoading: !isReady || isLoading,
    login,
    demoLogin,
    logout
  }
}
