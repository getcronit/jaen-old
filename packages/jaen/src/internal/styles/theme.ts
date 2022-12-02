import {extendTheme, withDefaultColorScheme} from '@chakra-ui/react'

const theme = extendTheme(
  {
    components: {
      Link: {
        baseStyle: {
          color: 'blue.500',
          _hover: {
            color: 'blue.600',
            textDecoration: 'underline'
          },
          _active: {
            color: 'blue.700'
          }
        }
      },
      Button: {
        variants: {
          darkGhost: {
            bg: 'gray.800',
            color: 'white',
            _hover: {
              bg: 'gray.700'
            },
            _active: {
              bg: 'gray.700'
            }
          }
        }
      }
    },
    shadows: {
      // This is also possible. Not sure I like inject this into
      // an existing theme section.
      // It creates a CSS variable named --chakra-shadows-focus-ring-color
      // 'focus-ring-color': 'rgba(255, 0, 125, 0.6)',
      // outline: '0 0 0 3px var(--chakra-ui-focus-ring-color)',
      outline: '0 0 0 3px var(--chakra-colors-pink-400)'
    }
  },
  withDefaultColorScheme({colorScheme: 'pink'})
)

export default theme
