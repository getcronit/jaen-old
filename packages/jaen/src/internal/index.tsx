import {ChakraProvider} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {ActivationButton} from './components/index.js'
import {IncomingBuildCheckerProvider} from './context/IncomingBuildChecker/index.js'

export {useIncomingBuildChecker} from './context/IncomingBuildChecker/index.js'

export interface WrapperProps {
  children: React.ReactNode
  ssr?: boolean
}

export const GatsbyRootWrapper: React.FC<WrapperProps> = ({
  children,
  ssr = false
}) => {
  console.log(`GatsbyRootWrapper`, {ssr})

  return (
    <ChakraProvider resetCSS={true}>
      <IncomingBuildCheckerProvider>{children}</IncomingBuildCheckerProvider>
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
  const isOnAdminPage = path.startsWith('/admin')

  const handleActivationButtonClick = () => {
    navigate('/admin')
  }

  return (
    <>
      {!isOnAdminPage && (
        <ActivationButton onClick={handleActivationButtonClick} />
      )}
      {children}
    </>
  )
}
