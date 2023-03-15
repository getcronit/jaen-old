import {HStack} from '@chakra-ui/react'
import React, {createContext, useContext, useEffect, useRef} from 'react'
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

const closestSibling = (
  element: Element,
  selector: string
): HTMLElement | null => {
  // Finds the closest sibling of any ancestor of the element

  // Test all siblings on the current level

  const siblings = Array.from(element.parentElement?.children || [])

  for (const sibling of siblings) {
    if (sibling.matches(selector)) return sibling as HTMLElement
  }

  // If no siblings found, go up one level and try again

  if (element.parentElement) {
    return closestSibling(element.parentElement, selector)
  }

  return null
}

interface TooltipProps {
  actions: React.ReactNode[]
  ref: HTMLDivElement
}

const Tooltip: React.FC<TooltipProps> = props => {
  return (
    <ThemeProvider>
      <HStack
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
}

export const HighlightProvider: React.FC<HighlightProviderProps> = ({
  children
}) => {
  const itemsRef = useRef<
    Array<{
      ref: HTMLDivElement | null
      tooltipButtons: React.ReactNode[]
    }>
  >([])

  const setHighlight = (element: HTMLElement) => {
    const highlighterRoot = element.parentNode?.insertBefore(
      document.createElement('div'),
      element
    ) as HTMLElement

    const tooltipRoot = highlighterRoot.appendChild(
      document.createElement('div')
    )

    tooltipRoot.classList.add(CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP)

    highlighterRoot.classList.add(CLASSNAMES.JAEN_HIGHLIGHT)

    // set width of highlighter to width of element

    highlighterRoot.style.width = `${element.offsetWidth}px`

    // set height of highlighter to height of element

    highlighterRoot.style.height = `${element.offsetHeight}px`

    // set top of highlighter to top of element

    highlighterRoot.style.top = `${element.offsetTop}px`

    // set left of highlighter to left of element

    highlighterRoot.style.left = `${element.offsetLeft}px`

    //> Tooltip

    // set width of tooltip to width of element
    tooltipRoot.style.width = `${element.offsetWidth}px`

    // padding tooltip to improve accessibility (hovering over the tooltip)
    // tooltipRoot.style.padding = '5px'

    if (getHighlights(element).length > 0) return

    const item = itemsRef.current.find(item => item.ref === element)

    if (item?.ref) {
      const tooltipButtons = item?.tooltipButtons || []

      const root = createRoot(tooltipRoot)

      // @ts-ignore
      root.render(<Tooltip actions={tooltipButtons} ref={element} />)
    }
  }

  const handleMouseOver = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLDivElement

    if (!target) return

    // skip if element is the tooltip
    if (target.classList.contains(CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP)) return

    // find child element with classname JAEN_HIGHLIGHT
    const childElement = target.parentElement?.querySelector(
      `.${CLASSNAMES.JAEN_HIGHLIGHT}`
    )

    if (!childElement) {
      setHighlight(target)

      const closestParentHighlight = closestSibling(
        target.parentElement as Element,
        `.${CLASSNAMES.JAEN_HIGHLIGHT}`
      )

      if (closestParentHighlight?.parentElement) {
        findAndRemoveHighlight(closestParentHighlight.parentElement)
      }
    }
  }

  const handleMouseLeave = (event: MouseEvent) => {
    const currentTarget = event.currentTarget as HTMLDivElement
    const relatedTarget = event.relatedTarget as HTMLDivElement

    console.log('relatedTarget', relatedTarget)

    const isHighlightTooltip = relatedTarget?.classList.contains(
      CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP
    )

    const target = currentTarget.parentElement

    console.log('mouseleave event', event)

    if (!target) return

    // if tooltip is hovered, do not remove highlight, instead add
    // a event listener to remove highlight when mouse leaves tooltip
    if (isHighlightTooltip) {
      relatedTarget.addEventListener('mouseleave', () => {
        findAndRemoveHighlight(target)
      })

      return
    }

    findAndRemoveHighlight(target)
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
    const index = itemsRef.current.findIndex(item => item.ref === ref)

    if (ref) {
      // handle event listeners

      if (isEditing) {
        ref.addEventListener('mouseover', handleMouseOver)
        ref.addEventListener('mouseleave', handleMouseLeave)
      } else {
        ref.removeEventListener('mouseover', handleMouseOver)
        ref.removeEventListener('mouseleave', handleMouseLeave)
      }

      if (index === -1) {
        itemsRef.current.push({ref, tooltipButtons})
      } else {
        itemsRef.current[index] = {ref, tooltipButtons}
      }
    }
  }

  const getHighlights = (parentElement: HTMLElement) => {
    return parentElement.querySelectorAll(
      `:scope > .${CLASSNAMES.JAEN_HIGHLIGHT}`
    )
  }

  const findAndRemoveHighlight = (element: HTMLElement) => {
    // check if element is a tooltip, if so skip

    const highlights = getHighlights(element)

    highlights.forEach(highlight => {
      // remove highlight from element

      console.log('highlight', highlight)

      element.removeChild(highlight)
    })
  }

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
