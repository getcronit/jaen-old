import React, {useEffect} from 'react'

import {connectField} from '../../connectors/connectField.js'
import {Preview} from './components/Preview.js'
import {BaseEditorProps, MdastRoot} from './components/types.js'

import {Image, Link} from './default-components.js'
import {defaultData} from './default-data.js'

type MdxFieldValue = MdastRoot

export interface MdxFieldProps {
  components: BaseEditorProps['components']
}

let Editor: React.FC<BaseEditorProps> | null = null

export const MdxField = connectField<MdxFieldValue, MdxFieldProps>(
  ({jaenField, components}) => {
    console.log(jaenField.staticValue)

    const [rawValue, setRawValue] = React.useState(
      jaenField.value || jaenField.staticValue || defaultData
    )

    console.log('rawValue', rawValue)

    components = {
      ...components,
      Image,
      Link
    }

    useEffect(() => {
      if (!jaenField.value) return

      setRawValue(jaenField.value)
    }, [jaenField.value])

    if (jaenField.isEditing) {
      // Render editor in edit mode

      if (!Editor) {
        Editor = React.lazy(async () => await import('./components/Editor.js'))
      }

      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Editor
            components={components}
            onUpdateValue={jaenField.onUpdateValue}
            mode="editAndPreview"
            mdast={rawValue}></Editor>
        </React.Suspense>
      )
    } else {
      return <Preview components={components} mdast={rawValue} />
    }
  },
  {
    fieldType: 'IMA:MdxField'
  }
)
