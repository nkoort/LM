import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authAPI, profileAPI } from '../FIREBASE/api'
import { getMultiFactorResolver, onAuthStateChanged } from 'firebase/auth'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

export const registerUser = createAsyncThunk(
  'loginSlice/register',
  async (params) => {
    const res = await authAPI.register(params.email, params.password)
    params.id = res.user.uid
    delete params.password
    delete params.passRepeat
    const setProfile = authAPI.setProfile(params, res.user.uid)
    return params
  },
)

export const authUser = createAsyncThunk(
  'loginSlice/authuser',
  async (dispatch) => {
    const res = await authAPI.authMe()
    onAuthStateChanged(res, async (user) => {
      if (user) {
        const getProfile = await profileAPI.getProfile(user.uid)
        //
        dispatch(setUser([getProfile, true]))
      }
    })
  },
)
export const logOutUser = createAsyncThunk(
  'loginSlice/logout',
  async (dispatch) => {
    const res = await authAPI.logOUT()
    dispatch(setUser(['', false]))
  },
)
export const uploadProto = createAsyncThunk(
  'loginSlice/uploadProto',
  async (params) => {
    const res = await profileAPI.uploadPhoto(params[0], params[1])
    let url = { photoURL: res }
    const addUrl = await authAPI.upProfile(url, params[0])
    return url.photoURL
  },
)

const initialState = {
  profile: {},
  loadingStatus: false,
  profileStatus: false,
}

const registerSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setUser(state, action) {
      state.profile = action.payload[0]
      state.profileStatus = action.payload[1]
      state.loadingStatus = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.profile = ''
        state.loadingStatus = false
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.profile = action.payload
        state.loadingStatus = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.profile = ''
        state.loadingStatus = false
      })

      .addCase(logOutUser.pending, (state, action) => {
        state.profile = ''
        state.loadingStatus = false
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.profile = ''
        state.logOutUser = true
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.profile = ''
        state.loadingStatus = false
      })

      .addCase(uploadProto.pending, (state, action) => {
        state.loadingStatus = false
        //   state.profile.photoURL = ''
      })
      .addCase(uploadProto.fulfilled, (state, action) => {
        state.profile.photoURL = action.payload
        state.loadingStatus = true
      })
      .addCase(uploadProto.rejected, (state, action) => {
        state.loadingStatus = true
        state.profile.photoURL = ''
      })
  },
})

export const { setUser } = registerSlice.actions
export default registerSlice.reducer
