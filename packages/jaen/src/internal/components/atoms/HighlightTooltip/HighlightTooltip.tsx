import {useHighlight} from '../../../context/HighlightContext.js'

export interface HighlightTooltipProps {
  children: React.ReactNode
  actions: React.ReactNode[]
  isEditing?: boolean
}

export const HighlightTooltip: React.FC<HighlightTooltipProps> = props => {
  const {children, actions} = props

  const {ref} = useHighlight({tooltipButtons: actions})

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        height: '100%'
      }}>
      {children}
    </div>
  )
}
