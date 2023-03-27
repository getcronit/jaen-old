import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {PageProps} from '../types.js'

import {ActivationButton, AdminShell} from './components/index.js'
import {
  AuthenticationProvider,
  useAuthentication
} from './context/AuthenticationContext.js'
import {HighlightProvider} from './context/HighlightContext.js'
import {IncomingBuildCheckerProvider} from './context/IncomingBuildChecker/index.js'
import {ModalProvider} from './context/Modals/ModalContext.js'
import {SiteProvider} from './context/SiteContext.js'
import {useInterceptGatsbyNavigate} from './hooks/useInterceptGatsbyNavigate'
import {usePopupsInject} from './hooks/usePopupsInject.js'
import {ThemeProvider} from './styles/ChakraThemeProvider.js'
import theme from './styles/theme.js'

export {AdminPage, CookieConsent, LoginPage} from './components/index.js'
export {useIncomingBuildChecker} from './context/IncomingBuildChecker/index.js'
export {useStatus} from './hooks/useStatus.js'
export {RoutingPage} from './RoutingPage.js'
export * as views from './views/index.js'

export interface WrapperProps {
  children: React.ReactNode
  ssr?: boolean
}

export const GatsbyRootWrapper: React.FC<WrapperProps> = ({children}) => {
  useInterceptGatsbyNavigate()

  return (
    <ChakraProvider cssVarsRoot="#coco" resetCSS theme={theme}>
      <ModalProvider>
        <AuthenticationProvider>
          <SiteProvider>
            <IncomingBuildCheckerProvider>
              <HighlightProvider>{children}</HighlightProvider>
            </IncomingBuildCheckerProvider>
          </SiteProvider>
        </AuthenticationProvider>
      </ModalProvider>
    </ChakraProvider>
  )
}

export interface PageWrapperProps extends WrapperProps {
  pageProps: PageProps
}

export const GatsbyPageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageProps
}) => {
  const isAdminOrLogin = pageProps.path.startsWith('/admin')

  const handleActivationButtonClick = () => {
    void navigate('/admin')
  }

  const auth = useAuthentication()

  const InjectPopups: React.FC<{
    pageProps: PageProps
  }> = ({pageProps}) => {
    const {elements} = usePopupsInject({
      pageProps
    })

    return <>{elements}</>
  }

  const Wrapper = () => {
    if (!auth.isAuthenticated && !isAdminOrLogin) {
      return (
        <>
          <ThemeProvider>
            <ActivationButton onClick={handleActivationButtonClick} />
          </ThemeProvider>

          {children}
        </>
      )
    }

    if (auth.isAuthenticated && !isAdminOrLogin) {
      return <AdminShell>{children}</AdminShell>
    }

    return <>{children}</>
  }

  return (
    <>
      <InjectPopups pageProps={pageProps} />
      <Wrapper />
    </>
  )
}
