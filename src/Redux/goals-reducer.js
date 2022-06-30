import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { goalsAPI, tasksAPI } from '../FIREBASE/api'
import { size } from 'lodash'

export const getDirectory = createAsyncThunk(
  'goalSlice/getCategories',
  async (params) => {
    const categories = await goalsAPI.getGategorys()
    const status = await goalsAPI.getStatus()
    let res = {
      categories,
      status,
    }
    return res
  },
)
export const addGoal = createAsyncThunk('goalSlice/addGoal', async (params) => {
  let res = await goalsAPI.addGoal(params[0], params[1], params[2])
  const objCorrect = { [params[2]]: params[1] }
  return objCorrect
})
export const getGoals = createAsyncThunk(
  'goalSlice/getGoals',
  async (params) => {
    let res = await goalsAPI.getGoals(params)
    if (!res) {
      res = {}
    }
    return res
  },
)

const initialState = {
  categories: {},
  status: {},
}

const goalsSlice = createSlice({
  name: 'goalsSlice',
  initialState,
  reducers: {
    setStatusMessage(state, action) {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDirectory.pending, (state, action) => {})
      .addCase(getDirectory.fulfilled, (state, action) => {
        state.categories = action.payload.categories
        state.status = action.payload.status
      })
      .addCase(getDirectory.rejected, (state, action) => {})

      .addCase(addGoal.pending, (state, action) => {})
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals = action.payload
      })
      .addCase(addGoal.rejected, (state, action) => {})

      .addCase(getGoals.pending, (state, action) => {})
      .addCase(getGoals.fulfilled, (state, action) => {
        state.goals = action.payload.goals
      })
      .addCase(getGoals.rejected, (state, action) => {})
  },
})

export const {} = goalsSlice.actions
export default goalsSlice.reducer
