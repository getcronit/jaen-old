import {Box} from '@chakra-ui/react'
import React, {forwardRef, useCallback} from 'react'

import {useHighlight} from '../../../context/HighlightContext.js'

export interface HighlightTooltipProps {
  id?: string
  children: React.ReactNode
  as?: React.ComponentType<React.HTMLAttributes<HTMLElement>>
  asProps?: Record<string, any>
  actions: React.ReactNode[]
  isEditing?: boolean
}

export const HighlightTooltip = forwardRef<
  HTMLDivElement,
  HighlightTooltipProps
>((props, ref) => {
  const {children, actions} = props

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

  const Wrapper = props.as || Box

  return (
    <Wrapper
      h="fit-content"
      w="fit-content"
      {...props.asProps}
      id={props.id}
      ref={setRefs}
      tabIndex={props.isEditing ? 1 : undefined}
      _focus={{
        outline: 'none'
      }}>
      {children}
    </Wrapper>
  )
})
