import {Box, Button, Text, Tooltip} from '@chakra-ui/react'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'
import Editor from '../../utils/CKEditor/index.js'

export interface TextFieldProps {
  rtf?: boolean
}

export const TextField = connectField<string, string, TextFieldProps>(
  ({jaenField, rtf = false}) => {
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
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Tooltip label={`ID: ${jaenField.id}`} placement="top-start">
              <Text>Text</Text>
            </Tooltip>
          </Button>
        ]}
        isEditing={jaenField.isEditing}>
        <Box style={jaenField.style} className={jaenField.className}>
          <Editor
            defaultValue={jaenField.staticValue || jaenField.defaultValue || ''}
            value={jaenField.value}
            onBlurValue={handleTextSave}
            editing={jaenField.isEditing}
            disableToolbar={!rtf}
          />
        </Box>
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:TextField'
  }
)
