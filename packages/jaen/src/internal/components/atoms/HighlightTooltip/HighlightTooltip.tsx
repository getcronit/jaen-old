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

  const Child: React.FC<{
    children: React.ReactNode
  }> = ({children}) => {
    const childrenWithRef = React.Children.map(
      children,
      (child: React.ReactElement<any>) => {
        return React.cloneElement(child, {ref: setRefs, id: props.id})
      }
    )

    const Wrapper = props.as || React.Fragment

    return <Wrapper {...props.asProps}>{childrenWithRef}</Wrapper>
  }

  return <Child>{children}</Child>
})
