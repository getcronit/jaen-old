import {
  AuthenticationProvider,
  FieldHighlighterProvider,
  JaenThemeProvider,
  NotificationsProvider
} from '@snek-at/jaen'
import {GatsbyBrowser} from 'gatsby'
import {lazy} from 'react'

import {theme} from '../theme/index'
import {JaenFrameToolbarProvider} from '../components/JaenFrame/contexts/jaen-frame-toolbar'

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

  return (
    <JaenThemeProvider theme={theme}>
      <NotificationsProvider>
        <FieldHighlighterProvider theme={theme}>
          <AuthenticationProvider
            snekResourceId={snekResourceId}
            JaenLoginComponent={JaenLogin}>
            <JaenFrameToolbarProvider>{element}</JaenFrameToolbarProvider>
          </AuthenticationProvider>
        </FieldHighlighterProvider>
      </NotificationsProvider>
    </JaenThemeProvider>
  )
}
