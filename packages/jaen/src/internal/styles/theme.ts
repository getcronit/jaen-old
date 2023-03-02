import {theme as proTheme} from '@chakra-ui/pro-theme'

import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme
} from '@chakra-ui/react'

import {CLASSNAMES} from './constants.js'

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; '

const theme = extendTheme(
  {
    colors: {
      ...baseTheme.colors,
      brand: baseTheme.colors.blue
    },
    fonts: {
      body: fontFamily,
      heading: fontFamily,
      mono: fontFamily
    },

    styles: {
      global: {
        [`.${CLASSNAMES.JAEN_HIGHLIGHT}`]: {
          // // boxShadow: 'inset 5px 5px 10px #555;',
          // outline: '2px solid var(--chakra-colors-pink-100)',
          // outlineOffset: '4px', // 'var(--chakra-space-1)',
          // 'outline-radius': '11px', // 'var(--chakra-radii-lg)',
          // zIndex: 'var(--chakra-zIndices-docked)'
          position: 'relative',
          zIndex: 'var(--chakra-zIndices-docked)'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT}:before`]: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 'var(--chakra-zIndices-docked)',
          border: '2px solid var(--chakra-colors-pink-100)',
          // outlineOffset: '4px', // 'var(--chakra-space-1)',
          // borderRadius: 'var(--chakra-radii-md)', //'11px', // 'var(--chakra-radii-lg)'
          pointerEvents: 'none'
          // margin: '0.5em'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP}`]: {
          height: '100%',
          width: '100%',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0
        },
        'html, body, #root, #___gatsby': {
          // height: '100%',
          // width: '100%',
          margin: 0,
          display: 'block',

          // 'overscroll-behavior-x': 'none',
          '&::-webkit-scrollbar': {
            width: '16px',
            height: '16px'
          },
          '&::-webkit-scrollbar-corner, &::-webkit-scrollbar-track': {
            background: 'rgb(240, 241, 244)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(105, 112, 125, 0.5)',
            backgroundClip: 'content-box',
            borderRadius: '16px',
            border: '4px solid rgb(240, 241, 244)'
          }
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
        },
        variants: {
          white: {
            color: 'white',
            _hover: {
              color: 'gray.100',
              textDecoration: 'underline'
            },
            _active: {
              color: 'gray.200'
            }
          },
          black: {
            color: 'black',
            _hover: {
              color: 'gray.900',
              textDecoration: 'underline'
            },
            _active: {
              color: 'blue.700'
            }
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
  withDefaultColorScheme({
    colorScheme: 'pink'
  }),
  proTheme
)

export default theme
