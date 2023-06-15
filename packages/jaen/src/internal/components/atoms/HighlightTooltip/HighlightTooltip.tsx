import {As, Box, BoxProps} from '@chakra-ui/react'
import React, {forwardRef, useCallback, useMemo} from 'react'

import {useHighlight} from '../../../context/HighlightContext.js'

export interface HighlightTooltipProps extends Omit<BoxProps, 'children'> {
  id?: string
  children?:
    | React.ReactNode
    | ((props: {
        ref: (node: HTMLDivElement) => void
        tabIndex?: number
      }) => React.ReactNode)
  as?: As
  asAs?: As
  actions: React.ReactNode[]
  isEditing?: boolean
}

export const HighlightTooltip = forwardRef<
  HTMLDivElement,
  HighlightTooltipProps
>(({actions, as, asAs, isEditing, children, ...props}, ref) => {
  const {ref: highlightRef} = useHighlight({tooltipButtons: actions})

  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      // handle ref and highlightRef

      if (typeof ref === 'function') {
        ref(node)
      } else {
        if (ref) ref.current = node
      }

      highlightRef(node)
    },
    [ref, highlightRef]
  )

  const Wrapper = as || Box

  const memoedChildren = useMemo(() => {
    if (typeof children === 'function') {
      return children({ref: setRefs, tabIndex: isEditing ? 1 : undefined})
    }

    return children
  }, [setRefs, isEditing, children])

  if (typeof children === 'function') {
    return (
      <Wrapper
        {...props}
        as={asAs}
        id={props.id}
        _focus={{
          outline: 'none'
        }}>
        {memoedChildren}
      </Wrapper>
    )
  }

  return (
    <Wrapper
      {...props}
      ref={setRefs}
      as={asAs}
      id={props.id}
      tabIndex={isEditing ? 1 : undefined}
      _focus={{
        outline: 'none'
      }}>
      {memoedChildren}
    </Wrapper>
  )
})
