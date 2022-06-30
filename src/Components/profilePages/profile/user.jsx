import s from '../../../SCSS/profile.module.scss';

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ContentLoader from "react-content-loader"
import { size } from 'lodash'



import Avatar from './avatar';

import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { getUser, setStatus } from '../../../Redux/users-reducer';
import Comments from '../comments/comments';
import { getGoals } from '../../../Redux/goals-reducer';
import GoalItem from '../goals/goalItem';



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
   const goals = useSelector((state) => state.goalsSlice.goals)

   const [statusEdit, statusChange] = useState(false)

   const [profile, setProfile] = useState(props.user)

   //Блок з селекторами


   // Глобальні ефекти та інші хуки

   useEffect(() => {
      if (match) {
         dispatch(getUser(match.params.uid))
         dispatch(getGoals(match.params.uid))
         setProfile(user)
      } else {
         setProfile(profileMe)
         dispatch(getGoals(profileMe.id))
      }
   }, [loadStatus, match, props.user.id])


   function goalsItems() {
      if (goals) {
         let items = Object.keys(goals).map(key => {
            return (
               // <div className={s.goalsProfile}>
               //    <div className={s.goalItem}>{goals[key].id}</div>
               //    <div className={s.goalItem}>{goals[key].title}</div>
               // </div>
               <GoalItem goals={goals} />
            )
         })
         return items
      } else {
         return <div>Користувачь поки не встановив собі жодної цілі...</div>
      }

   }


   return (
      <div className={s.wrapper}>
         <div>
            <div>
               <Avatar match={match} />
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
         </div>
         <div className={s.goalsWrapper}>
            <GoalItem goals={goals} />
         </div>
         <div>
            <Comments type='profiles' />
         </div>
      </div >
   )
}

export default UserPage