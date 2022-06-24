import { configureStore } from '@reduxjs/toolkit'
import registerSlice from './login-reducer'
import tasksSlice from './tasks-reducer'
import goalsSlice from './goals-reducer'

import logger from 'redux-logger'
import thunk from 'redux-thunk'

export const store = configureStore({
  reducer: { registerSlice, tasksSlice, goalsSlice },
  middleware: [thunk],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

window.store = store

export default store
