import {navigate} from 'gatsby'

export function redirectAfterDelay(redirectTo: string | undefined) {
  if (redirectTo) {
    // navigate after a timeout to allow the UI to update
    setTimeout(() => {
      void navigate(redirectTo)
    }, 500)
  }
}
