import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {VFileMessage} from 'vfile-message'
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
  console.log('toooo PreviewComponent', state)

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

  const StatsReporterError = React.lazy(() => import('./StatsReporterError.js'))

  console.log('PreviewComponent', state, stats)

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <noscript>Enable JavaScript for the rendered result.</noscript>

      {state.file?.result ? <Content /> : null}

      <React.Suspense fallback={null}>
        <StatsReporterError state={state} stats={stats} />
      </React.Suspense>
    </ErrorBoundary>
  )
}
