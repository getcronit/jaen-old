import {Box} from '@chakra-ui/react'
import type EditorJS from '@editorjs/editorjs'
import type {EditorConfig, OutputData} from '@editorjs/editorjs'
import React, {useEffect, useRef} from 'react'
import {Gateway} from './Gateway'

export type {OutputData} from '@editorjs/editorjs'

export interface EditorProps {
  value?: OutputData
  onChange: (data: OutputData | undefined) => void
  minHeight?: number
  tools?: EditorConfig['tools']
  readOnly?: boolean
}

const Editor: React.FC<EditorProps> = props => {
  const editorRef = useRef<EditorJS | null>(null)

  const [isEditorReady, setIsEditorReady] = React.useState(false)

  const [data, setData] = React.useState<OutputData | undefined>(props.value)

  const tools: EditorConfig['tools'] = {
    ...props.tools
  }

  const initEditor = async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default

    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        editorRef.current = editor

        setIsEditorReady(true)
      },

      autofocus: true,
      data,
      onChange: async api => {
        // check if editor is still mounted
        // When the editor is destroyed while onChange is called, editorRef.current is null
        if (editorRef.current === null) {
          alert('nope')
          return
        }

        const content = await api.saver.save()

        console.log('editorValue', content, props.value)

        // has blocks changed?
        if (
          !content ||
          JSON.stringify(content.blocks) === JSON.stringify(props.value?.blocks)
        ) {
          console.log('blocks are the same')
          return
        }

        setData(content)
        props.onChange(content)
      },
      tools,
      minHeight: props.minHeight || 20
    })
  }

  useEffect(() => {
    if (editorRef.current === null) {
      // Do not init editor if readOnly

      if (!props.readOnly) {
        initEditor()
      }
    }

    return () => {
      editorRef?.current?.destroy()
      editorRef.current = null

      setIsEditorReady(false)
    }
  }, [props.readOnly])

  // update editor data when props.value changes
  // useEffect(() => {
  //   if (editorRef.current !== null) {
  //     editorRef.current.isReady.then(() => {
  //       if (props.value) {
  //         props.value?.blocks.forEach(block => {
  //           editorRef.current!.blocks.insert(block.type, block.data)
  //         })
  //       } else {
  //         editorRef.current!.clear()
  //       }
  //     })
  //   }
  // }, [props.value])

  const isGatewayRendered = props.readOnly || isEditorReady

  console.log(
    'isGatewayRendered',
    isGatewayRendered,
    props.readOnly,
    isEditorReady
  )

  const gatewayRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Box
        id="editorjs"
        sx={{
          '.ce-block__content': {
            maxWidth: 'unset',
            marginX: '24'
          },
          '.ce-toolbar__content': {
            maxWidth: 'calc(100% - 140px)'
          },
          '.ce-toolbar__actions': {
            // left: '100%',
            // right: 'unset',
            // 0.9 bg opacity white bg with 8px backdrop blur
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)'
          },
          '.codex-editor__loader': {
            height: `${gatewayRef.current?.clientHeight || 20}px`
          },
          '.codex-editor__redactor': {
            paddingBottom: '0 !important'
          },
          '*': {
            outline: 'none'
          }
        }}
      />
      {isGatewayRendered && (
        <Box ref={gatewayRef} mx="24">
          <Gateway
            blocks={data?.blocks}
            tools={tools}
            readOnly={props.readOnly}
            updateBlock={(id, newData) => {
              editorRef.current?.blocks.update(id, newData)
            }}
          />
        </Box>
      )}
    </>
  )
}

export default React.memo(Editor)
