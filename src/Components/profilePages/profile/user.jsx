import s from '../../../SCSS/profile.module.scss';

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ContentLoader from "react-content-loader"
import { size } from 'lodash'



import Avatar from './avatar';

import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { getUser, setStatus } from '../../../Redux/users-reducer';



const MyLoader = (props) => (
   <ContentLoader
      speed={3}
      width={240}
      height={240}
      viewBox="0 0 240 240"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
   >
      <circle cx="120" cy="120" r="120" />
   </ContentLoader>
)


const UserPage = (props) => {
   const dispatch = useDispatch()
   const match = useMatch('profile/user/:uid')

   const profileMe = useSelector((state) => state.registerSlice.profile)
   const user = useSelector((state) => state.usersSlice.user)
   const loadStatus = useSelector((state) => state.registerSlice.loadingStatus)

   const [statusEdit, statusChange] = useState(false)

   const [profile, setProfile] = useState(props.user)

   //Блок з селекторами


   // Глобальні ефекти та інші хуки

   useEffect(() => {
      if (match) {
         dispatch(getUser(match.params.uid))
         setProfile(user)
      } else {
         setProfile(profileMe)
      }
   }, [loadStatus, match, props.user.id])




   return (
      <div className={s.wrapper}>
         <div>
            <Avatar
               url={profile.photoURL}
               idMe={profileMe.id}
               id={user.id}
               matchSize={size(match)}
               loadStatus={loadStatus} />
         </div>
         <div className={s.wrapperInfo}>
            <div className={s.nameBlock}>
               <div>Имя: {profile.userName}</div>
               <div>
                  {!statusEdit && <div className={s.statusDiv}>Статус</div>}
                  {statusEdit && <input className={s.statusInput} type="text" value={'Статус'} />}
               </div>
            </div>
            <div className={s.infoBlock}>
               <div>Почта: {profile.email}</div>
               <div>Дата рождения: {profile.birthDay}</div>
               <div>ID: {profile.id}</div>
            </div>
         </div>
      </div >
   )
}

export default UserPage