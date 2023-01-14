import {useEffect, useState} from 'react'
import {RootState, store} from '../redux/index.js'
import * as actions from '../redux/slices/status.js'

export interface IStatus {
  isPublishing: boolean
  isEditing: boolean
  toggleIsEditing: () => void
}

export const useStatus = (): IStatus => {
  const [isEditing, setIsEditing] = useState(
    (store.getState() as RootState).status.isEditing
  )

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState() as RootState

      setIsEditing(state.status.isEditing)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const toggleIsEditing = () => store.dispatch(actions.setIsEditing(!isEditing))

  return {
    isPublishing: true,
    isEditing,
    toggleIsEditing
  }
}
