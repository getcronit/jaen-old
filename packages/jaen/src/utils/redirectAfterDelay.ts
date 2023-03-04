import {navigate} from 'gatsby'

export function redirectAfterDelay(
  redirectTo: string | undefined,
  delay: number = 500
) {
  if (redirectTo) {
    // navigate after a timeout to allow the UI to update
    setTimeout(() => {
      void navigate(redirectTo)
    }, delay)
  }
}
