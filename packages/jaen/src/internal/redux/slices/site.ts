import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IJaenSiteState} from '../types.js'

export const siteInitialState: IJaenSiteState = {
  siteMetadata: {}
}

const siteSlice = createSlice({
  name: 'site',
  initialState: siteInitialState,
  reducers: {
    updateSiteMetadata: (
      state,
      action: PayloadAction<IJaenSiteState['siteMetadata']>
    ) => {
      state.siteMetadata = {
        ...state.siteMetadata,
        ...action.payload
      }
    }
  }
})

export const {updateSiteMetadata} = siteSlice.actions
export default siteSlice.reducer
