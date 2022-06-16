import { Route, Routes } from 'react-router-dom'
import StartPage from './Components/startPage'
import s from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { authAPI } from './FIREBASE/api'
import { authUser } from './Redux/login-reducer'
import Profile from './Components/profilePages/profile'

function App() {
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.registerSlice.profile)

  useEffect(() => {
    dispatch(authUser(dispatch))
  }, [])

  return (
    <div className={s.wrapper}>
      <Routes>
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/" element={<StartPage />} />
      </Routes>
    </div>
  )
}

export default App
