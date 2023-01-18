import {Button, Icon, Text} from '@chakra-ui/react'
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
  Option,
  {
    displayName?: React.ReactNode
    options: Options
    render: ChoiceRenderFn
    renderPopover: ChoiceRenderFn | null
  }
>(
  ({jaenField, options, render, renderPopover}) => {
    const selection =
      jaenField.value || jaenField.staticValue || jaenField.defaultValue

    const actions = [
      <Button
        variant="jaenHighlightTooltipText"
        key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
        <Text as="span" noOfLines={1}>
          Choice {jaenField.name}
        </Text>
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
      <HighlightTooltip actions={actions}>
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
