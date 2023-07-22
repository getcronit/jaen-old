import {ChakraProvider, useTheme} from '@chakra-ui/react'
import {useAuthentication} from '@snek-at/jaen'
import {GatsbyBrowser} from 'gatsby'
import {useContext, useEffect} from 'react'
import {FaCog, FaHome, FaImage, FaSignOutAlt, FaSitemap} from 'react-icons/fa'

import {JaenFrame} from '../components/JaenFrame/JaenFrame'
import {ToolbarContext} from '../components/JaenFrame/contexts/toolbar'
import Logo from '../components/Logo'
import {withTheme} from '../theme/with-theme'
import {CMSToolbar} from '../connectors/cms-toolbar'

const StyledJaenFrame = withTheme(JaenFrame)

const ToolbarProvider: React.FC<{
  jaenPageId?: string
  children: React.ReactNode
}> = ({jaenPageId, children}) => {
  const {setToolbar} = useContext(ToolbarContext)

  useEffect(() => {
    if (!jaenPageId) return

    setToolbar({
      components: [CMSToolbar],
      origin: 'cms'
    })
  }, [jaenPageId])

  return <>{children}</>
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
            version: '3.0.0',
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
        <ChakraProvider disableGlobalStyle theme={userTheme}>
          <ToolbarProvider jaenPageId={jaenPageId}>{element}</ToolbarProvider>
        </ChakraProvider>
      </StyledJaenFrame>
    )
  }

  return element
}
