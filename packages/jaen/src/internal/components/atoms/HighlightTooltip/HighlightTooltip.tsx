import React from 'react'
import {useHighlight} from '../../../context/HighlightContext.js'

export interface HighlightTooltipProps {
  children: React.ReactNode
  actions: React.ReactNode[]
  isEditing?: boolean
}

export const HighlightTooltip: React.FC<HighlightTooltipProps> = props => {
  const {children, actions} = props

  const {ref} = useHighlight({tooltipButtons: actions})

  const Child: React.FC<{
    children: React.ReactNode
  }> = ({children}) => {
    const childrenWithRef = React.Children.map(
      children,
      (child: React.ReactElement<any>) => {
        return React.cloneElement(child, {ref})
      }
    )
    return <>{childrenWithRef}</>
  }

  return <Child>{children}</Child>
}
