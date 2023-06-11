import {DragHandleIcon} from '@chakra-ui/icons'
import {
  As,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
  Text,
  TextProps,
  Tooltip
} from '@chakra-ui/react'
import React, {
  FocusEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useRef
} from 'react'
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight
} from 'react-icons/fa'
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

    const handleContentBlur: FocusEventHandler = useCallback(evt => {
      handleTextSave(evt.currentTarget.innerHTML)
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
          // <HStack spacing="2">
          //   <ButtonGroup
          //     size="sm"
          //     isAttached
          //     bg="white"
          //     borderRadius="lg"
          //     variant="jaenHighlightTooltip">
          //     <IconButton aria-label="Left" icon={<Icon as={FaAlignLeft} />} />
          //     <IconButton
          //       aria-label="Center"
          //       icon={<Icon as={FaAlignCenter} />}
          //     />
          //     <IconButton
          //       aria-label="Right"
          //       icon={<Icon as={FaAlignRight} />}
          //     />
          //     <IconButton
          //       aria-label="Justify"
          //       icon={<Icon as={FaAlignJustify} />}
          //     />
          //   </ButtonGroup>
          //   <IconButton
          //     variant="jaenHighlightTooltip"
          //     size="xs"
          //     aria-label="Tune"
          //     icon={<Icon as={DragHandleIcon} />}
          //   />
          // </HStack>
        ]}
        isEditing={jaenField.isEditing}
        as={Wrapper}
        asProps={{
          pos: 'relative',
          minW: '1rem',
          ...rest,
          className: jaenField.className,
          style: {
            ...jaenField.style,
            ...rest.style
          }
        }}>
        <WithInlineToolbar>
          <span
            style={{
              display: 'block',
              outline: 'none'
            }}
            contentEditable={jaenField.isEditing}
            onBlur={handleContentBlur}
            dangerouslySetInnerHTML={{
              __html: value
            }}></span>
        </WithInlineToolbar>
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:TextField'
  }
)

const InlineToolbar = forwardRef<
  HTMLDivElement,
  {
    top?: number
    left?: number
  }
>((_, ref) => {
  return (
    <HStack
      ref={ref}
      bg="rgba(255, 255, 255, 0.8)"
      backdropBlur={8}
      spacing="2"
      borderRadius="lg"
      position="absolute"
      outline="pink solid 1px"
      px="2"
      visibility={'hidden'}>
      <ButtonGroup size="sm" isAttached variant="jaenHighlightTooltip">
        <IconButton aria-label="Left" icon={<Icon as={FaAlignLeft} />} />
        <IconButton aria-label="Center" icon={<Icon as={FaAlignCenter} />} />
        <IconButton aria-label="Right" icon={<Icon as={FaAlignRight} />} />
        <IconButton aria-label="Justify" icon={<Icon as={FaAlignJustify} />} />
      </ButtonGroup>
      <IconButton
        variant="jaenHighlightTooltip"
        size="xs"
        aria-label="Tune"
        icon={<Icon as={DragHandleIcon} />}
      />
    </HStack>
  )
})

const WithInlineToolbar: React.FC<{
  children: JSX.Element
}> = ({children}) => {
  const spanRef = useRef<HTMLSpanElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    const tooltip = toolbarRef.current

    if (!selection || !tooltip) return

    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      const tooltipTop = rect.bottom + window.pageYOffset - 50

      const tooltipRect = tooltip.getBoundingClientRect()

      const tooltipWidth = tooltip.offsetWidth || tooltipRect.width

      let tooltipLeft = rect.left + window.pageXOffset

      if (tooltipLeft + tooltipWidth > window.innerWidth) {
        // Check if there is enough space on the left side
        if (rect.left - tooltipWidth >= 0) {
          tooltipLeft = rect.left - tooltipWidth + window.pageXOffset
        } else {
          tooltipLeft = window.innerWidth - tooltipWidth
        }
      }

      tooltip.style.top = tooltipTop + 'px'
      tooltip.style.left = tooltipLeft + 'px'
      tooltip.style.visibility = 'visible'
    } else {
      // Hide the tooltip if there is no selection
      tooltip.style.visibility = 'hidden'
    }
  }

  return (
    <div style={{position: 'relative'}}>
      {React.cloneElement(children, {ref: spanRef})}
      <InlineToolbar ref={toolbarRef} />
    </div>
  )
}
