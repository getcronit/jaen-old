import React, {useContext, useEffect, useMemo} from 'react'
import {useTheme} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/provider'
import {PageProvider, useAuthenticationContext} from '@snek-at/jaen'
import {GatsbyBrowser} from 'gatsby'
import {FaCog, FaHome, FaImage, FaSignOutAlt, FaSitemap} from 'react-icons/fa'

// Import other necessary components here
import {JaenFrame} from '../components/JaenFrame/JaenFrame'
import {ToolbarContext} from '../components/JaenFrame/contexts/toolbar'
import Logo from '../components/Logo'
import {withTheme} from '../theme/with-theme'
import {CMSToolbarContainer} from '../containers/cms-toolbar'

const ToolbarProvider: React.FC<{
  jaenPageId?: string
  children: React.ReactNode
}> = ({jaenPageId, children}) => {
  const {setToolbar} = useContext(ToolbarContext)

  useEffect(() => {
    if (!jaenPageId) return

    setToolbar({
      components: [CMSToolbarContainer],
      origin: 'cms'
    })
  }, [jaenPageId])

  return <>{children}</>
}

interface PageContext {
  withoutJaenFrame?: boolean
  withoutJaenFrameStickyHeader?: boolean
  jaenPageId?: string
  breadcrumbs?: Array<{label: string; path: string}>
}

interface CustomPageElementProps {
  element: React.ReactNode
  props: {pageContext?: PageContext}
}

const StyledJaenFrame = withTheme(JaenFrame)

const CustomPageElement: React.FC<CustomPageElementProps> = ({
  element,
  props
}) => {
  const authentication = useAuthenticationContext()
  const userTheme = useTheme()
  const {setToolbar} = useContext(ToolbarContext)

  const withoutJaenFrame = props.pageContext?.withoutJaenFrame
  const withoutJaenFrameStickyHeader =
    props.pageContext?.withoutJaenFrameStickyHeader
  const jaenPageId = props.pageContext?.jaenPageId

  const breadcrumbs = props.pageContext?.breadcrumbs || []

  useEffect(() => {
    if (!jaenPageId) return

    setToolbar({
      components: [CMSToolbarContainer],
      origin: 'cms'
    })
  }, [jaenPageId, setToolbar])

  const memoedElement = useMemo(() => {
    return (
      <ChakraProvider disableEnvironment disableGlobalStyle theme={userTheme}>
        <ToolbarProvider jaenPageId={jaenPageId}>{element}</ToolbarProvider>
      </ChakraProvider>
    )
  }, [element, jaenPageId, userTheme])

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
                  ? `/cms/pages/new/#${btoa(jaenPageId)}`
                  : '/cms/pages/new/'
              }
            }
          },
          breadcrumbs: {
            links: breadcrumbs
          }
        }}>
        {memoedElement}
      </StyledJaenFrame>
    )
  }

  return memoedElement
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props
}) => {
  const jaenPage = {
    id: props.pageContext.jaenPageId as string,
    ...(props.data?.jaenPage || {})
  }

  return (
    <PageProvider jaenPage={jaenPage}>
      <CustomPageElement element={element} props={props} />
    </PageProvider>
  )
}
