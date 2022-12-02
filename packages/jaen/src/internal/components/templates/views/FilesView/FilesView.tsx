import {Box} from '@chakra-ui/react'
import {useSnekFinder} from '@jaenjs/snek-finder'

import {withDefaultTheme} from '../../../../../utils/withDefaultTheme.js'
import {withSnekFinder} from '../../../../context/SnekFinder/withSnekFinder.js'
import {ViewLayout} from '../../../organisms/index.js'

export const FilesViewWithBox = withSnekFinder(() => {
  const finder = useSnekFinder({mode: 'browser'})

  return (
    <Box
      flex="1"
      boxSize={'100%'}
      bg="gray.50"
      p={{
        base: 2,
        md: 4
      }}>
      <Box
        maxW="container.xl"
        mx="auto"
        bg="white"
        p={{
          base: '4',
          md: '8'
        }}
        boxSize={'full'}
        rounded={'lg'}>
        {withDefaultTheme(finder.finderElement)}
      </Box>
    </Box>
  )
})

export const FilesView = withSnekFinder(() => {
  const finder = useSnekFinder({mode: 'browser'})

  return (
    <ViewLayout
      px={{
        base: 2,
        md: 4
      }}
      py={{
        base: 4,
        md: 8
      }}>
      <Box
        px={{
          base: 2,
          md: 4
        }}
        py={{
          base: 4,
          md: 8
        }}
        rounded="lg"
        bg="white">
        {withDefaultTheme(finder.finderElement)}
      </Box>
    </ViewLayout>
  )
})
