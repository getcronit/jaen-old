// theme.ts
import React, {createContext, ReactNode, useContext} from 'react'

// Create the context with an initial default value for the theme
const JaenThemeContext = createContext<Record<string, unknown> | null>(null)

// Create a custom hook to access the theme context
export function useJaenTheme() {
  const theme = useContext(JaenThemeContext)
  if (!theme) {
    throw new Error('useJaenTheme must be used within a JaenThemeProvider')
  }
  return theme
}

// JaenThemeProvider component
interface JaenThemeProviderProps {
  theme: Record<string, unknown>
  children: ReactNode
}

const JaenThemeProvider: React.FC<JaenThemeProviderProps> = ({
  theme,
  children
}) => {
  return (
    <JaenThemeContext.Provider value={theme}>
      {children}
    </JaenThemeContext.Provider>
  )
}

export {JaenThemeContext, JaenThemeProvider}
