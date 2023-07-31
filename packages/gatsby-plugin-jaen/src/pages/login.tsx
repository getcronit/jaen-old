import {PageConfig, useAuthenticationContext} from '@snek-at/jaen'
import {navigate, PageProps} from 'gatsby'
import React from 'react'

import {JaenLogin} from '../components/JaenLogin/JaenLogin'
import {withTheme} from '../theme/with-theme'

const LoginPage: React.FC<PageProps> = () => {
  const {login, isAuthenticated, isLoading} = useAuthenticationContext()

  React.useEffect(() => {
    if (isAuthenticated) {
      void navigate('/')
    }
  }, [isAuthenticated])

  if (isLoading || isAuthenticated) {
    return null
  }

  return (
    <JaenLogin
      signUpPath="/signup"
      forgotPasswordPath="/password_reset"
      onSignIn={async data => {
        await login(data.login, data.password, data.logMeOut)
      }}
      goBackPath="/"
    />
  )
}

export default withTheme(LoginPage)

export const pageConfig: PageConfig = {
  label: 'Login',
  withoutJaenFrame: true,
  theme: 'jaen'
}
