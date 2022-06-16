import s from '../../SCSS/profile.module.scss';

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'


const UserPage = (props) => {
   const profile = useSelector((state) => state.registerSlice.profile)

   return (
      <div>
         <div>Имя: {profile.userName}</div>
         <div>Почта: {profile.email}</div>
         <div>Дата рождения: {profile.birthDay}</div>
         <div>ID: {profile.id}</div>
      </div >
   )
}

export default UserPage