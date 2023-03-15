import {IJaenPopup} from 'packages/jaen/src/types.js'
import {useCallback, useEffect, useState} from 'react'
import {usePopupContext} from '../../context/PopupContext.js'
import {RootState, store} from '../../redux/index.js'
import * as popupActions from '../../redux/slices/popup.js'
import {useStatus} from '../useStatus.js'

export function usePopupField<IValue>(name: string, type: string) {
  if (!['IMA:TextField'].includes(type)) {
    throw new Error(`Field type ${type} is not supported inside a Popup`)
  }

  const {id, popup} = usePopupContext()

  if (!id) {
    throw new Error(
      'Popup id is undefined! connectField must be used within a Popup'
    )
  }

  function getPopupField(
    p: IJaenPopup | Partial<IJaenPopup> | undefined
  ): IValue | undefined {
    if (!p) {
      return
    }

    return p.jaenFields?.[type]?.[name]?.value
  }

  const getValue = () => {
    const state = store.getState() as RootState

    const p = state.popup.nodes[id]

    if (p) {
      return getPopupField(p)
    }

    return undefined
  }

  const getStaticValue = () => {
    return getPopupField(popup)
  }

  const [value, setValue] = useState<IValue | undefined>(getValue)

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = getValue()

      if (newValue !== value) {
        setValue(newValue)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [value])

  const staticValue = getStaticValue()
  const {isEditing} = useStatus()

  const write = useCallback(
    (newValue: IValue | null) => {
      store.dispatch(
        popupActions.field_write({
          popupId: id,
          fieldType: type,
          fieldName: name,
          value: newValue
        })
      )
    },
    [id, type, name, value]
  )

  const register = useCallback(() => {}, [])

  return {value, staticValue, jaenPopupId: id, isEditing, write, register}
}
