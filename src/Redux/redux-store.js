import { configureStore } from '@reduxjs/toolkit'
import registerSlice from './login-reducer'
import tasksSlice from './tasks-reducer'

export const store = configureStore({
  reducer: { registerSlice, tasksSlice },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

window.store = store

export default store
