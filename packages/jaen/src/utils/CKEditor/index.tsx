import {ClassicEditor} from '@ckeditor/ckeditor5-editor-classic'
import {CKEditor} from '@ckeditor/ckeditor5-react'

import * as React from 'react'
import {OSGUploadAdapterPlugin} from './OSGUploadAdapter.js'

// const EditorWrapper = styled(Box)`
//   width: 100%;
//   height: 100%;
//   min-height: 20px;

//   .ck.ck-editor__editable_inline[dir='ltr'] {
//     text-align: inherit;
//   }

//   .ck.ck-editor__editable_inline[dir='rtl'] {
//     text-align: inherit;
//   }

//   .ck-content > * {
//     all: revert;
//   }

//   .ck-focused {
//     border: none !important;
//     #box-shadow: 0 0 0 2.5px #4fd1c5 !important;
//     box-shadow: none !important;
//   }

//   .ck-blurred:hover {
//     #box-shadow: 0 0 0 2.5px #4fd1c5 !important;
//     #transition: box-shadow 0.3s ease-in-out;
//     box-shadow: none !important;
//   }

//   .ck-editor__editable_inline {
//     padding: 0 !important;
//     border: none !important;
//     overflow: unset !important;
//   }
//   .ck.ck-editor__editable_inline > *:first-of-type {
//     margin-top: 0 !important;
//   }

//   .ck.ck-editor__editable_inline > *:last-child {
//     margin-bottom: 0 !important;
//   }
// `

interface EditorProps {
  value?: string
  /**
   * Get the data from the editor on blur.
   *
   * Only called when the editor is in edit mode and the data is not the same as the default value.
   *
   * @param data - The data that was changed
   */
  onBlurValue: (data: string) => void
}

/**
 * TODO: Renders twice all the time. :(
 */
const Editor: React.FC<EditorProps> = props => {
  const editorConfig: Record<string, any> = {
    mediaEmbed: {
      previewsInData: true
    },
    extraPlugins: [OSGUploadAdapterPlugin],
    link: {
      addTargetToExternalLinks: true
    }
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfig}
      data={props.value}
      // onBlur={(_, editor) => {
      //   const data = editor.data.get()

      //   if (data !== props.value) {
      //     props.onBlurValue(data)
      //   }
      // }}
    />
  )
}

export default Editor
