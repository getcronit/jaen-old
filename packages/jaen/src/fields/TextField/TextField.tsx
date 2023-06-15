import {As, Box, Button, Text, TextProps, Tooltip} from '@chakra-ui/react'
import DOMPurify from 'dompurify'
import {useCallback, useEffect} from 'react'
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline
} from 'react-icons/fa'
import {useDebouncedCallback} from 'use-debounce'

import {connectField} from '../../connectors/index.js'
import {
  HighlightTooltip,
  TuneSelectorButton
} from '../../internal/components/index.js'
import {TuneOption} from '../../internal/components/molecules/TuneSelector/TuneSelector.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'

export interface TextFieldProps extends Omit<TextProps, 'children'> {
  as?: As
  asAs?: As
  defaultValue?: string
  styleTunes?: TuneOption[]
}

export const TextField = connectField<string, TextFieldProps>(
  ({
    jaenField,
    defaultValue,
    as: Wrapper = Text,
    asAs,
    styleTunes: fieldStyleTunes = [],
    ...rest
  }) => {
    const value = jaenField.value || jaenField.staticValue || defaultValue || ''

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

    const handleContentBlur: React.FocusEventHandler<HTMLSpanElement> =
      useCallback(evt => {
        handleTextSave(evt.currentTarget.innerHTML)
      }, [])

    const alignmentTune: TuneOption = {
      type: 'groupTune',
      label: 'Alignment',
      tunes: [
        {
          name: 'left',
          Icon: FaAlignLeft,
          props: {
            textAlign: 'left'
          },
          isActive: props => props.textAlign === 'left'
        },
        {
          name: 'center',
          Icon: FaAlignCenter,
          props: {
            textAlign: 'center'
          },
          isActive: props => props.textAlign === 'center'
        },
        {
          name: 'right',
          Icon: FaAlignRight,
          props: {
            textAlign: 'right'
          },
          isActive: props => props.textAlign === 'right'
        },
        {
          name: 'justify',
          Icon: FaAlignJustify,
          props: {
            textAlign: 'justify'
          },
          isActive: props => props.textAlign === 'justify'
        }
      ]
    }

    const styleTunes: TuneOption = {
      type: 'groupTune',
      label: 'Style',
      tunes: [
        {
          name: 'bold',
          Icon: FaBold,
          isActive: props => props.fontWeight === 'bold',
          onTune: () => {
            document.execCommand('bold')
          }
        },
        {
          name: 'italic',
          Icon: FaItalic,
          isActive: props => props.fontStyle === 'italic',
          onTune: () => {
            document.execCommand('italic')
          }
        },
        {
          name: 'underline',
          Icon: FaUnderline,
          isActive: props => props.textDecoration === 'underline',
          onTune: () => {
            document.execCommand('underline')
          }
        }
      ]
    }

    // add event listener for selection change

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
          </Button>,
          <TuneSelectorButton
            key={`jaen-highlight-tooltip-tune-${jaenField.name}`}
            aria-label="Customize"
            tunes={[...fieldStyleTunes, styleTunes]}
            icon={
              <Text as="span" fontSize="sm" fontFamily="serif">
                T
              </Text>
            }
            tuneProps={jaenField.tuneProps}
            onTune={jaenField.tune}
          />,
          <TuneSelectorButton
            key={`jaen-highlight-tooltip-tune-${jaenField.name}`}
            aria-label="Customize"
            tunes={[alignmentTune, ...(jaenField.tunes || [])]}
            tuneProps={jaenField.tuneProps}
            onTune={jaenField.tune}
          />
        ]}
        isEditing={jaenField.isEditing}
        as={Wrapper}
        asAs={asAs}
        minW="1rem"
        className={jaenField.className}
        style={{
          ...jaenField.style,
          ...rest.style
        }}
        {...rest}
        {...jaenField.tuneProps}>
        {props => (
          <Box
            ref={props.ref}
            tabIndex={props.tabIndex}
            as="span"
            display="block"
            outline="none"
            dangerouslySetInnerHTML={{__html: value}}
            contentEditable={jaenField.isEditing}
            onBlur={handleContentBlur}
            onPaste={evt => {
              evt.preventDefault()

              const text = evt.clipboardData.getData('text/plain')

              const purifiedText = DOMPurify.sanitize(text, {
                ALLOWED_TAGS: ['br', 'span', 'div'],
                ALLOWED_ATTR: []
              })

              jaenField.onUpdateValue(purifiedText)
            }}
          />
        )}
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
