import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { tasksAPI } from '../FIREBASE/api'
import { size } from 'lodash'

export const addTask = createAsyncThunk(
  'loginSlice/addtask',
  async (params) => {
    let res = await tasksAPI.addTask(params[0], params[1], params[2])
    return params
  },
)

export const getTasks = createAsyncThunk('loginSlice/getTasks', async (id) => {
  const res = await tasksAPI.getTasks(id)
  return res
})

const initialState = {
  tasks: [],
  addStatus: false,
  addStatusMessage: null,
}

const tasksSlice = createSlice({
  name: 'tasksSlice',
  initialState,
  reducers: {
    setStatusMessage(state, action) {
      state.addStatusMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state, action) => {
        state.addStatus = false
        state.addStatusMessage = 'Сохранение....'
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks[action.payload[2]] = action.payload[1]
        state.addStatus = true
        state.addStatusMessage = 'Задачу добавлено! Поздравляем'
      })
      .addCase(addTask.rejected, (state, action) => {
        state.addStatus = false
        state.addStatusMessage = 'Произошла ошибка. Повторите попытку позжу'
      })

      .addCase(getTasks.pending, (state, action) => {
        state.addStatus = false
        state.addStatusMessage = 'Идёт загрузка.....'
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.addStatusMessage = null
        state.addStatus = true
        state.tasks = action.payload.tasks
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.addStatus = true
        state.addStatusMessage =
          'Во время загрузки произошла ошибка, перезагрузите страницу. Если ошибка повторилась, попробуйте зайти позже. Мы уже работаем над устранением проблемы!'
      })
  },
})

export const { setStatusMessage } = tasksSlice.actions
export default tasksSlice.reducer
