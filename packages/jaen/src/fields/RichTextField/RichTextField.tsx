import {
  As,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Text,
  TextProps,
  Tooltip
} from '@chakra-ui/react'
import Header from '@editorjs/header'
// @ts-ignore
import Paragraph from '@editorjs/paragraph'
import {nanoid} from '@reduxjs/toolkit'

import {useCallback, useEffect} from 'react'
import {useDebouncedCallback} from 'use-debounce'

import {connectField} from '../../connectors/index.js'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'
import {SimpleImage} from './blocks/SimpleImage.js'
import TitleBodyBlock from './blocks/TitleBodyBlock.js'
import Editor, {OutputData} from './react-editorjs/Editor.js'
import {enhanceBlockTool} from './react-editorjs/enhance-block-tool.js'

const EnhancedSimpleImage = enhanceBlockTool(SimpleImage as any, {
  render: (data: SimpleImage['data'], {readOnly}) => {
    return (
      <Card>
        <CardHeader>
          <Text
            contentEditable={!readOnly}
            dangerouslySetInnerHTML={{
              __html: data.url
            }}></Text>
        </CardHeader>

        <CardBody>
          <Image src={data.url} />
        </CardBody>
      </Card>
    )
  },
  save: blockContent => {
    const input = blockContent.querySelector('p')

    return {
      url: input?.innerHTML || 'https://via.placeholder.com/150'
    }
  }
})

const EnhancedTitleBodyBlock = enhanceBlockTool(TitleBodyBlock as any, {
  render: (data: TitleBodyBlock['data'], {readOnly, updateBlock}) => {
    return (
      <Card>
        <CardHeader>
          <Heading
            size="md"
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={evt => {
              // update data via api
              updateBlock({
                ...data,
                title: (evt.currentTarget as HTMLElement).textContent || ''
              })
            }}>
            {data.title}
          </Heading>
        </CardHeader>

        <CardBody>
          <Text
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={evt => {
              // update data via api
              updateBlock({
                ...data,
                body: (evt.currentTarget as HTMLElement).textContent || ''
              })
            }}>
            {data.body}
          </Text>
        </CardBody>
      </Card>
    )
  }
})

const EnhancedHeader = enhanceBlockTool(Header as any, {
  render: (data: Header['data'], {readOnly}) => {
    return (
      <Heading
        contentEditable={!readOnly}
        as={`h${data.level}` as As}
        dangerouslySetInnerHTML={{__html: data.text}}
      />
    )
  },
  renderSettings(block: any): Array<any> {
    console.log(block)

    return [
      block.levels.map((level: {svg: any; number: any}) => ({
        icon: level.svg,
        label: block.api.i18n.t(`Heading ${level.number}`),
        onActivate: () => {
          // update data via api
          block.api.blocks.update(block.block.id, {
            ...block.data,
            level: level.number
          })
        },
        closeOnActivate: true,
        isActive: block.currentLevel.number === level.number
      }))
    ]
  }
})

const EnhancedParagraph = enhanceBlockTool(Paragraph, {
  render: (data: Paragraph['data'], {readOnly}) => {
    return (
      <Text
        color="red"
        contentEditable={!readOnly}
        dangerouslySetInnerHTML={{__html: data.text}}
      />
    )
  }
})

console.log(EnhancedParagraph, EnhancedHeader)

export interface RichTextFieldProps extends Omit<TextProps, 'defaultValue'> {
  as?: As
  asAs?: As
  defaultValue?: OutputData
}

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      id: nanoid(),
      type: 'header',
      data: {
        text: 'This is my awesome editor!',
        level: 1
      }
    }
  ]
}

export const RichTextField = connectField<OutputData, RichTextFieldProps>(
  ({jaenField, defaultValue, as: Wrapper = Text, asAs = 'span', ...rest}) => {
    const {toast} = useModals()

    const handleTextSave = useDebouncedCallback(
      useCallback((data: OutputData) => {
        jaenField.onUpdateValue(data)

        toast({
          title: 'Text saved',
          description: 'The text has been saved',
          status: 'info'
        })
      }, []),
      500
    )

    useEffect(
      () => () => {
        handleTextSave.flush()
      },
      [handleTextSave]
    )

    const value =
      jaenField.value ||
      jaenField.staticValue ||
      defaultValue ||
      DEFAULT_INITIAL_DATA

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
        isEditing={jaenField.isEditing}
        as={Wrapper}
        asProps={{
          ...rest,
          as: asAs,
          className: jaenField.className
        }}>
        <Editor
          value={value}
          onChange={handleTextSave}
          readOnly={!jaenField.isEditing}
          tools={{
            header: EnhancedHeader,
            paragraph: {
              class: EnhancedParagraph,
              inlineToolbar: true
            },
            titleBody: EnhancedTitleBodyBlock,
            image: EnhancedSimpleImage
          }}
        />
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:RichTextField'
  }
)
