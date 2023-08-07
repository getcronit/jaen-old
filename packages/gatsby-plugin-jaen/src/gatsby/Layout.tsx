import {GlobalStyle, ThemeProvider} from '@chakra-ui/react'
import {LayoutProps} from '@snek-at/jaen'

import {JaenPageLayout} from '../components/JaenPageLayout'
import CustomLayout from '../components/Layout'
import userTheme from '../theme/theme'

const Layout: React.FC<LayoutProps> = ({children, pageProps}) => {
  const {pageConfig} = pageProps.pageContext

  // check if jaen theme is set
  const layout = pageConfig?.layout

  return layout?.name === 'jaen' ? (
    <JaenPageLayout layout={layout.width}>{children}</JaenPageLayout>
  ) : (
    <CustomLayout pageProps={pageProps}>
      <ThemeProvider theme={userTheme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </CustomLayout>
  )
}

export default Layout
