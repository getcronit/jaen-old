import {As, Button, Text, TextProps, Tooltip} from '@chakra-ui/react'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'

export interface TextFieldProps extends TextProps {
  as?: As
  asAs?: As
}

export const TextField = connectField<string, string, TextFieldProps>(
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
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Tooltip label={`ID: ${jaenField.id}`} placement="top-start">
              <Text>Text</Text>
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
          as={asAs}
          contentEditable={jaenField.isEditing}
          suppressContentEditableWarning
          onBlur={(e: any) => {
            console.log('e.target.value', e.target.innerHTML)

            handleTextSave(e.target.innerHTML)
          }}
          dangerouslySetInnerHTML={{
            __html:
              jaenField.value || jaenField.staticValue || jaenField.defaultValue
          }}
        />
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:TextField'
  }
)

// const CustomInput: React.FC<InputProps> = props => {
//   const [value, setValue] = useState(props.value)

//   return (
//     <Text
//       {...props}
//       onChange={(e: any) => {
//         setValue(e.target.value)
//       }}
//       onBlur={props.onBlur}
//       contentEditable={!props.isDisabled}
//       outline="0px solid transparent">
//       {value || props.defaultValue}
//     </Text>
//   )
// }
