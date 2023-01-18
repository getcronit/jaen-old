import {HStack} from '@chakra-ui/react'
import React, {createContext, useContext, useEffect, useRef} from 'react'
import {createRoot} from 'react-dom/client'

import {useStatus} from '../hooks/useStatus.js'
import {ThemeProvider} from '../styles/ChakraThemeProvider.js'
import {CLASSNAMES} from '../styles/constants.js'

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

const Tooltip: React.FC<{
  actions: React.ReactNode[]
}> = ({actions}) => {
  return (
    <ThemeProvider>
      <HStack
        w="fit-content"
        mx="auto"
        justifyContent="center"
        spacing="1"
        pointerEvents="all">
        {actions.map((action, index) => (
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

  const positionTooltip = (element: HTMLElement) => {
    if (getTooltips(element).length > 0) return

    const item = itemsRef.current.find(item => item.ref === element)

    const tooltipButtons = item?.tooltipButtons || []

    const tooltipRoot = element.appendChild(document.createElement('div'))

    tooltipRoot.classList.add(CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP)

    const root = createRoot(tooltipRoot)

    root.render(<Tooltip actions={tooltipButtons} />)
  }

  const handleMouseOver = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLDivElement

    // find child element with classname JAEN_HIGHLIGHT
    const childElement = target.querySelector(
      `.${CLASSNAMES.JAEN_HIGHLIGHT}`
    ) as HTMLElement

    if (!childElement) {
      positionTooltip(target)

      target.classList.add(CLASSNAMES.JAEN_HIGHLIGHT)

      const parentElement = target.parentElement?.closest(
        `.${CLASSNAMES.JAEN_HIGHLIGHT}`
      ) as HTMLElement

      if (parentElement) {
        // Remove classname from parent
        parentElement.classList.remove(CLASSNAMES.JAEN_HIGHLIGHT)

        // Find JAEN_HIGHLIGHT_TOOLTIP and remove it
        parentFindAndRemoveTooltip(parentElement)
      }
    }
  }

  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLDivElement

    target.classList.remove(CLASSNAMES.JAEN_HIGHLIGHT)

    parentFindAndRemoveTooltip(target)
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

  const getTooltips = (parentElement: HTMLElement) => {
    const tooltips = parentElement.querySelectorAll(
      `:scope > .${CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP}`
    )

    return tooltips
  }

  const parentFindAndRemoveTooltip = (parentElement: HTMLElement) => {
    const tooltips = getTooltips(parentElement)

    tooltips.forEach(tooltip => {
      // remove tooltip from element
      parentElement.removeChild(tooltip)
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
