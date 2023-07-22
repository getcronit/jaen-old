import {extendTheme} from '@chakra-ui/react'
import {jaenTheme} from './jaen-theme'
import userTheme from './theme'

export const theme = extendTheme(jaenTheme, userTheme)
