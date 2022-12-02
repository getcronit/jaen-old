import {ThemeProvider, theme} from '@chakra-ui/react'
import React from 'react'

export const withDefaultTheme = (node: React.ReactNode) => {
  return <ThemeProvider theme={theme}>{node}</ThemeProvider>
}
