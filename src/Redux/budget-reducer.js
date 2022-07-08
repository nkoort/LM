import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { size } from 'lodash'
import dayjs from 'dayjs'

import { budgetAPI } from '../FIREBASE/apiRealtime'
import { usersAPI } from '../FIREBASE/api'
import { useDispatch } from 'react-redux'

export const addField = createAsyncThunk(
  'budgetSlice/addField',
  async (params) => {
    budgetAPI.addField(params[0], params[1], params[2], params[3])
    return params
  },
)
export const delField = createAsyncThunk(
  'budgetSlice/deleteField',
  async (params) => {
    budgetAPI.deleteField(params[0], params[1], params[2], params[3])
    return params
  },
)
export const realtimeUpdate = createAsyncThunk(
  'budgetSlice/realtimeUpdate',
  async (params) => {
    const dt = Date.parse(new Date())
    const data = { ...params[6] }
    //  debugger
    data[params[4]] = params[5]
    //  data.meta.changeDate = dt
    debugger
    budgetAPI.realtimeUpdate(
      params[0],
      params[1],
      params[2],
      params[3],
      // params[4],
      data,
    )
    //  return params
  },
)

export const changeField = createAsyncThunk(
  'budgetSlice/changeField',
  async (params) => {
    return params
  },
)
export const getPlan = createAsyncThunk(
  'budgetSlice/getPlan',
  async (params) => {
    const m = Number(params[2])
    const y = Number(params[3])
    const mon = m < 10 ? `0${m}` : m
    const newDate = dayjs(`${y}-01-${mon}`).valueOf()
    const a = await budgetAPI.getDocs(params[0], params[1], newDate, params[4])
  },
)
export const setFilters = createAsyncThunk(
  'budgetSlice/setFilters',
  async (params) => {
    return params
  },
)

const initialState = {
  filters: {
    year: '',
    month: '',
    type: '',
  },
  plan: [{}],
}

const budgetSlice = createSlice({
  name: 'budgetSlice',
  initialState,
  reducers: {
    setPlan(state, action) {
      state.plan[0] = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addField.pending, (state, action) => {})
      .addCase(addField.fulfilled, (state, action) => {
        const dt = Date.parse(new Date())
        if (!action.payload[3]) {
          if (action.payload[1] === 0) {
            state.plan[0] = {
              [action.payload[0]]: {
                category: '',
                name: '',
                value: '',
                amount: 1,
                meta: {
                  id: action.payload[0],
                  number: 1,
                  periodDate: action.payload[2],
                  createDate: dt,
                  changeDate: dt,
                },
              },
            }
          } else {
            state.plan[0][action.payload[0]] = {
              category: '',
              name: '',
              value: '',
              amount: 1,
              meta: {
                id: action.payload[0],
                number: action.payload[1] + 1,
                periodDate: action.payload[2],
                createDate: dt,
                changeDate: dt,
              },
            }
          }
        }
      })
      .addCase(addField.rejected, (state, action) => {})

      .addCase(setFilters.pending, (state, action) => {})
      .addCase(setFilters.fulfilled, (state, action) => {
        state.filters[action.payload[0]] = action.payload[1]
      })
      .addCase(setFilters.rejected, (state, action) => {})

      .addCase(changeField.pending, (state, action) => {})
      .addCase(changeField.fulfilled, (state, action) => {
        const id = action.payload[1]
        const type = action.payload[2]
        const dt = Date.parse(new Date())
        state.plan[0][id].meta.changeDate = dt
        state.plan[0][id][type] = action.payload[0]
      })
      .addCase(changeField.rejected, (state, action) => {})

      .addCase(delField.fulfilled, (state, action) => {
        delete state.plan[0][action.payload[3]]
      })
  },
})

export const { setPlan } = budgetSlice.actions
export default budgetSlice.reducer
