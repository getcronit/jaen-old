import {useStatus} from '../../../hooks/useStatus.js'

export function useEdit() {
  const status = useStatus()

  return {
    isEditing: status.isEditing,
    toggleEditing: status.toggleIsEditing
  }
}
