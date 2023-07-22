import {
  AuthenticationProvider,
  FieldHighlighterProvider,
  JaenThemeProvider,
  NotificationsProvider
} from '@snek-at/jaen'
import {GatsbyBrowser} from 'gatsby'
import {lazy} from 'react'

import {theme} from '../theme/index'

const JaenLogin = lazy(
  async () => await import('../components/JaenLogin/JaenLogin')
)

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = (
  {element},
  pluginOptions
) => {
  const snekResourceId = pluginOptions.snekResourceId as string

  if (!snekResourceId) {
    throw new Error('snekResourceId is not defined')
  }

  console.log('THEME', theme)

  return (
    <JaenThemeProvider theme={theme}>
      <NotificationsProvider>
        <FieldHighlighterProvider theme={theme}>
          <AuthenticationProvider
            snekResourceId={snekResourceId}
            JaenLoginComponent={JaenLogin}>
            {element}
          </AuthenticationProvider>
        </FieldHighlighterProvider>
      </NotificationsProvider>
    </JaenThemeProvider>
  )
}
