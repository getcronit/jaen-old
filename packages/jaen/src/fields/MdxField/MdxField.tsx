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

    const [rawValue, setRawValue] = React.useState<MdastRoot | undefined>(
      jaenField.value || jaenField.staticValue || defaultData
    )

    useEffect(() => {
      setRawValue(jaenField.value || jaenField.staticValue || defaultData)
    }, [jaenField.value])

    components = {
      ...components,
      img: (props: any) => {
        console.log('props', props)

        const src = props.src
        const alt = props.alt

        const name = `${src}-${alt}`

        return <Image name={name} defaultValue={src} alt={alt} />
      },

      Image,
      a: (props: any) => {
        return <Link to={props.href}>{props.children}</Link>
      },
      Link
    }

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
