import {PageConfig, useAuthenticationContext} from '@snek-at/jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {JaenLogout} from '../components/JaenLogout/JaenLogout'

const LogoutPage: React.FC<PageProps> = () => {
  const {logout, isAuthenticated} = useAuthenticationContext()

  React.useEffect(() => {}, [isAuthenticated])

  return (
    <JaenLogout
      onSignOut={() => {
        void logout().then(() => {
          window.location.href = '/'
        })
      }}
      goBackPath="/"
    />
  )
}

export default LogoutPage

export const pageConfig: PageConfig = {
  label: 'Logout',
  icon: 'FaSignOutAlt',
  withoutJaenFrame: true,
  menu: {
    order: 1000,
    type: 'user'
  },
  auth: {
    isRequired: true
  },
  theme: 'jaen'
}
