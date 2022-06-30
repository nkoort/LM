import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { commentsAPI } from '../FIREBASE/api'
import { size, uniq, findIndex, difference, remove } from 'lodash'

const { v4: uuidv4 } = require('uuid')

export const getComments = createAsyncThunk(
  'commentsSlice/getComments',
  async (params) => {
    const data = []
    const res = await commentsAPI.getComments(params[0], params[1])
    data.push(res)

    if (res.length > 0) {
      let ids = res.map((key) => {
        return key.author
      })
      const users = await commentsAPI.getUsers(uniq(ids))
      users.push(params[2])
      data.push(users)
    }
    return data
  },
)
export const addComments = createAsyncThunk(
  'commentsSlice/addComments',
  async (params) => {
    const idCom = uuidv4(10)
    let data = params[2]
    data.commentId = idCom
    const res = await commentsAPI.addComment(params[0], params[1], data)

    return data
  },
)
// ('profiles', pageId, commentId, id)
export const addLikeFunc = createAsyncThunk(
  'commentsSlice/addLike',
  async (params) => {
    await commentsAPI.addLike(params[0], params[1], params[2], params[3])

    const res = ''

    return params
  },
)
export const removeLikeFunc = createAsyncThunk(
  'commentsSlice/removeLike',
  async (params) => {
    await commentsAPI.removeLike(params[0], params[1], params[2], params[3])

    const res = ''
    return params
  },
)

const initialState = {
  comments: [],
  users: {},
}

const commentsSlice = createSlice({
  name: 'commentsSlice',
  initialState,
  reducers: {
    setStatus(state, action) {
      state.loadingStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComments.pending, (state, action) => {})
      .addCase(addComments.fulfilled, (state, action) => {
        state.comments.push(action.payload)
      })
      .addCase(addComments.rejected, (state, action) => {})

      .addCase(getComments.pending, (state, action) => {})
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload[0]
        state.users = action.payload[1]
      })
      .addCase(getComments.rejected, (state, action) => {})

      .addCase(addLikeFunc.fulfilled, (state, action) => {
        const index = findIndex(state.comments, [
          'commentId',
          action.payload[2],
        ])

        state.comments[index].likes.push(action.payload[3])
      })

      .addCase(removeLikeFunc.fulfilled, (state, action) => {
        const index = findIndex(state.comments, [
          'commentId',
          action.payload[2],
        ])

        state.comments[index].likes.splice(
          state.comments[index].likes.indexOf(action.payload[3]),
          1,
        )
      })
  },
})

export const { setStatus } = commentsSlice.actions
export default commentsSlice.reducer
