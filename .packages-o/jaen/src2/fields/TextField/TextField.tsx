import {As, Box, Button, Text, TextProps, Tooltip} from '@chakra-ui/react'
import DOMPurify from 'isomorphic-dompurify'
import React, {useCallback, useEffect, useState} from 'react'
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
import {useTunes} from '../../internal/components/molecules/TuneSelector/useTunes.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'

const cleanRichText = (
  text: string,
  options: {
    isRTF?: boolean
  }
) => {
  const {isRTF} = options

  if (isRTF) {
    return DOMPurify.sanitize(text, {
      FORBID_TAGS: ['p']
    })
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

export interface TextFieldProps extends Omit<TextProps, 'children'> {
  as?: As
  asAs?: As
  defaultValue?: string
  styleTunes?: TuneOption[]
  isRTF?: boolean
}

export const TextField = connectField<string, TextFieldProps>(
  ({
    jaenField,
    defaultValue,
    as: Wrapper = Text,
    asAs,
    styleTunes: fieldStyleTunes = [],
    isRTF = true,
    ...rest
  }) => {
    const [value, setValue] = useState(() => {
      return cleanRichText(jaenField.staticValue || defaultValue || '', {
        isRTF
      })
    })

    useEffect(() => {
      const newValue = cleanRichText(
        jaenField.value || jaenField.staticValue || defaultValue || '',
        {
          isRTF
        }
      )

      setValue(newValue)
    }, [jaenField.value, isRTF])

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
      name: 'alignment',
      label: 'Alignment',
      tunes: [
        {
          name: 'left',
          Icon: FaAlignLeft,
          props: {
            textAlign: 'left'
          }
        },
        {
          name: 'center',
          Icon: FaAlignCenter,
          props: {
            textAlign: 'center'
          }
        },
        {
          name: 'right',
          Icon: FaAlignRight,
          props: {
            textAlign: 'right'
          }
        },
        {
          name: 'justify',
          Icon: FaAlignJustify,
          props: {
            textAlign: 'justify'
          }
        }
      ]
    }

    const styleTune: TuneOption = {
      type: 'groupTune',
      name: 'style',
      label: 'Style',
      tunes: [
        {
          name: 'bold',
          Icon: FaBold,
          onTune: () => {
            document.execCommand('bold')
          }
        },
        {
          name: 'italic',
          Icon: FaItalic,
          onTune: () => {
            document.execCommand('italic')
          }
        },
        {
          name: 'underline',
          Icon: FaUnderline,
          onTune: () => {
            document.execCommand('underline')
          }
        }
      ]
    }

    const tunes = useTunes({
      props: {...rest, asAs},
      activeTunes: jaenField.activeTunes,
      tunes: [
        alignmentTune,
        ...(isRTF ? [styleTune, ...fieldStyleTunes] : []),
        ...jaenField.tunes
      ]
    })

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
          ...(isRTF
            ? [
                <TuneSelectorButton
                  key={`jaen-highlight-tooltip-tune-${jaenField.name}`}
                  aria-label="Customize"
                  tunes={[styleTune, ...fieldStyleTunes]}
                  icon={
                    <Text as="span" fontSize="sm" fontFamily="serif">
                      T
                    </Text>
                  }
                  activeTunes={tunes.activeTunes}
                  onTune={jaenField.tune}
                />
              ]
            : []),
          <TuneSelectorButton
            key={`jaen-highlight-tooltip-tune-${jaenField.name}`}
            aria-label="Customize"
            tunes={[alignmentTune, ...jaenField.tunes]}
            activeTunes={tunes.activeTunes}
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
        {...tunes.activeProps}>
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

              let text = ''

              if (isRTF) {
                text = evt.clipboardData.getData('text/html')

                text = DOMPurify.sanitize(text, {
                  ALLOWED_TAGS: ['br', 'span'],
                  ALLOWED_ATTR: []
                })
              } else {
                text = evt.clipboardData.getData('text/plain')
              }

              const spanElement = evt.target as HTMLSpanElement
              const selection = window.getSelection()

              const range = selection ? selection.getRangeAt(0) : null
              const startOffset = range
                ? range.startOffset
                : spanElement?.textContent?.length ?? 0
              const endOffset = range
                ? range.endOffset
                : spanElement?.textContent?.length ?? 0

              const currentValue = spanElement.innerHTML

              const updatedValue = `${currentValue.substring(
                0,
                startOffset
              )}${text}${currentValue.substring(endOffset)}`

              jaenField.onUpdateValue(updatedValue)
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
