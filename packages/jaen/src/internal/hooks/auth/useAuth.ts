import {useCallback, useEffect, useState} from 'react'

import {redirectAfterDelay} from '../../../utils/redirectAfterDelay.js'
import {store, useAppDispatch, useAppSelector} from '../../redux/index.js'
import * as authActions from '../../redux/slices/auth.js'
import {IAuthState} from '../../redux/types.js'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.auth)

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  console.log('auth', auth)

  const login = useCallback(
    async (
      params: {email: string; password: string},
      details: {
        logMeOutAfterwards?: boolean
      }
    ) => {
      try {
        await dispatch(
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
    dispatch(authActions.demoLogin())

    redirectAfterDelay('/admin')
  }, [])

  const logout = useCallback(async () => {
    await dispatch(authActions.logout())

    redirectAfterDelay('/admin/login?loggedOut=true')
  }, [])

  return {
    ...auth,
    isLoading: !isReady && auth.isLoading,
    login,
    demoLogin,
    logout
  }
}

export const getAuth = (): IAuthState => {
  return store.getState().auth
}
