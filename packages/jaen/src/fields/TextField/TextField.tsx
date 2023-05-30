import {As, Button, Text, TextProps, Tooltip} from '@chakra-ui/react'
import {useEffect} from 'react'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'

export interface TextFieldProps extends TextProps {
  as?: As
  asAs?: As
  defaultValue?: string
}

export const TextField = connectField<string, TextFieldProps>(
  ({jaenField, defaultValue, as: Wrapper = Text, asAs, ...rest}) => {
    const {toast} = useModals()

    // @ts-expect-error
    const isWrapperHeading = Wrapper.displayName === 'Heading'

    if (isWrapperHeading && !asAs) {
      asAs = 'h2'
    }

    const handleTextSave = (data: string) => {
      jaenField.onUpdateValue(data)

      toast({
        title: 'Text saved',
        description: 'The text has been saved',
        status: 'info'
      })
    }

    useEffect(() => {
      if (jaenField.isEditing) {
        const as =
          typeof Wrapper === 'string'
            ? Wrapper
            : typeof asAs === 'string'
            ? asAs
            : undefined

        jaenField.register({
          as
        })
      }
    }, [jaenField.isEditing])

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
            console.log('e.target.value', e.target.textContent)

            handleTextSave(e.target.textContent)
          }}>
          {jaenField.value || jaenField.staticValue || defaultValue}
        </Wrapper>
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
