import {useContentManagement} from '@snek-at/jaen'

import {ToolbarButtons} from '../components/cms/ToolbarButtons'
import React from 'react'
import {withRedux} from '@snek-at/jaen/src/redux'

export const CMSToolbar: React.FC = withRedux(() => {
  const cm = useContentManagement()

  return (
    <ToolbarButtons
      pageTreeLabel={''}
      pageTreeOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
      editButtonIsEditing={cm.isEditing}
      editButtonToggle={cm.toggleIsEditing}
      saveLabel={''}
      saveOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
      discardLabel={''}
      discardOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
      publishLabel={''}
      publishOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
    />
  )
})
