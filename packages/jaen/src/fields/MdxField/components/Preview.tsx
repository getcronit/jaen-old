import {BaseEditorProps} from './types.js'
// @ts-nocheck
import React, {useEffect} from 'react'
import {Statistics, statistics} from 'vfile-statistics'

import {useMdx} from '../useMdx'
import {PreviewComponent} from './PreviewComponent'

export interface BuildEditorProps {
  components: BaseEditorProps['components']

  mode: 'build' | 'preview'
  children: string
}

export const Preview: React.FC<BuildEditorProps> = ({components, children}) => {
  const defaultValue = children
  console.log('Preview', defaultValue)

  const [state, setConfig] = useMdx({
    gfm: true,
    frontmatter: true,
    math: true,
    directive: true,
    value: defaultValue
  }) as any

  console.log('Preview', state, state.file)

  const stats = state.file ? statistics(state.file) : ({} as Statistics)

  console.log('Preview', stats)

  useEffect(() => {
    setConfig({value: defaultValue})
  }, [defaultValue, setConfig])

  return (
    <PreviewComponent state={state} stats={stats} components={components} />
  )
}
