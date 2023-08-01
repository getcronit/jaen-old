import {useMediaModal} from '@snek-at/jaen'

import {MediaNode} from '../components/cms/Media/types'
import {FormMediaChooser} from '../components/shared/FormMediaChooser'

export interface FormMediaChooserProps {
  onChoose: (media: MediaNode) => void
  onRemove: () => void
  description?: string
  value?: string
}

const FormMediaChooserContainer: React.FC<FormMediaChooserProps> = props => {
  const context = useMediaModal({
    onSelect: media => {
      props.onChoose(media)
    }
  })

  return (
    <FormMediaChooser
      onChoose={context.toggleModal}
      onRemove={props.onRemove}
      description={props.description}
      value={props.value}
    />
  )
}

export default FormMediaChooserContainer
