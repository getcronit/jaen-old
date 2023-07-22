import {baseTheme, extendTheme} from '@chakra-ui/react'
import * as components from './components'
import * as foundations from './foundations'

const jaenTheme: Record<string, any> = {
  ...foundations,
  colors: {
    ...foundations.colors,
    brand: baseTheme.colors.cyan
  },
  components: {...components}
}

export const theme = extendTheme(jaenTheme)
