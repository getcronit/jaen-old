import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import {IAuthState} from '../types.js'

export const authInitialState: IAuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null
}

export const login = createAsyncThunk(
  'auth/login',
  async (
    args: {
      params: {
        email: string
        password: string
      }
      details: {
        logMeOutAfterwards?: boolean
      }
    },
    _thunkAPI
  ) => {
    // Timeout for testing purposes
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      isAuthenticated: true,
      user: {
        email: args.params.email
      }
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  // Timeout for testing purposes
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    isAuthenticated: false,
    user: null
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    demoLogin: state => {
      state.isAuthenticated = true
      state.user = null
    },
    demoLogout: state => {
      state.isAuthenticated = false
      state.user = null
    }
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.isLoading = true
    })
    builder.addCase(login.fulfilled, state => {
      state.isAuthenticated = true
      state.isLoading = false
    })
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error
    })

    builder.addCase(logout.pending, state => {
      state.isLoading = true
    })
    builder.addCase(logout.fulfilled, state => {
      state.isAuthenticated = false
      state.isLoading = false
      state.user = null
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error
    })
  }
})

export const {demoLogin, demoLogout} = authSlice.actions
export default authSlice.reducer
