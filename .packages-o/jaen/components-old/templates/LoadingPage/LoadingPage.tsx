import {Center} from '@chakra-ui/react'
import {JaenLogo} from '../../atoms/index.js'

export interface LoadingPageProps {}

export const LoadingPage: React.FC<LoadingPageProps> = () => {
  return (
    <Center h="100vh" w="full">
      <JaenLogo boxSize="12" />
    </Center>
  )
}
