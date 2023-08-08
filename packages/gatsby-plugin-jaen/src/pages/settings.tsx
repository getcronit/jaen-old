import {PageConfig, useAuthenticationContext} from '@snek-at/jaen'
import {PageProps} from 'gatsby'
import React from 'react'

import {Settings} from '../components/Settings'

const SettingsPage: React.FC<PageProps> = () => {
  const authentication = useAuthenticationContext()

  return (
    <Settings
      data={{
        username: authentication.user?.username,
        details: authentication.user?.details,
        emails: authentication.user?.emails
      }}
      onAccountFormSubmit={async data => {
        await authentication.updateDetails(data)
      }}
      onEmailFormSubmit={async data => {
        await authentication.addEmail(data.emailAddress)
      }}
      onEmailRemove={async emailId => {
        await authentication.removeEmail(emailId)
      }}
      onPasswordFormSubmit={async data => {
        // await authentication.updatePassword(data)
      }}
    />
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
  layout: {
    name: 'jaen'
  }
}
