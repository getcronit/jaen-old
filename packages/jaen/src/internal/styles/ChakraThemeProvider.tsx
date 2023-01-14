import {toCSSVar} from '@chakra-ui/react'
import {useMemo} from 'react'
import {ThemeProvider as EmotionThemeProvider} from '@emotion/react'
import theme from './theme.js'

export interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const computedTheme = useMemo(() => toCSSVar(theme), [theme])
  return (
    <EmotionThemeProvider theme={computedTheme}>
      {props.children}
    </EmotionThemeProvider>
  )
}
