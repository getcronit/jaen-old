import {
  ChakraProvider,
  useColorMode,
  ThemeProvider,
  GlobalStyle
} from '@chakra-ui/react'
import {Button, Flex, useTheme} from '@chakra-ui/react'
import {
  PageConfig,
  PageProvider,
  useAuthenticationContext,
  withAuthentication
} from '@snek-at/jaen'
import {GatsbyBrowser, navigate, Slice} from 'gatsby'
import React, {useContext, useEffect, useMemo} from 'react'

import userTheme from '../theme/theme'

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
  const shouldUseJaenTheme = props.pageContext?.pageConfig?.theme === 'jaen'

  const AuthenticatedPage = useMemo(
    () =>
      withAuthentication<{
        shouldUseJaenTheme: boolean
        children: React.ReactNode
      }>(
        ({shouldUseJaenTheme, children}) => {
          if (!shouldUseJaenTheme) {
            return (
              <ThemeProvider theme={userTheme}>
                <GlobalStyle />
                {children}
              </ThemeProvider>
            )
          }

          return <>{children}</>
        },
        props.pageContext?.pageConfig,
        {
          onRedirectToLogin: () => {
            navigate('/login')
          }
        }
      ),
    [props.pageContext?.pageConfig]
  )

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
          forceAuth: true,
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
        <AuthenticatedPage shouldUseJaenTheme={shouldUseJaenTheme}>
          {element}
        </AuthenticatedPage>
      </Flex>
    )
  }

  return (
    <AuthenticatedPage shouldUseJaenTheme={shouldUseJaenTheme}>
      {element}
    </AuthenticatedPage>
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
