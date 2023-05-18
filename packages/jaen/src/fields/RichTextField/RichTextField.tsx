import {As, Button, Text, TextProps, Tooltip} from '@chakra-ui/react'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'
import Editor from '../../utils/CKEditor/index.js'

export interface RichTextFieldProps extends TextProps {
  as?: As
  asAs?: As
}

export const RichTextField = connectField<string, string, RichTextFieldProps>(
  ({jaenField, as: Wrapper = Text, asAs, ...rest}) => {
    const {toast} = useModals()

    const handleTextSave = (data: string) => {
      jaenField.onUpdateValue(data)

      toast({
        title: 'Text saved',
        description: 'The text has been saved',
        status: 'info'
      })
    }

    return (
      <HighlightTooltip
        id={jaenField.id}
        actions={[
          <Button
            variant="jaenHighlightTooltipText"
            key={`jaen-highlight-tooltip-rich-text-${jaenField.name}`}>
            <Tooltip label={`ID: ${jaenField.id}`} placement="top-start">
              <Text>RichText</Text>
            </Tooltip>
          </Button>
        ]}
        isEditing={jaenField.isEditing}>
        <Wrapper
          {...rest}
          style={{
            ...jaenField.style,
            outline: '0px solid transparent'
          }}
          className={jaenField.className}
          as={asAs}>
          <Editor
            defaultValue={jaenField.staticValue || jaenField.defaultValue}
            value={jaenField.value}
            onBlurValue={handleTextSave}
            editing={jaenField.isEditing}
            disableToolbar={false}
          />
        </Wrapper>
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:RichTextField'
  }
)
