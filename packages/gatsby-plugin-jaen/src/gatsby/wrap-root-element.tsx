import {
  AuthenticationProvider,
  FieldHighlighterProvider,
  JaenThemeProvider,
  MediaModalProvider,
  NotificationsProvider
} from '@snek-at/jaen'
import {GatsbyBrowser} from 'gatsby'
import {lazy} from 'react'

import {theme} from '../theme/index'
import {JaenFrameToolbarProvider} from '../components/JaenFrame/contexts/jaen-frame-toolbar'
import {ChakraProvider} from '@chakra-ui/react'

const JaenLogin = lazy(
  async () => await import('../components/JaenLogin/JaenLogin')
)

const MediaModalComponent = lazy(
  async () => await import('../containers/media-modal')
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
    <ChakraProvider theme={theme} cssVarsRoot="#coco">
      <NotificationsProvider>
        <FieldHighlighterProvider theme={theme}>
          <AuthenticationProvider
            snekResourceId={snekResourceId}
            JaenLoginComponent={JaenLogin}>
            <MediaModalProvider MediaModalComponent={MediaModalComponent}>
              <JaenFrameToolbarProvider>{element}</JaenFrameToolbarProvider>
            </MediaModalProvider>
          </AuthenticationProvider>
        </FieldHighlighterProvider>
      </NotificationsProvider>
    </ChakraProvider>
  )
}
