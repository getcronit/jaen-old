import {HStack} from '@chakra-ui/react'
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react'
import {createRoot} from 'react-dom/client'
import {useStatus} from '../hooks/useStatus.js'

import {ThemeProvider} from '../styles/ChakraThemeProvider.js'
import {CLASSNAMES, FONT_FAMILY} from '../styles/constants.js'

export interface HighlightProviderContextValue {
  ref: (ref: HTMLDivElement | null, actions: React.ReactNode[]) => void
}

export const HighlightProviderContext =
  createContext<HighlightProviderContextValue>({
    ref: () => {}
  })

export interface HighlightProviderProps {
  children: React.ReactNode
}

interface TooltipProps {
  actions: React.ReactNode[]
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  return (
    <ThemeProvider>
      <HStack
        ref={ref}
        id="coco"
        fontFamily={FONT_FAMILY}
        w="fit-content"
        mx="auto"
        justifyContent="center"
        spacing="1"
        pointerEvents="all">
        {/* <Button size="xs" colorScheme="blackAlpha">
          Edit block
        </Button> */}
        {props.actions.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </HStack>
    </ThemeProvider>
  )
})

export const HighlightProvider: React.FC<HighlightProviderProps> = props => {
  const itemsRef = useRef<
    Array<{
      ref: HTMLDivElement | null
      tooltipButtons: React.ReactNode[]
    }>
  >([])

  const tooltipHightRef = useRef<HTMLDivElement | null>(null)

  const setHighlight = (element: HTMLElement) => {
    const appRoot = document.getElementById('___gatsby')

    if (!appRoot) {
      alert('appRoot root not found, please contact support')
      return
    }

    // let highlighterRoot: HTMLDivElement | null = appRoot.querySelector(
    //   `.${CLASSNAMES.JAEN_HIGHLIGHT}`
    // )

    let frameRoot: HTMLDivElement | null = appRoot.querySelector(
      `.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}`
    )

    if (frameRoot) {
      frameRoot.remove()
    }

    frameRoot = appRoot.appendChild(document.createElement('div'))
    frameRoot.classList.add(CLASSNAMES.JAEN_HIGHLIGHT_FRAME)

    // include scroll
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    frameRoot.style.position = 'absolute'

    const tooltipRoot = frameRoot.appendChild(document.createElement('div'))

    tooltipRoot.classList.add(CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP)

    tooltipRoot.style.position = 'absolute'

    // Positions
    // add a observer to the frameRoot to re-position it when the element moves or resizes
    const observer = new ResizeObserver(entries => {
      const entry = entries[0]

      if (!entry) return

      const elementRect = entry.target.getBoundingClientRect()

      if (!frameRoot)
        throw new Error('elementRect is null. This should not happen.')

      // frameRoot exists because we just created it
      frameRoot.style.top = `${elementRect.top + scrollTop}px`
      frameRoot.style.left = `${elementRect.left + scrollLeft}px`
      frameRoot.style.width = `${elementRect.width}px`
      frameRoot.style.height = `${elementRect.height}px`

      tooltipRoot.style.width = `${elementRect.width}px`
    })

    observer.observe(element)

    const item = itemsRef.current.find(item => item.ref === element)

    if (item?.ref) {
      const tooltipButtons = item?.tooltipButtons || []
      const root = createRoot(tooltipRoot)
      root.render(<Tooltip actions={tooltipButtons} ref={tooltipHightRef} />)
    }

    frameRoot.addEventListener('mouseleave', handleMouseLeave)

    // move tooltip above element
    tooltipRoot.style.top = `-${20 + 22}px`
    // Padding to improve accessibility (hovering over the tooltip)
    tooltipRoot.style.padding = '9px'

    tooltipRoot.style.pointerEvents = 'all'
  }

  let removeHighlightTimeout: NodeJS.Timeout | null = null

  const handleMouseEnter = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLDivElement

    if (!target) return

    setHighlight(target)

    // If there is a scheduled removal, clear it
    if (removeHighlightTimeout) {
      clearTimeout(removeHighlightTimeout)
      removeHighlightTimeout = null
    }

    // if (!skipPropagation) {
    //   event.stopPropagation()
    // }
  }

  const findClosestParentMatching = (
    element: HTMLElement,
    find: (element: HTMLElement) => boolean
  ) => {
    let currentElement: HTMLElement | null = element

    while (currentElement) {
      if (find(currentElement)) {
        return currentElement
      }

      currentElement = currentElement.parentElement
    }

    return null
  }

  const handleMouseLeave = (event: MouseEvent) => {
    const highlightRoot = document.querySelector(
      `.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}`
    )

    if (!highlightRoot) return

    // do not remove highlighter if mouse is over tooltip

    const relatedTarget = event.relatedTarget as HTMLElement

    if (relatedTarget?.classList.contains(CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP)) {
      return
    }

    // find closest parent that matches one of the items
    const closestParent = findClosestParentMatching(relatedTarget, element => {
      return itemsRef.current.some(item => item.ref === element)
    })

    if (closestParent) {
      setHighlight(closestParent)
      return
    }

    // Schedule the removal of the highlighter
    removeHighlightTimeout = setTimeout(() => {
      highlightRoot.remove()
    }, 200)
  }

  const {isEditing} = useStatus()

  useEffect(() => {
    if (!isEditing) {
      itemsRef.current = []
    }
  }, [isEditing])

  const ref = (
    ref: HTMLDivElement | null,
    tooltipButtons: React.ReactNode[]
  ) => {
    const index = itemsRef.current.findIndex(item => {
      return item.ref === ref
    })

    if (ref) {
      // handle event listeners

      // ref.addEventListener('mouseover', handleMouseEnter)
      // ref.addEventListener('mouseleave', handleMouseLeave)

      if (isEditing) {
        ref.addEventListener('mouseenter', handleMouseEnter)
        ref.addEventListener('mouseleave', handleMouseLeave)
      } else {
        ref.removeEventListener('mouseenter', handleMouseEnter)
        ref.removeEventListener('mouseleave', handleMouseLeave)
      }

      if (index === -1) {
        itemsRef.current.push({ref, tooltipButtons})
      } else {
        itemsRef.current[index] = {ref, tooltipButtons}
      }
    }
  }

  const children = useMemo(() => {
    return props.children
  }, [props.children])

  return (
    <HighlightProviderContext.Provider value={{ref}}>
      {children}
    </HighlightProviderContext.Provider>
  )
}

export interface UseHighlightProps {
  tooltipButtons: React.ReactNode[]
}

export const useHighlight = ({tooltipButtons}: UseHighlightProps) => {
  const {ref} = useContext(HighlightProviderContext)

  const refOnly = (theRef: HTMLDivElement | null) => {
    ref(theRef, tooltipButtons)
  }

  return {
    ref: refOnly
  }
}

export default HighlightProvider
