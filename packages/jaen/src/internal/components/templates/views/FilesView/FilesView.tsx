import {Box, theme} from '@chakra-ui/react'
import {useSnekFinder} from '@jaenjs/snek-finder'

import {withSnekFinder} from '../../../../context/SnekFinder/withSnekFinder.js'
import {ThemeProvider} from '../../../../styles/ChakraThemeProvider.js'

export const FilesView = withSnekFinder(() => {
  const finder = useSnekFinder({mode: 'browser'})

  return (
    <ThemeProvider theme={theme}>
      <Box h="60vh">{finder.finderElement}</Box>
    </ThemeProvider>
  )
})
