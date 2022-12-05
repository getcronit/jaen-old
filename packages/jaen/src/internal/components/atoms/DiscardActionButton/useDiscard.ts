import {useCallback} from 'react'
import {store} from '../../../redux/index.js'
import {actions} from '../../../redux/slices/page.js'
import {useModals} from '../../../context/Modals/index.js'

export function useDiscard() {
  const {confirm, toast} = useModals()

  const discardChanges = useCallback(async () => {
    console.log('Discard changes')

    const shouldDiscard = await confirm(
      "Are you sure you want to discard your changes? You won't be able to recover them."
    )

    if (!shouldDiscard) {
      return
    }

    store.dispatch(actions.discardAllChanges())
    store.dispatch(actions.discardDynamicPaths())

    toast({
      title: 'Changes discarded',
      status: 'success'
    })
  }, [])

  return {
    discardChanges
  }
}
