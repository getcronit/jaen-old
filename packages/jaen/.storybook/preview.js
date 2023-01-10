import theme from '../src/internal/styles/theme'
import {ModalProvider} from '../src/internal/context/Modals/ModalContext'
import {SiteProvider} from '../src/internal/context/SiteContext.js'

import {ChakraProvider} from '@chakra-ui/react'

// Gatsby's Link overrides:
// Gatsby Link calls the `enqueue` & `hovering` methods on the global variable ___loader.
// This global object isn't set in storybook context, requiring you to override it to empty functions (no-op),
// so Gatsby Link doesn't throw errors.
global.___loader = {
  enqueue: () => {},
  hovering: () => {}
}
// This global variable prevents the "__BASE_PATH__ is not defined" error inside Storybook.
global.__BASE_PATH__ = '/'
// Navigating through a gatsby app using gatsby-link or any other gatsby component will use the `___navigate` method.
// In Storybook, it makes more sense to log an action than doing an actual navigate. Check out the actions addon docs for more info: https://storybook.js.org/docs/react/essentials/actions
window.___navigate = pathname => {
  action('NavigateTo:')(pathname)
}

export const parameters = {
  chakra: {
    theme
  },
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export const decorators = [
  Story => (
    <ChakraProvider theme={theme}>
      <ModalProvider>
        <SiteProvider>
          <Story />
        </SiteProvider>
      </ModalProvider>
    </ChakraProvider>
  )
]
