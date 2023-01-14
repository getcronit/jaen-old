import {useCallback, useEffect, useState} from 'react'
import {store} from '../../redux/index.js'
import {IAuthState} from '../../redux/types.js'

import {redirectAfterDelay} from '../../../utils/redirectAfterDelay.js'
import * as authActions from '../../redux/slices/auth.js'

export const useAuth = () => {
  const [state, setState] = useState<IAuthState>(store.getState().auth)

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState().auth)
    })

    return unsubscribe
  }, [])

  const login = useCallback(
    async (
      params: {email: string; password: string},
      details: {
        logMeOutAfterwards?: boolean
      }
    ) => {
      try {
        await store.dispatch(
          authActions.login({
            params,
            details
          })
        )
        redirectAfterDelay('/admin')

        return true
      } catch (error) {
        console.error(error)

        return false
      }
    },
    []
  )

  const demoLogin = useCallback(() => {
    store.dispatch(authActions.demoLogin())

    redirectAfterDelay('/admin')
  }, [])

  const logout = useCallback(async () => {
    await store.dispatch(authActions.logout())

    redirectAfterDelay('/admin/login?loggedOut=true')
  }, [])

  return {
    ...state,
    login,
    demoLogin,
    logout
  }
}

export const getAuth = (): IAuthState => {
  return store.getState().auth
}
