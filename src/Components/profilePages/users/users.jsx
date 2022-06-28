import s from '../../../SCSS/users.module.scss'


import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size } from 'lodash'
import { NavLink } from 'react-router-dom'

import Button from '@mui/material/Button'
import { usersAPI } from '../../../FIREBASE/api'
import { getUsers } from '../../../Redux/users-reducer'




const UsersPage = (props) => {
   //Базові виклики різних функций та інше.
   const dispatch = useDispatch()
   // const [users, setUsers] = useState('')


   //Блок з селекторами
   const users = useSelector((state) => state.usersSlice.users)

   // Глобальні ефекти та інші хуки
   useEffect(() => {
      dispatch(getUsers())
   }, [])
   // console.log(typeof (users))
   const items = Object.keys(users).map(key => {


      return (
         <div key={users[key].id} className={s.userBlock}>
            <NavLink to={`/profile/user/${users[key].id}`}>
               <div >{users[key].userName}</div>
            </NavLink >
         </div>)

   })

   return (
      <div className={s.wrapper}>
         {items}

      </div >
   )
}




export default UsersPage