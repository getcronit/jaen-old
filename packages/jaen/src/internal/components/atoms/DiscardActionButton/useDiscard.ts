import {useCallback} from 'react'
import {useModals} from '../../../context/Modals/index.js'
import {resetState, store} from '../../../redux/index.js'

export function useDiscard() {
  const {confirm, toast} = useModals()

  const discardChanges = useCallback(async () => {
    const shouldDiscard = await confirm(
      "Are you sure you want to discard your changes? You won't be able to recover them."
    )

    if (!shouldDiscard) {
      return
    }

    // Wipe out all changes except for auth
    resetState({
      auth: store.getState().auth
    })

    toast({
      title: 'Changes discarded',
      status: 'success'
    })
  }, [])

  return {
    discardChanges
  }
}
