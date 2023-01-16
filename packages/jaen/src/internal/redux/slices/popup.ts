import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IJaenPopup} from '../../../types.js'

import {IPopupState} from '../types.js'

export const popupInitialState: IPopupState = {
  nodes: {},
  advanced: {}
}

const statusSlice = createSlice({
  name: 'popup',
  initialState: popupInitialState,
  reducers: {
    setActive: (state, action: PayloadAction<string>) => {
      state.nodes[action.payload] = {
        ...state.nodes[action.payload]!,
        active: true
      }
    },
    setInactive: (state, action: PayloadAction<string>) => {
      state.nodes[action.payload] = {
        ...state.nodes[action.payload]!,
        active: false
      }
    },
    field_write: (
      state,
      action: PayloadAction<{
        popupId: string
        fieldType: string
        fieldName: string
        value: any
      }>
    ) => {
      const {popupId, fieldType, fieldName, value} = action.payload

      state.nodes[popupId] = {
        ...(state.nodes[popupId] as IJaenPopup),
        id: popupId,
        jaenFields: {
          ...(state.nodes[popupId]?.jaenFields ?? {}),
          [fieldType]: {
            ...(state.nodes[popupId]?.jaenFields?.[fieldType] ?? {}),
            [fieldName]: {value}
          }
        }
      }
    },
    increaseAdvancedPageViews: (state, action: PayloadAction<string>) => {
      const popupId = action.payload
      if (!state.advanced[popupId]) {
        state.advanced[popupId] = {
          pageViews: 0
        }
      }

      state.advanced[popupId]!.pageViews++
    }
  }
})

export const {setActive, setInactive, field_write, increaseAdvancedPageViews} =
  statusSlice.actions
export default statusSlice.reducer
