import {useModals} from '../../../context/Modals/ModalContext.js'
import {useStatus} from '../../../hooks/useStatus.js'

export function useEdit() {
  const status = useStatus()

  const {toast} = useModals()

  const toggleEditing = () => {
    if (status.isEditing) {
      toast({
        title: 'Editing mode disabled',
        description: 'You can now view the content of this page'
      })
    } else {
      toast({
        title: 'Editing mode enabled',
        description: 'You can now edit the content of this page'
      })
    }

    status.toggleIsEditing()
  }

  return {
    isEditing: status.isEditing,
    toggleEditing
  }
}
