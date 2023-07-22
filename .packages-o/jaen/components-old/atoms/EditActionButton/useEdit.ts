import {useModals} from '../../../context/Modals/ModalContext.js'
import {useStatus} from '../../../hooks/useStatus.js'

export function useEdit() {
  const status = useStatus()

  const {toast} = useModals()

  const toggleEditing = () => {
    setEditing(!status.isEditing)
  }

  const setEditing = (isEditing: boolean) => {
    if (isEditing) {
      toast({
        title: 'Editing mode enabled',
        description:
          'You can now make changes to the content. Don’t forget to save your changes.',
        status: 'warning'
      })
    } else {
      toast({
        title: 'Editing mode disabled',
        description: 'You can no longer make changes to the content.'
      })
    }

    status.setEditing(isEditing)
  }

  return {
    isEditing: status.isEditing,
    toggleEditing,
    setEditing
  }
}
