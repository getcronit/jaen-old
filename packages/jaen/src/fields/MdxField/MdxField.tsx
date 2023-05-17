import React, {useEffect} from 'react'
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
    const [rawValue, setRawValue] = React.useState(
      jaenField.staticValue ||
        `# Hello, world!

// This is a **jaen** MDX field.

// ## Usage

// You can use this field to write markdown content.
// 


<Wrap>

<TestCard heading="Couch" text="A green couch with wooden legs" price="$299"></TestCard>

</Wrap>`
    )

    console.log('rawValue', rawValue)

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
            mode="editAndPreview">
            {rawValue}
          </Editor>
        </React.Suspense>
      )
    } else {
      return <Preview components={components}>{rawValue}</Preview>
    }
  },
  {
    fieldType: 'IMA:MdxField'
  }
)
