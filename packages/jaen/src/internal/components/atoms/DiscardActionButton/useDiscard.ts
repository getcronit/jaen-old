import {useCallback} from 'react'
import {useModals} from '../../../context/Modals/index.js'

export function useDiscard() {
  const {confirm, toast} = useModals()

  const discardChanges = useCallback(async () => {
    console.log('Discard changes')

    const shouldDiscard = await confirm(
      "Are you sure you want to discard your changes? You won't be able to recover them."
    )

    if (shouldDiscard) {
      toast({
        title: 'Changes discarded',
        status: 'success'
      })
    }
  }, [])

  return {
    discardChanges
  }
}
