import {toCSSVar} from '@chakra-ui/react'
import {ThemeProvider as EmotionThemeProvider} from '@emotion/react'
import {useMemo} from 'react'
import theme from './theme.js'

export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: Record<string, any>
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  const {theme: themeOverride} = props

  const t = themeOverride || theme

  const computedTheme = useMemo(() => toCSSVar(t), [t])

  return (
    <EmotionThemeProvider theme={computedTheme}>
      {props.children}
    </EmotionThemeProvider>
  )
}
