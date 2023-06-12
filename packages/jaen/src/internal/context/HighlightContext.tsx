import {HStack} from '@chakra-ui/react'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
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
        mt="-6"
        p="1"
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
  const [items, setItems] = useState<
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

    tooltipRoot.style.position = 'sticky'

    // move tooltip above element
    tooltipRoot.style.top = `3.5rem`

    tooltipRoot.style.pointerEvents = 'none'

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

      tooltipRoot.style.width = '100%'
    })

    observer.observe(element)

    const item = items.find(item => item.ref === element)

    if (item?.ref) {
      const tooltipButtons = item?.tooltipButtons || []
      const root = createRoot(tooltipRoot)
      root.render(<Tooltip actions={tooltipButtons} ref={tooltipHightRef} />)
    }
  }

  const findClosestParentMatching = (
    element: HTMLElement,
    find: (element: HTMLElement) => boolean
  ) => {
    let currentElement: HTMLElement | null = element
    let index = -1

    while (currentElement) {
      index++
      if (find(currentElement)) {
        return {element: currentElement, index}
      }

      currentElement = currentElement.parentElement
    }

    return null
  }

  const {isEditing} = useStatus()

  const ref = useCallback(
    (ref: HTMLDivElement | null, tooltipButtons: React.ReactNode[]) => {
      if (ref) {
        const index = items.findIndex(item => {
          return item.ref === ref
        })

        if (index === -1) {
          setItems([...items, {ref, tooltipButtons}])
        }

        // if tooltipButtons are different, update it
        if (items[index]?.tooltipButtons !== tooltipButtons) {
          const newItems = [...items]
          newItems[index] = {ref, tooltipButtons}
          setItems(newItems)
        }
      }

      console.log('ref', ref)
    },
    [items]
  )

  useEffect(() => {
    // ref.addEventListener('mouseenter', () => {
    //   ref.focus({
    //     preventScroll: true
    //   })
    // })

    // ref.addEventListener('mouseleave', e => {
    //   const relatedTarget = e.relatedTarget as HTMLElement

    //   // check if relatedTarget is a itemsRef

    //   if (relatedTarget) {
    //     const index = items.findIndex(item => {
    //       return item.ref === relatedTarget
    //     })

    //     if (index !== -1) {
    //       return
    //     }

    //     const closestParent = findClosestParentMatching(
    //       relatedTarget,
    //       element => {
    //         return items.some(item => item.ref === element)
    //       }
    //     )

    //     // Get ref of relatedTarget
    //     const relatedRef = items.find(
    //       item => item.ref === closestParent
    //     )

    //     if (relatedRef?.ref) {
    //       relatedRef.ref.focus({
    //         preventScroll: true
    //       })
    //     }
    //   }
    // })

    // ref.addEventListener('focus', () => {
    //   if (!isEditing) return

    //   alert('focus ' + isEditing)

    //   setHighlight(ref)
    // })

    // ref.addEventListener('blur', e => {
    //   if (!isEditing) return

    //   const highlightRoot = document.querySelector(
    //     `.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}`
    //   )

    //   if (!highlightRoot) return

    //   // Check if the blur event is caused by a click on the tooltip
    //   // check if tooltip ref contains relatedTarget
    //   if (tooltipHightRef.current?.contains(e.relatedTarget as Node)) {
    //     return
    //   }

    //   // Do not remove the highlight if the new focus is on a child of the original element
    //   if (ref.contains(e.relatedTarget as Node)) {
    //     return
    //   }

    //   highlightRoot.remove()
    // })

    const mouseEnterHandler = (e: MouseEvent) => {
      if (!isEditing) return

      const element = e.target as HTMLElement

      element.focus({
        preventScroll: true
      })
    }

    const mouseLeaveHandler = (e: MouseEvent) => {
      if (!isEditing) {
        return
      }

      const relatedTarget = e.relatedTarget as HTMLElement

      const nextItem = items.find(item => item.ref === relatedTarget)

      if (nextItem) {
        nextItem?.ref?.focus({
          preventScroll: true
        })
      } else {
        const closestParent = findClosestParentMatching(
          relatedTarget,
          element => items.some(item => item.ref === element)
        )

        if (closestParent) {
          const closestItem = items.find(
            item => item.ref === closestParent.element
          )

          closestItem?.ref?.focus({
            preventScroll: true
          })
        }
      }
    }

    const focusHandler = (e: FocusEvent) => {
      if (!isEditing) return

      const element = e.target as HTMLElement

      // set the cursor to the end of the element if it is a contenteditable element
      if (element.isContentEditable) {
        const range = document.createRange()
        const selection = window.getSelection()

        if (!selection) return

        range.selectNodeContents(element)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }

      setHighlight(element)
    }

    const blurHandler = (e: FocusEvent) => {
      if (!isEditing) return

      const highlightRoot = document.querySelector(
        `.${CLASSNAMES.JAEN_HIGHLIGHT_FRAME}`
      )

      if (!highlightRoot) return

      // Check if the blur event is caused by a click on the tooltip
      // check if tooltip ref contains relatedTarget
      if (tooltipHightRef.current?.contains(e.relatedTarget as Node)) {
        return
      }

      const element = e.currentTarget as HTMLElement

      // Do not remove the highlight if the new focus is on a child of the original element
      if (element.contains(e.relatedTarget as Node)) {
        return
      }

      highlightRoot.remove()
    }

    // append event listeners to all itemsRef

    for (const item of items) {
      if (!item.ref) continue

      item.ref.addEventListener('mouseenter', mouseEnterHandler)
      item.ref.addEventListener('mouseleave', mouseLeaveHandler)
      item.ref.addEventListener('focus', focusHandler)
      item.ref.addEventListener('blur', blurHandler)
    }

    return () => {
      for (const item of items) {
        if (!item.ref) continue

        item.ref.removeEventListener('mouseenter', mouseEnterHandler)
        item.ref.removeEventListener('mouseleave', mouseLeaveHandler)
        item.ref.removeEventListener('focus', focusHandler)
        item.ref.removeEventListener('blur', blurHandler)
      }
    }
  }, [isEditing, items])

  return (
    <HighlightProviderContext.Provider value={{ref}}>
      {props.children}
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
