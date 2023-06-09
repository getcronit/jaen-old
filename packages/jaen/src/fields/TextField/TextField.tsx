import {As, Button, Text, TextProps, Tooltip} from '@chakra-ui/react'
import {useCallback, useEffect} from 'react'
import {useDebouncedCallback} from 'use-debounce'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'

export interface TextFieldProps extends Omit<TextProps, 'children'> {
  as?: As
  asAs?: As
  defaultValue?: string
}

export const TextField = connectField<string, TextFieldProps>(
  ({jaenField, defaultValue, as: Wrapper = Text, asAs, ...rest}) => {
    const value = jaenField.value || jaenField.staticValue || defaultValue

    const {toast} = useModals()

    // @ts-expect-error
    const isWrapperHeading = Wrapper.displayName === 'Heading'

    if (isWrapperHeading && !asAs) {
      asAs = 'h2'
    }

    const handleTextSave = useDebouncedCallback(
      useCallback(
        (data: string | null) => {
          // skip if data has not changed

          if (data === value) {
            return
          }

          jaenField.onUpdateValue(data || undefined)

          toast({
            title: 'Text saved',
            description: 'The text has been saved',
            status: 'info'
          })
        },
        [value]
      ),
      500
    )

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

    const onContentBlur = useCallback((evt: FocusEvent) => {
      handleTextSave((evt.currentTarget as HTMLElement).innerHTML)
    }, [])

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
        isEditing={jaenField.isEditing}
        as={Wrapper}
        asProps={{
          minW: '1rem',
          ...rest,
          className: jaenField.className,
          style: {
            ...jaenField.style,
            ...rest.style
          },
          contentEditable: jaenField.isEditing,
          onBlur: onContentBlur
        }}>
        {value}
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
