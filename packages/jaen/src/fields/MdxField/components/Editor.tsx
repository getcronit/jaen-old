import {EditIcon, ViewIcon} from '@chakra-ui/icons'
import {Badge, Box, HStack} from '@chakra-ui/react'
import {markdown as langMarkdown} from '@codemirror/lang-markdown'
import {basicSetup, EditorView} from 'codemirror'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import {lowlight} from 'lowlight/lib/core.js'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import CodeMirror, {CodeMirrorProps} from 'rodemirror'
import {statistics, Statistics} from 'vfile-statistics'

import {ErrorFallback} from './ErrorFallback.js'
import {PreviewComponent} from './PreviewComponent.js'
import TabsTemplate from './TabsTemplate.js'

import {useMdx} from '../useMdx.js'
import {BaseEditorProps} from './types.js'

lowlight.registerLanguage('js', javascript)
lowlight.registerLanguage('json', json)
lowlight.registerLanguage('md', markdown)

const MemoizedCodeMirror = React.memo<CodeMirrorProps>(props => {
  console.log('MemoizedCodeMirror', props)

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CodeMirror {...props} />
    </ErrorBoundary>
  )
})

export interface EditorProps extends BaseEditorProps {}

export const Editor: React.FC<EditorProps> = props => {
  const [defaultValue, _] = useState(props.children)

  useEffect(() => {
    console.log('Editorr', defaultValue)
  }, [defaultValue])

  const [state, setConfig] = useMdx({
    gfm: true,
    frontmatter: true,
    math: true,
    directive: true,
    value: defaultValue
  }) as any

  const extensions = useMemo(() => [basicSetup, langMarkdown()], [])

  const [view, setView] = React.useState<EditorView | null>(null)

  const componentsInfo = Object.entries(props.components || {}).filter(
    ([name]) => {
      return name[0] === name[0]?.toUpperCase()
    }
  )

  const stats = state.file ? statistics(state.file) : ({} as Statistics)

  const onUpdate = useCallback(
    (v: {docChanged: any; state: {doc: any}}) => {
      if (v.docChanged) {
        console.log('docChanged 2', v)

        const value = String(v.state.doc)

        setConfig({...state, value})
        props.onUpdateValue && props.onUpdateValue(value)
      }
    },
    [setConfig]
  )

  const insertSnippet = (snippet: string) => {
    if (!view) return

    // Get the current selection
    const {from, to} =
      view.state.selection.ranges[view.state.selection.mainIndex]!

    console.log('from', from)
    console.log('to', to)
    console.log(view.state)

    // Check if there is a selection
    if (from !== to) {
      // Replace the selected text with the snippet
      const changes = {from: from, to: to, insert: snippet}
      const tr = view.state.update({
        changes: {from: changes.from, to: changes.to, insert: changes.insert}
      })
      view.dispatch(tr)
    } else if (from === 0 && to === 0) {
      // Insert the snippet at the end of the file
      const changes = {
        from: view.state.doc.length,
        to: view.state.doc.length,
        insert: `\n${snippet}\n`
      }
      const tr = view.state.update({
        changes: {from: changes.from, to: changes.to, insert: changes.insert}
      })
      view.dispatch(tr)
    } else {
      // Get the cursor position
      const cursor = view.state.selection.main.head

      // Get the current line content
      const lineContent = view.state.doc.lineAt(cursor).text

      // Check if the line is empty
      const isEmptyLine = lineContent.trim() === ''

      // Insert the snippet with or without a newline depending on the line content
      const changes = {
        from: cursor,
        to: cursor,
        insert: snippet + (isEmptyLine ? '\n' : '')
      }
      const tr = view.state.update({
        changes: {from: changes.from, to: changes.to, insert: changes.insert}
      })
      view.dispatch(tr)
    }
  }

  return (
    <TabsTemplate
      tabs={[
        {
          label: (
            <HStack spacing={2}>
              <ViewIcon />
              <Box>Preview</Box>
              {stats.fatal ? (
                <Badge colorScheme="red">Error</Badge>
              ) : stats.warn ? (
                <Badge colorScheme="yellow">Warning</Badge>
              ) : null}
            </HStack>
          ),
          content: (
            <PreviewComponent
              state={state}
              stats={stats}
              components={props.components}
            />
          )
        },
        {
          label: (
            <HStack spacing={2}>
              <EditIcon />
              <Box>Editor</Box>
            </HStack>
          ),
          content: (
            <>
              <noscript>Enable JavaScript for the rendered result.</noscript>

              <MemoizedCodeMirror
                value={defaultValue}
                extensions={extensions}
                onUpdate={onUpdate}
                onEditorViewChange={setView}
              />
            </>
          )
        }
      ]}
      componentsInfo={componentsInfo.map(([name, component]) => ({
        label: component.displayName || name,
        onClick: () => {
          console.log('defaultProps', component.defaultProps) // {hello: "world"}

          const props = Object.entries(
            component.defaultProps || {}
          ).reduce<any>((acc, [name, value]) => {
            if (typeof value === 'string') {
              acc[name] = `"${value}"`
            } else if (typeof value === 'number') {
              acc[name] = value
            } else if (typeof value === 'boolean') {
              acc[name] = value
            } else if (typeof value === 'object') {
              acc[name] = JSON.stringify(value)
            } else {
              acc[name] = value
            }

            return acc
          }, {})

          // Generate a usage snippet with filled-in placeholder props.
          const propsChain = Object.entries(props)
            .map(([name, value]) => `${name}=${value}`)
            .join(' ')

          const snippet = `<${name}${propsChain && ' ' + propsChain}></${name}>`

          // Insert the snippet into the editor at the current cursor position.
          insertSnippet(snippet)
        }
      }))}
      selectedTab={0}
    />
  )
}

export default Editor
