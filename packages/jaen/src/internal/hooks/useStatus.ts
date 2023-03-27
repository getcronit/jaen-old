import {useCallback, useEffect, useState} from 'react'
import {RootState, store} from '../redux/index.js'
import * as actions from '../redux/slices/status.js'

export interface IStatus {
  isPublishing: boolean
  isEditing: boolean
  toggleIsEditing: () => void
  setEditing: (isEditing: boolean) => void
}

export const useStatus = (): IStatus => {
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const state = store.getState() as RootState

    setIsEditing(state.status.isEditing)

    const unsubscribe = store.subscribe(() => {
      const state = store.getState() as RootState

      setIsEditing(state.status.isEditing)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const toggleIsEditing = useCallback(() => {
    // get the current state
    const state = store.getState() as RootState
    const isCurrentlyEditing = state.status.isEditing

    // toggle the state
    setIsEditing(!isCurrentlyEditing)
  }, [])

  const setEditing = useCallback((isEditing: boolean) => {
    store.dispatch(actions.setIsEditing(isEditing))
  }, [])

  return {
    isPublishing: true,
    isEditing,
    toggleIsEditing,
    setEditing
  }
}
