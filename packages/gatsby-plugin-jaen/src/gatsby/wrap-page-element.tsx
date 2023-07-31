import {ChakraProvider} from '@chakra-ui/provider'
import {Flex, useTheme} from '@chakra-ui/react'
import {
  PageConfig,
  PageProvider,
  useAuthenticationContext,
  withAuthentication
} from '@snek-at/jaen'
import {GatsbyBrowser, navigate, Slice} from 'gatsby'
import React, {useContext, useEffect, useMemo} from 'react'

// Import other necessary components here
import {JaenFrameToolbarContext} from '../components/JaenFrame/contexts/jaen-frame-toolbar'
import CMSToolbarContainer from '../containers/cms-toolbar'

interface PageContext {
  pageConfig?: PageConfig
  jaenPageId?: string
}

interface CustomPageElementProps {
  element: React.ReactNode
  props: {pageContext?: PageContext}
}

const CustomPageElement: React.FC<CustomPageElementProps> = ({
  element,
  props
}) => {
  const userTheme = useTheme()
  const {setToolbar} = useContext(JaenFrameToolbarContext)

  const withoutJaenFrame = props.pageContext?.pageConfig?.withoutJaenFrame
  const jaenPageId = props.pageContext?.jaenPageId

  useEffect(() => {
    if (!jaenPageId) return

    setToolbar({
      components: [CMSToolbarContainer],
      origin: 'cms'
    })
  }, [jaenPageId, setToolbar])

  const AuthenticatedJaenFrame = useMemo(
    () =>
      withAuthentication(
        () => (
          <Slice
            alias="jaen-frame"
            jaenPageId={props.pageContext?.jaenPageId}
            pageConfig={props.pageContext?.pageConfig as any}
          />
        ),
        props.pageContext?.pageConfig,
        {
          onRedirectToLogin: () => {
            navigate('/login')
          }
        }
      ),
    [props.pageContext?.jaenPageId, props.pageContext?.pageConfig]
  )

  const authentication = useAuthenticationContext()

  if (!withoutJaenFrame) {
    return (
      <Flex
        pos="relative"
        flexDirection="column"
        visibility={
          props.pageContext?.pageConfig?.auth?.isRequired &&
          !authentication.isAuthenticated
            ? 'hidden'
            : 'visible'
        }>
        <AuthenticatedJaenFrame />
        <ChakraProvider
          disableEnvironment
          theme={userTheme}
          cssVarsRoot=":root">
          {element}
        </ChakraProvider>
      </Flex>
    )

    // return (
    //   <StyledJaenFrame
    //     logo={<Logo />}
    //     navigation={{
    //       isStickyDisabled: withoutJaenFrameStickyHeader,
    //       app: {
    //         navigationGroups: {
    //           you: {
    //             items: {
    //               home: {
    //                 icon: FaHome,
    //                 label: 'Home',
    //                 path: '/'
    //               }
    //             }
    //           },
    //           cms: {
    //             label: 'Jaen CMS',
    //             items: {
    //               pages: {
    //                 icon: FaSitemap,
    //                 label: 'Pages',
    //                 path: '/cms/pages/'
    //               },
    //               media: {
    //                 icon: FaImage,
    //                 label: 'Media',
    //                 path: '/cms/media/'
    //               },
    //               settings: {
    //                 icon: FaCog,
    //                 label: 'Settings',
    //                 path: '/cms/settings/'
    //               }
    //             }
    //           }
    //         },
    //         version: '3.0.0',
    //         logo: <Logo />
    //       },
    //       user: {
    //         user: {
    //           username: authentication.user.username,
    //           firstName: authentication.user.details?.firstName,
    //           lastName: authentication.user.details?.lastName
    //         },
    //         navigationGroups: {
    //           more: {
    //             items: {
    //               logout: {
    //                 icon: FaSignOutAlt,
    //                 label: 'Logout',
    //                 path: '/logout'
    //               }
    //             }
    //           }
    //         }
    //       },
    //       addMenu: {
    //         items: {
    //           addPage: {
    //             label: 'New page',
    //             icon: FaSitemap,
    //             path: jaenPageId
    //               ? `/cms/pages/new/#${btoa(jaenPageId)}`
    //               : '/cms/pages/new/'
    //           }
    //         }
    //       },
    //       breadcrumbs: {
    //         links: breadcrumbs
    //       }
    //     }}>
    //     {memoedElement}
    //   </StyledJaenFrame>
    // )
  }

  return (
    <ChakraProvider disableEnvironment disableGlobalStyle theme={userTheme}>
      {element}
    </ChakraProvider>
  )
}

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props
}) => {
  const jaenPage = {
    id: props.pageContext.jaenPageId as string,
    ...(props.data?.jaenPage || {})
  }

  console.log('context', props.pageContext)

  return (
    <PageProvider jaenPage={jaenPage}>
      <CustomPageElement element={element} props={props} />
    </PageProvider>
  )
}
