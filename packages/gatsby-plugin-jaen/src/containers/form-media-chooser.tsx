import {MediaNode, useMediaModal} from '@snek-at/jaen'
import {useState} from 'react'

import {FormMediaChooser} from '../components/shared/FormMediaChooser'

export interface FormMediaChooserProps {
  onChoose: (media: MediaNode) => void
  onRemove: () => void
  description?: string
  value?: string

  isDirect?: boolean
}

const FormMediaChooserContainer: React.FC<FormMediaChooserProps> = props => {
  const context = useMediaModal({
    onSelect: media => {
      props.onChoose(media)
    }
  })

  return (
    <FormMediaChooser
      onChoose={
        props.isDirect ? context.togglFileSelector : context.toggleModal
      }
      onRemove={props.onRemove}
      description={props.description}
      value={props.value}
    />
  )
}

export default FormMediaChooserContainer
