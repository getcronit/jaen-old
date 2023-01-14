import {AddIcon, DeleteIcon} from '@chakra-ui/icons'
import {Box, Button, ButtonGroup, HStack, IconButton} from '@chakra-ui/react'
import React, {createContext, useContext, useEffect, useRef} from 'react'
import {createRoot} from 'react-dom/client'

import {useStatus} from '../hooks/useStatus.js'
import {ThemeProvider} from '../styles/ChakraThemeProvider.js'
import {CLASSNAMES} from '../styles/constants.js'

export interface HighlightProviderContextValue {
  // tooltips: TooltipRef[]
  // toggleTooltip: (index: number) => void
  ref: (ref: HTMLDivElement | null, actions: React.ReactNode[]) => void

  refresh: () => void
}

export const HighlightProviderContext =
  createContext<HighlightProviderContextValue>({
    ref: () => {},
    refresh: () => {}
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
        justifyContent={'center'}
        spacing="2"
        pointerEvents={'all'}>
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

  const ref = (
    ref: HTMLDivElement | null,
    tooltipButtons: React.ReactNode[]
  ) => {
    // append if not exists

    // find and update if exists else append

    const index = itemsRef.current.findIndex(item => item.ref === ref)

    if (index === -1) {
      itemsRef.current.push({
        ref,
        tooltipButtons
      })
    } else {
      itemsRef.current[index]!.tooltipButtons = tooltipButtons
    }
  }

  const [shouldRefresh, setIsRefreshing] = React.useState(false)

  const refresh = () => {
    setIsRefreshing(true)

    setTimeout(() => {
      setIsRefreshing(false)
    }, 0)
  }

  const {isEditing} = useStatus()

  const positionTooltip = (element: HTMLElement) => {
    if (getTooltips(element).length > 0) return

    const item = itemsRef.current.find(item => item.ref === element)
    const tooltipButtons = item?.tooltipButtons || []

    const tooltipRoot = element.appendChild(document.createElement('div'))

    tooltipRoot.classList.add(CLASSNAMES.JAEN_HIGHLIGHT_TOOLTIP)

    const root = createRoot(tooltipRoot)

    root.render(<Tooltip actions={tooltipButtons} />)
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

  useEffect(() => {
    // Add event listeners to all items in the array

    let parentElements: HTMLElement[] = []

    const handleMouseEnter = (currentTarget: EventTarget) => {
      if (!isEditing) return

      const target = currentTarget as HTMLDivElement

      positionTooltip(target)

      target.classList.add(CLASSNAMES.JAEN_HIGHLIGHT)

      // find nearest parent with classname
      const parentElement = target.parentElement?.closest(
        `.${CLASSNAMES.JAEN_HIGHLIGHT}`
      ) as HTMLElement

      if (parentElement) {
        // Remove classname from parent
        parentElement.classList.remove(CLASSNAMES.JAEN_HIGHLIGHT)
        parentElements.push(parentElement)

        // Find JAEN_HIGHLIGHT_TOOLTIP and remove it
        parentFindAndRemoveTooltip(parentElement)
      }
    }

    const handleMouseLeave = (currentTarget: EventTarget) => {
      const target = currentTarget as HTMLDivElement

      // Remove classname from target
      target.classList.remove(CLASSNAMES.JAEN_HIGHLIGHT)

      // Remove tooltip from target
      if (target) {
        parentFindAndRemoveTooltip(target)
      }

      const parentElement = parentElements.at(-1)

      if (parentElement) {
        // Re-add classname to last
        parentElement.classList.add(CLASSNAMES.JAEN_HIGHLIGHT)

        // Re-add tooltip to last
        positionTooltip(parentElement)

        parentElements.pop()
      }
    }

    // cancel previouse pending fn calls
    // const delayEventWithConcurrency = (
    //   fn: (currentTarget: Event['currentTarget']) => void,
    //   delay = 300
    // ) => {
    //   let timeout: ReturnType<typeof setTimeout>
    //   let target: Event['currentTarget']

    //   return (event: Event) => {
    //     const newTarget = event.currentTarget

    //     console.log(event.type, target, newTarget)

    //     if (newTarget !== target) {
    //       clearTimeout(timeout)
    //       target = newTarget

    //       timeout = setTimeout(() => {
    //         fn(target)
    //       }, delay)
    //     }
    //   }
    // }

    // const handleDelayedMouseEnter = delayEventWithConcurrency(handleMouseEnter)
    // const handleDelayedMouseLeave = delayEventWithConcurrency(handleMouseLeave)

    const withCurrentTarget = (
      fn: (currentTarget: Event['currentTarget']) => void
    ) => {
      return (event: Event) => {
        const target = event.currentTarget

        if (!target) return

        fn(target)
      }
    }

    const handleDelayedMouseEnter = withCurrentTarget(handleMouseEnter)
    const handleDelayedMouseLeave = withCurrentTarget(handleMouseLeave)

    itemsRef.current.forEach(({ref: item}) => {
      if (!item) return

      item.addEventListener('mouseenter', handleDelayedMouseEnter)
      item.addEventListener('mouseleave', handleDelayedMouseLeave)
    })

    return () => {
      // Remove event listeners from all items in the array

      itemsRef.current.forEach(({ref: item}) => {
        if (!item) return

        item.removeEventListener('mouseenter', handleDelayedMouseEnter)
        item.removeEventListener('mouseleave', handleDelayedMouseLeave)
      })
    }
  }, [isEditing, shouldRefresh])

  return (
    <HighlightProviderContext.Provider value={{ref, refresh}}>
      {children}
    </HighlightProviderContext.Provider>
  )
}

export interface UseHighlightProps {
  tooltipButtons: React.ReactNode[]
}

export const useHighlight = ({tooltipButtons}: UseHighlightProps) => {
  const {ref} = useContext(HighlightProviderContext)

  const refOnly = (theRef: HTMLDivElement | null) => ref(theRef, tooltipButtons)

  return {
    ref: refOnly
  }
}
