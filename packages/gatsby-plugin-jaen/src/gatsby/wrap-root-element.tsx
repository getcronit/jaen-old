import {ChakraProvider, Toast} from '@chakra-ui/react'
import {
  AuthenticationProvider,
  FieldHighlighterProvider,
  MediaModalProvider,
  NotificationsProvider,
  JaenUpdateModalProvider
} from '@snek-at/jaen'
import {GatsbyBrowser} from 'gatsby'
import {lazy} from 'react'

import {SiteMetadataProvider} from '../connectors/site-metadata'
import {theme} from '../theme/index'

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
        <JaenUpdateModalProvider>
          <FieldHighlighterProvider theme={theme}>
            <SiteMetadataProvider>
              <AuthenticationProvider
                snekResourceId={snekResourceId}
                JaenLoginComponent={JaenLogin}>
                <MediaModalProvider MediaModalComponent={MediaModalComponent}>
                  {element}
                </MediaModalProvider>
              </AuthenticationProvider>
            </SiteMetadataProvider>
          </FieldHighlighterProvider>
        </JaenUpdateModalProvider>
      </NotificationsProvider>
    </ChakraProvider>
  )
}
