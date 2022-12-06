import {Box} from '@chakra-ui/react'

import Editor from '../../utils/CKEditor/index.js'
import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'

export interface TextFieldProps {
  rtf?: boolean
}

export const TextField = connectField<string, string, TextFieldProps>(
  ({jaenField, rtf = false}) => {
    console.log(jaenField)

    return (
      <Box style={jaenField.style} className={jaenField.className}>
        <HighlightTooltip
          actions={[`Text (${jaenField.name})`]}
          isEditing={jaenField.isEditing}>
          <Editor
            defaultValue={jaenField.staticValue || jaenField.defaultValue}
            value={jaenField.value}
            onBlurValue={data => jaenField.onUpdateValue(data)}
            editing={jaenField.isEditing}
            disableToolbar={!rtf}
          />
        </HighlightTooltip>
      </Box>
    )
  },
  {
    fieldType: 'IMA:TextField'
  }
)
