//Бібліотеки та функции
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

//Власні слайси
import registerSlice from './login-reducer'
import tasksSlice from './tasks-reducer'
import goalsSlice from './goals-reducer'
import usersSlice from './users-reducer'
import commentsSlice from './comments-reducer'

export const store = configureStore({
  reducer: { registerSlice, tasksSlice, goalsSlice, usersSlice, commentsSlice },
  middleware: [thunk],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

window.store = store

export default store
