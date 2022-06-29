import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { usersAPI } from '../FIREBASE/api'
import { size } from 'lodash'

export const getUsers = createAsyncThunk(
  'usersSlice/getUsers',
  async (params) => {
    const res = await usersAPI.getUsers()
    return res
  },
)

export const getUser = createAsyncThunk(
  'usersSlice/getUser',
  async (params) => {
    const res = await usersAPI.getUser(params)
    return res
  },
)

const initialState = {
  users: {},
  user: {},
  loadingStatus: false,
}

const usersSlice = createSlice({
  name: 'usersSlice',
  initialState,
  reducers: {
    setStatus(state, action) {
      state.loadingStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state, action) => {})
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {})

      .addCase(getUser.pending, (state, action) => {
        state.loadingStatus = false
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loadingStatus = true
        state.user = action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loadingStatus = true
      })
  },
})

export const { setStatus } = usersSlice.actions
export default usersSlice.reducer
