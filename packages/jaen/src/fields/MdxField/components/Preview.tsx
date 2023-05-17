import {BaseEditorProps} from './types.js'
// @ts-nocheck
import React, {useEffect} from 'react'
import {Statistics, statistics} from 'vfile-statistics'

import {useMdx} from '../useMdx.js'
import {PreviewComponent} from './PreviewComponent'

export interface BuildEditorProps {
  components: BaseEditorProps['components']

  children: string
}

export const Preview = React.memo<BuildEditorProps>(
  ({components, children}) => {
    const defaultValue = children

    const [state, setConfig] = useMdx({
      gfm: true,
      frontmatter: true,
      math: true,
      directive: true,
      value: defaultValue
    }) as any

    const stats = state.file ? statistics(state.file) : ({} as Statistics)

    useEffect(() => {
      console.log('useEffect', defaultValue)
      setConfig({value: defaultValue})
    }, [defaultValue, setConfig])

    return (
      <PreviewComponent state={state} stats={stats} components={components} />
    )
  }
)
