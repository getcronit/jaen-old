import {useAuthentication} from 'jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {JaenLogout} from '../src/components/JaenLogout/JaenLogout'
import {withTheme} from '../src/theme/with-theme'

const LogoutPage: React.FC<PageProps> = () => {
  const {logout, isAuthenticated} = useAuthentication()

  React.useEffect(() => {}, [isAuthenticated])

  return <JaenLogout onSignOut={logout} goBackPath="/" />
}

export default withTheme(LogoutPage)
