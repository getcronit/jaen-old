import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {useEffect} from 'react'

import {ActivationButton, AdminShell} from './components/index.js'
import {IncomingBuildCheckerProvider} from './context/IncomingBuildChecker/index.js'
import {ModalProvider} from './context/Modals/ModalContext.js'
import {SiteProvider} from './context/SiteContext.js'
import {getAuth} from './hooks/auth/useAuth.js'
import {useAdminStaticQuery} from './hooks/useAdminStaticQuery.js'
import {useInterceptGatsbyNavigate} from './hooks/useInterceptGatsbyNavigate'
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

export const GatsbyRootWrapper: React.FC<WrapperProps> = ({
  children,
  ssr = false
}) => {
  useInterceptGatsbyNavigate()

  console.log(`GatsbyRootWrapper `, {ssr})

  const {
    allJaenPage: {nodes: staticPages}
  } = useAdminStaticQuery()

  console.log(`GatsbyRootWrapper `, {staticPages})

  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <ModalProvider>
        <SiteProvider>
          <IncomingBuildCheckerProvider>
            {children}
          </IncomingBuildCheckerProvider>
        </SiteProvider>
      </ModalProvider>
    </ChakraProvider>
  )
}

export interface PageWrapperProps extends WrapperProps {
  path: string
}

export const GatsbyPageWrapper: React.FC<PageWrapperProps> = ({
  children,
  path
}) => {
  const isAdminOrLogin = path.startsWith('/admin')
  const isAdminLogin = path.startsWith('/admin/login')
  const isAdmin = isAdminOrLogin && !isAdminLogin

  const handleActivationButtonClick = () => {
    void navigate('/admin')
  }

  const {isAuthenticated} = getAuth()

  useEffect(() => {
    console.log(`GatsbyPageWrapper`, {path})

    if (isAdmin && !isAuthenticated) {
      void navigate('/admin/login')
    } else if (isAdminLogin && isAuthenticated) {
      void navigate('/admin')
    }
  }, [path])

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

  console.log(path, {
    isAdminOrLogin,
    isAdminLogin,
    isAdmin
  })

  return <Wrapper />
}
