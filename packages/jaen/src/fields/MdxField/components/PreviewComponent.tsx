import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {VFileMessage} from 'vfile-message'
import reporter from 'vfile-reporter'
import {Statistics} from 'vfile-statistics'
import {ErrorFallback} from './ErrorFallback.js'
import {BaseEditorProps} from './types.js'

const FallbackComponent: React.FC<{
  error: Error
}> = ({error}) => {
  const message = new VFileMessage(error)
  message.fatal = true
  return (
    <pre>
      <code>{String(message)}</code>
    </pre>
  )
}

export interface PreviewComponentProps {
  state: any
  stats: Statistics
  components: BaseEditorProps['components']
}

export const PreviewComponent: React.FC<PreviewComponentProps> = ({
  state,
  stats,
  components
}) => {
  const Content: React.FC = () => {
    try {
      return state.file.result({
        components: {
          code: ({className, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter language={match[1]} PreTag="div" {...props} />
            ) : (
              <code className={className} {...props} />
            )
          },
          ...components
        }
      })
    } catch (error) {
      return <FallbackComponent error={error} />
    }
  }

  return (
    <>
      <noscript>Enable JavaScript for the rendered result.</noscript>
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {state.file?.result ? <Content /> : null}
          {stats.fatal || stats.warn ? (
            <pre>
              <code>{reporter(state.file)}</code>
            </pre>
          ) : null}
        </ErrorBoundary>
      </div>
    </>
  )
}
