import s from '../../SCSS/profile.module.scss';
import avatar from '../../assets/img/avatarDefault.png'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { profileAPI } from '../../FIREBASE/api'

const UserPage = (props) => {
   const dispatch = useDispatch()
   const profile = useSelector((state) => state.registerSlice.profile)


   const onChangePhoto = (e) => {
      if (e.target.files.length) {
         // debugger
         dispatch(profileAPI.uploadPhoto(profile.id, e.target.files[0]))

         let a = e.target.files[0]
      }
   }

   return (
      <div>
         <div>
            <div><img src={avatar} className={s.avatarUser} /></div>
            <div>
               <input type='file' onChange={onChangePhoto} />
            </div>
         </div>
         <div>Имя: {profile.userName}</div>
         <div>Почта: {profile.email}</div>
         <div>Дата рождения: {profile.birthDay}</div>
         <div>ID: {profile.id}</div>
      </div >
   )
}

export default UserPage