import {useState, useCallback} from 'react'

export function useEdit() {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEditing = useCallback(() => {
    setIsEditing(!isEditing)
  }, [isEditing])

  return {
    isEditing,
    toggleEditing
  }
}
