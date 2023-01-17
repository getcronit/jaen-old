import {Box, Button, Text} from '@chakra-ui/react'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import Editor from '../../utils/CKEditor/index.js'

export interface TextFieldProps {
  rtf?: boolean
}

export const TextField = connectField<string, string, TextFieldProps>(
  ({jaenField, rtf = false}) => {
    console.log(jaenField)

    return (
      <HighlightTooltip
        actions={[
          <Button
            variant="jaenHighlightTooltipText"
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Text as="span" noOfLines={1}>
              Text {jaenField.name}
            </Text>
          </Button>
        ]}
        isEditing={jaenField.isEditing}>
        <Box style={jaenField.style} className={jaenField.className}>
          <Editor
            defaultValue={jaenField.staticValue || jaenField.defaultValue}
            value={jaenField.value}
            onBlurValue={data => {
              jaenField.onUpdateValue(data)
            }}
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
