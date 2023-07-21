import {toCSSVar} from '@chakra-ui/react'
import {ThemeProvider as EmotionThemeProvider} from '@emotion/react'
import React, {useMemo} from 'react'

import {theme} from './theme/index.js'

export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: Record<string, any>
  cssVarsRoot?: string
}

// let registeredCssVars: {
//   [key: string]: boolean
// } = {}

export function JaenThemeProvider({
  cssVarsRoot = 'coco',
  ...props
}: ThemeProviderProps): JSX.Element {
  const {theme: themeOverride} = props

  const t = themeOverride || theme

  const computedTheme = useMemo(() => toCSSVar(t), [t])

  return (
    <EmotionThemeProvider theme={computedTheme}>
      {/* {<CSSVars root={`#${cssVarsRoot}` || ':host, :root'} />} */}

      {React.Children.map(props.children, (child: React.ReactElement) => {
        if (!React.isValidElement(child)) {
          return child
        }

        return React.cloneElement(child as React.ReactElement, {
          id: cssVarsRoot
        })
      })}
    </EmotionThemeProvider>
  )
}
