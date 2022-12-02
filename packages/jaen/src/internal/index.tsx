import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {useEffect} from 'react'

import {withDefaultTheme} from '../utils/withDefaultTheme.js'

import {ActivationButton, AdminShell} from './components/index.js'
import {IncomingBuildCheckerProvider} from './context/IncomingBuildChecker/index.js'
import {ModalProvider} from './context/Modals/ModalContext.js'
import {SiteProvider} from './context/SiteContext.js'
import {getAuth} from './hooks/auth/useAuth.js'
import {useAdminStaticQuery} from './hooks/useAdminStaticQuery.js'
import theme from './styles/theme.js'

export {AdminPage, LoginPage} from './components/index.js'
export {useIncomingBuildChecker} from './context/IncomingBuildChecker/index.js'

export * as views from './views/index.js'

export interface WrapperProps {
  children: React.ReactNode
  ssr?: boolean
}

export const GatsbyRootWrapper: React.FC<WrapperProps> = ({
  children,
  ssr = false
}) => {
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
    navigate('/admin')
  }

  const {isAuthenticated} = getAuth()

  useEffect(() => {
    console.log(`GatsbyPageWrapper`, {path})

    if (isAdmin && !isAuthenticated) {
      navigate('/admin/login')
    } else if (isAdminLogin && isAuthenticated) {
      navigate('/admin')
    }
  }, [path])

  let Wrapper = () => {
    if (!isAuthenticated && !isAdminOrLogin) {
      return (
        <>
          <ActivationButton onClick={handleActivationButtonClick} />

          {withDefaultTheme(children)}
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
