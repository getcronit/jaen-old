import {navigate} from 'gatsby'
import {useCallback} from 'react'

export function usePageNavigator() {
  const isOnJaenAdmin =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin')

  const goto = useCallback((path: string) => {
    void navigate(path)
  }, [])

  return {
    isOnJaenAdmin,
    goto
  }
}
