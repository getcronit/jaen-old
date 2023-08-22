import {
  AuthenticationProvider,
  JaenThemeProvider,
  useAuthentication
} from 'jaen'
import {GatsbyBrowser} from 'gatsby'
import {FaCog, FaHome, FaImage, FaSignOutAlt, FaSitemap} from 'react-icons/fa'

import {useTheme} from '@chakra-ui/react'

// import 'jaen/dist/index.css'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

import React from 'react'

import {JaenFrame} from './src/components/JaenFrame/JaenFrame'
import Logo from './src/components/Logo'
import {withTheme} from './src/theme/with-theme'

const JaenLogin = React.lazy(
  async () => await import('./src/components/JaenLogin/JaenLogin')
)

const StyledJaenFrame = withTheme(JaenFrame)

export const onRouteUpdate = ({location: {hash}}: any) => {
  if (hash) {
    window.setTimeout(() => {
      scrollTo(hash)
    }, 10)
  }
}

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = (
  {element},
  pluginOptions
) => {
  const snekResourceId = pluginOptions.snekResourceId as string

  if (!snekResourceId) {
    throw new Error('snekResourceId is not defined')
  }

  return (
    <AuthenticationProvider
      snekResourceId={snekResourceId}
      JaenLoginComponent={JaenLogin}>
      {element}
    </AuthenticationProvider>
  )
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props
}) => {
  const authentication = useAuthentication()

  const userTheme = useTheme()

  const withoutJaenFrame = props.pageContext?.withoutJaenFrame
  const withoutJaenFrameStickyHeader = props.pageContext
    ?.withoutJaenFrameStickyHeader as boolean | undefined

  const jaenPageId = props.pageContext?.jaenPageId as string | undefined

  console.log('pageContext', props.pageContext)

  const breadcrumbs = (props.pageContext?.breadcrumbs || []) as Array<{
    label: string
    path: string
  }>

  if (
    authentication.isAuthenticated &&
    authentication.user &&
    !withoutJaenFrame
  ) {
    return (
      <StyledJaenFrame
        logo={<Logo />}
        navigation={{
          isStickyDisabled: withoutJaenFrameStickyHeader,
          app: {
            navigationGroups: {
              you: {
                items: {
                  home: {
                    icon: FaHome,
                    label: 'Home',
                    path: '/'
                  }
                }
              },
              cms: {
                label: 'Jaen CMS',
                items: {
                  pages: {
                    icon: FaSitemap,
                    label: 'Pages',
                    path: '/cms/pages/'
                  },
                  media: {
                    icon: FaImage,
                    label: 'Media',
                    path: '/cms/media/'
                  },
                  settings: {
                    icon: FaCog,
                    label: 'Settings',
                    path: '/cms/settings/'
                  }
                }
              }
            },
            version: '',
            logo: <Logo />
          },
          user: {
            user: {
              username: authentication.user.username,
              firstName: authentication.user.details?.firstName,
              lastName: authentication.user.details?.lastName
            },
            navigationGroups: {
              more: {
                items: {
                  logout: {
                    icon: FaSignOutAlt,
                    label: 'Logout',
                    path: '/logout'
                  }
                }
              }
            }
          },
          addMenu: {
            items: {
              addPage: {
                label: 'New page',
                icon: FaSitemap,
                path: jaenPageId
                  ? `/cms/pages/new/?parent=${jaenPageId}`
                  : '/cms/pages/new/'
              }
            }
          },
          breadcrumbs: {
            links: breadcrumbs
          }
        }}>
        <JaenThemeProvider theme={userTheme}>{element}</JaenThemeProvider>
      </StyledJaenFrame>
    )
  }

  return element
}
