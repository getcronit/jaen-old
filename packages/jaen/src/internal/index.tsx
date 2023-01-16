import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {useEffect} from 'react'
import {PageProps} from '../types.js'

import {ActivationButton, AdminShell} from './components/index.js'
import {HighlightProvider} from './context/HighlightContext.js'
import {IncomingBuildCheckerProvider} from './context/IncomingBuildChecker/index.js'
import {ModalProvider} from './context/Modals/ModalContext.js'
import {SiteProvider} from './context/SiteContext.js'
import {getAuth} from './hooks/auth/useAuth.js'
import {useInterceptGatsbyNavigate} from './hooks/useInterceptGatsbyNavigate'
import {usePopupsInject} from './hooks/usePopupsInject.js'
import {ThemeProvider} from './styles/ChakraThemeProvider.js'
import theme from './styles/theme.js'

export {AdminPage, LoginPage} from './components/index.js'
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
    <ChakraProvider resetCSS={true} theme={theme}>
      <ModalProvider>
        <SiteProvider>
          <IncomingBuildCheckerProvider>
            <HighlightProvider>{children}</HighlightProvider>
          </IncomingBuildCheckerProvider>
        </SiteProvider>
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
  const isAdminLogin = pageProps.path.startsWith('/admin/login')
  const isAdmin = isAdminOrLogin && !isAdminLogin

  const handleActivationButtonClick = () => {
    void navigate('/admin')
  }

  const {isAuthenticated} = getAuth()

  useEffect(() => {
    console.log(`GatsbyPageWrapper`, {path: pageProps.path})

    if (isAdmin && !isAuthenticated) {
      void navigate('/admin/login')
    } else if (isAdminLogin && isAuthenticated) {
      void navigate('/admin')
    }
  }, [pageProps.path])

  const InjectPopups: React.FC<{
    pageProps: PageProps
  }> = ({pageProps}) => {
    const {elements} = usePopupsInject({
      pageProps
    })

    return <>{elements}</>
  }

  const Wrapper = () => {
    if (!isAuthenticated && !isAdminOrLogin) {
      return (
        <>
          <ActivationButton onClick={handleActivationButtonClick} />

          <ThemeProvider>{children}</ThemeProvider>
        </>
      )
    }

    if (isAuthenticated && !isAdminOrLogin) {
      return <AdminShell>{children}</AdminShell>
    }

    return <>{children}</>
  }

  // if (isOnAdminPage) {
  //   return (
  //     <SnekFinder>
  //       <Wrapper />
  //     </SnekFinder>
  //   )
  // }

  console.log(pageProps, {
    isAdminOrLogin,
    isAdminLogin,
    isAdmin
  })

  return (
    <>
      <InjectPopups pageProps={pageProps} />
      <Wrapper />
    </>
  )
}
