import {PageConfig, useAuthenticationContext} from '@snek-at/jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {Settings} from '../components/Settings'
import {JaenPageLayout} from '../components/JaenPageLayout'

const SettingsPage: React.FC<PageProps> = () => {
  const authentication = useAuthenticationContext()

  return (
    <JaenPageLayout>
      <Settings
        data={{
          username: authentication.user.username
        }}
      />
    </JaenPageLayout>
  )
}

export default SettingsPage

export const pageConfig: PageConfig = {
  label: 'Settings',
  icon: 'FaUserCog',
  menu: {
    order: 100,
    type: 'user'
  },
  auth: {
    isRequired: true
  },
  theme: 'jaen'
}
