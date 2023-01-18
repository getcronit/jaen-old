import {extendTheme, withDefaultColorScheme} from '@chakra-ui/react'
import {CLASSNAMES} from './constants.js'

const theme = extendTheme(
  {
    styles: {
      global: {
        [`.${CLASSNAMES.JAEN_HIGHLIGHT}`]: {
          // // boxShadow: 'inset 5px 5px 10px #555;',
          // outline: '2px solid var(--chakra-colors-pink-100)',
          // outlineOffset: '4px', // 'var(--chakra-space-1)',
          // 'outline-radius': '11px', // 'var(--chakra-radii-lg)',
          // zIndex: 'var(--chakra-zIndices-docked)'
          position: 'relative'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT}:before`]: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 'var(--chakra-zIndices-docked)',
          outline: '2px solid var(--chakra-colors-pink-100)',
          outlineOffset: '4px', // 'var(--chakra-space-1)',
          borderRadius: '11px', // 'var(--chakra-radii-lg)'
          pointerEvents: 'none'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP}`]: {
          height: '100%',
          width: '100%',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0
        }
      }
    },
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
          },
          jaenHighlightTooltip: {
            bg: 'pink.100',
            color: 'pink.900',
            _hover: {
              bg: 'pink.200'
            },
            borderRadius: '0.5em',
            fontWeight: 'normal',
            fontSize: 'xs',
            height: '6',
            minWidth: '6',
            px: '2'
          },
          jaenHighlightTooltipText: {
            bg: 'pink.100',
            color: 'pink.900',
            _hover: {
              bg: 'pink.100',
              color: 'pink.900'
            },
            borderRadius: 'full',
            fontWeight: 'normal',
            cursor: 'default',
            fontSize: 'xs',
            height: '6',
            minWidth: '6',
            px: '2',
            mr: '2'
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
