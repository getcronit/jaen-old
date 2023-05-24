import {Button, Icon, Text, Tooltip} from '@chakra-ui/react'
import {IoOptions} from 'react-icons/io5'

import {connectField} from '../../connectors/index.js'
import {
  HighlightTooltip,
  SelectorButton
} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'

type Options = string[]
type Option = Options[number] | null

type ChoiceRenderFn = (
  selection: Option,
  options: Options,
  select: (option: Option) => void,
  isEditing: boolean
) => JSX.Element

export const ChoiceField = connectField<
  Option,
  {
    defaultValue: Option
    label?: React.ReactNode
    options: Options
    render: ChoiceRenderFn
    renderPopover: ChoiceRenderFn | null
  }
>(
  ({jaenField, defaultValue, options, render, renderPopover}) => {
    const selection = jaenField.value || jaenField.staticValue || defaultValue

    const actions = [
      <Button
        variant="jaenHighlightTooltipText"
        key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
        <Tooltip label={`ID: ${jaenField.id}`} placement="top-start">
          <Text>Choice</Text>
        </Tooltip>
      </Button>
    ]

    const {toast} = useModals()

    const selectAndClose = (onClose: () => void) => (value: Option) => {
      jaenField.onUpdateValue(value)
      onClose()

      toast({
        title: 'Choice saved',
        description: 'The choice has been saved',
        status: 'info'
      })
    }

    if (renderPopover) {
      actions.push(
        <SelectorButton
          key={`jaen-highlight-tooltip-button-${jaenField.name}`}
          icon={<Icon as={IoOptions} />}>
          {({onClose}) =>
            renderPopover(
              selection,
              options,
              selectAndClose(onClose),
              jaenField.isEditing
            )
          }
        </SelectorButton>
      )
    }

    return (
      <HighlightTooltip id={jaenField.id} actions={actions}>
        {render(
          selection,
          options,
          jaenField.onUpdateValue,
          jaenField.isEditing
        )}
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:ChoiceField'
  }
)

export type ChoiceFieldProps = Parameters<typeof ChoiceField>
