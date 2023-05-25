import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import React, {useCallback, useMemo} from 'react'
import {InjectPopups} from './components/atoms/InjectPopups.js'
import {LoadingPage} from './components/templates/LoadingPage/LoadingPage.js'
import {
  AuthenticationProvider,
  useAuthentication
} from './context/AuthenticationContext.js'
import {IncomingBuildChecker} from './context/IncomingBuildChecker/index.js'
import {ModalProvider} from './context/Modals/ModalContext.js'
import SiteProvider from './context/SiteContext.js'
import {DynamicPageProps, useDynamicRoute} from './DynamicRoute.js'
import {ThemeProvider} from './styles/ChakraThemeProvider.js'
import theme from './styles/theme.js'

export interface WrapperProps {
  children: React.ReactNode
  ssr?: boolean
}

export const GatsbyRootWrapper: React.FC<WrapperProps> = ({children}) => {
  const MayeLazy: React.FC<{
    children: React.ReactNode
  }> = ({children}) => {
    const {isAuthenticated} = useAuthentication()

    if (!isAuthenticated) {
      return <>{children}</>
    }

    const LazyHighlightProvider = React.lazy(
      async () => await import('./context/HighlightContext.js')
    )

    return (
      <React.Suspense fallback={<LoadingPage />}>
        <LazyHighlightProvider>{children}</LazyHighlightProvider>
      </React.Suspense>
    )
  }

  return (
    <ChakraProvider cssVarsRoot="#coco" resetCSS theme={theme}>
      <SiteProvider>
        <ModalProvider>
          <IncomingBuildChecker />

          <AuthenticationProvider>
            <MayeLazy>{children}</MayeLazy>
          </AuthenticationProvider>
        </ModalProvider>
      </SiteProvider>
    </ChakraProvider>
  )
}

export interface PageWrapperProps extends WrapperProps {
  pageProps: DynamicPageProps
}

export const GatsbyPageWrapper: React.FC<PageWrapperProps> = props => {
  const dynamicRoute = useDynamicRoute({
    pageProps: props.pageProps
  })

  const handleActivationButtonClick = useCallback(() => {
    void navigate('/admin')
  }, [])

  const auth = useAuthentication()

  if (dynamicRoute.isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <InjectPopups pageProps={props.pageProps} />
      <WrapperPage
        dynamicRoute={dynamicRoute}
        path={props.pageProps.path}
        isAuthenticated={auth.isAuthenticated}
        handleActivationButtonClick={handleActivationButtonClick}>
        {props.children}
      </WrapperPage>
    </>
  )
}

const DynamicAdminShell: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  const AdminShell = React.lazy(
    async () => await import('./components/templates/AdminShell/AdminShell.js')
  )

  const MemoedAdminShell = useMemo(() => AdminShell, [])

  return (
    <React.Suspense fallback={<LoadingPage />}>
      <MemoedAdminShell>{children}</MemoedAdminShell>
    </React.Suspense>
  )
}

const WrapperPage: React.FC<{
  dynamicRoute: ReturnType<typeof useDynamicRoute>
  children: React.ReactNode
  path: string
  isAuthenticated: boolean
  handleActivationButtonClick: () => void
}> = ({
  dynamicRoute,
  children: propsChildren,
  path,
  isAuthenticated,
  handleActivationButtonClick
}) => {
  const children = dynamicRoute.node || propsChildren

  const isOnAdmin = path.includes('/admin')

  if (isAuthenticated) {
    return <DynamicAdminShell>{children}</DynamicAdminShell>
  } else {
    if (isOnAdmin) {
      // For example if the user accesses /admin/login, the ActivationButton should not be rendered
      return <>{children}</>
    }

    const ActivationButton = React.lazy(
      async () =>
        await import('./components/atoms/ActivationButton/ActivationButton.js')
    )

    return (
      <>
        <React.Suspense fallback={<></>}>
          <ThemeProvider>
            <ActivationButton onClick={handleActivationButtonClick} />
          </ThemeProvider>
        </React.Suspense>

        {children}
      </>
    )
  }
}
