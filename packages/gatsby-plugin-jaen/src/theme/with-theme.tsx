import {ChakraProvider} from '@chakra-ui/react'

import {theme} from './index'

export const withTheme = <P extends object>(
  Component: React.FC<P>
): React.FC<P> => {
  return (props: P) => (
    <ChakraProvider theme={theme} cssVarsRoot="#coco">
      <Component {...props} />
    </ChakraProvider>
  )
}
