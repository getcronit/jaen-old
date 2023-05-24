import {theme as proTheme} from '@chakra-ui/pro-theme'

import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme
} from '@chakra-ui/react'
import {CLASSNAMES, FONT_FAMILY} from './constants.js'

import 'react-photo-view/dist/react-photo-view.css'

const theme = extendTheme(
  {
    colors: {
      ...baseTheme.colors,
      brand: baseTheme.colors.blue
    },
    fonts: {
      body: FONT_FAMILY,
      heading: FONT_FAMILY,
      mono: FONT_FAMILY
    },
    fontSizes: {
      ...baseTheme.fontSizes
    },

    styles: {
      global: {
        [`.${CLASSNAMES.JAEN_ADMIN_BODY}`]: {
          minH: 'calc(100vh - 7rem)'
        },
        'div:has(div):has(.jaen-image-wrapper)': {
          // maybe no longer needed
          isolation: 'isolate'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}`]: {
          borderRadius: '11px',
          pointerEvents: 'none'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}:before`]: {
          content: '""',
          position: 'absolute',
          top: '-6px', // border: 2px + offset: 4px
          right: ' -6px', // border: 2px + offset: 4px
          bottom: '-6px', // border: 2px + offset: 4px
          left: '-6px', // border: 2px + offset: 4px
          border: ' 2px solid var(--chakra-colors-pink-100)',
          borderRadius: '15px', // border—radius: 11px + offset: 4px
          pointerEvents: 'none'
        },
        [`.${CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP}`]: {
          // backgroundColor: 'rgba(254, 215, 226, 0.4)'
        },
        // [`.${CLASSNAMES.JAEN_HIGHLIGHT}`]: {
        //   position: 'absolute',
        //   borderRadius: '11px',
        //   pointerEvents: 'none'
        // },
        // [`.${CLASSNAMES.JAEN_HIGHLIGHT}:before`]: {
        //   content: '""',
        //   position: 'absolute',
        //   top: '-6px', // border: 2px + offset: 4px
        //   right: ' -6px', // border: 2px + offset: 4px
        //   bottom: '-6px', // border: 2px + offset: 4px
        //   left: '-6px', // border: 2px + offset: 4px
        //   border: ' 2px solid var(--chakra-colors-pink-100)',
        //   borderRadius: '15px', // border—radius: 11px + offset: 4px
        //   pointerEvents: 'none'
        // },
        // [`.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}`]: {
        //   position: 'absolute',
        //   borderRadius: '11px',
        //   pointerEvents: 'none'
        // },

        // [`.${CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP}`]: {
        //   position: 'absolute',
        //   pointerEvents: 'all',
        //   // height: '',
        //   py: '10px',
        //   mb: '25px',
        //   // // negative top value to position tooltip above highlight
        //   top: '-40px'
        // },
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
            bg: 'rgba(254, 215, 226, 0.8)',
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
            bg: 'rgba(254, 215, 226, 0.8)',
            color: 'pink.900',
            // _hover: {
            //   bg: 'pink.100',
            //   color: 'pink.900'
            // },
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
