import React from 'react'
import {connectField} from '../../connectors/connectField.js'
import {Preview} from './components/Preview.js'
import {BaseEditorProps} from './components/types.js'

type MdxFieldValue = string

export interface MdxFieldProps {
  components: BaseEditorProps['components']
}

let Editor: React.FC<BaseEditorProps> | null = null

export const MdxField = connectField<MdxFieldValue, any, MdxFieldProps>(
  ({jaenField, components}) => {
    console.log(jaenField)

    if (jaenField.isEditing) {
      // Render editor in edit mode

      const rawValue =
        jaenField.value ||
        jaenField.staticValue ||
        `# Hello, world!

      // This is a **jaen** MDX field.

      // ## Usage

      // You can use this field to write markdown content.
      // `

      if (!Editor) {
        Editor = React.lazy(() => import('./components/Editor.js'))
      }

      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Editor
            components={components}
            onUpdateValue={jaenField.onUpdateValue}
            mode="editAndPreview">
            {rawValue}
          </Editor>
        </React.Suspense>
      )
    } else if (jaenField.value) {
      // Render editor in preview only mode

      return (
        <Preview components={components} mode="preview">
          {jaenField.value || ''}
        </Preview>
      )
    }

    if (typeof window === 'undefined' && jaenField.staticValue) {
      return (
        <Preview components={components} mode="build">
          {jaenField.staticValue}
        </Preview>
      )
    }

    return null
  },
  {
    fieldType: 'IMA:MdxField'
  }
)
