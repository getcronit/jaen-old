import {extendTheme} from '@chakra-ui/react'

import {jaenTheme} from './jaen-theme'
import userTheme from './theme'

console.log('userTheme', userTheme)

export const theme = extendTheme(jaenTheme, userTheme)

console.log('theme', theme)
