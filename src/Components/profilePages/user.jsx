import s from '../../SCSS/profile.module.scss';
import avatar from '../../assets/img/avatarDefault.png'

import { useState, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ContentLoader from "react-content-loader"

import { profileAPI } from '../../FIREBASE/api'
import { uploadProto } from '../../Redux/login-reducer';


import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


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
   const profile = useSelector((state) => state.registerSlice.profile)
   const loadingStatus = useSelector((state) => state.registerSlice.loadingStatus)
   const [loadImg, changeLoad] = useState(false)
   const [statusEdit, statusChange] = useState(false)


   const input = createRef();
   function inputClick(e) {
      input.current.click()
   }


   const onChangePhoto = (e) => {
      if (e.target.files.length) {
         dispatch(uploadProto([profile.id, e.target.files[0]]))

         let a = e.target.files[0]
      }
   }
   function loadingPhoto(data) {
      changeLoad(data)
   }
   const photo = profile.photoURL ? profile.photoURL : avatar
   var image = new Image(profile.photoURL);
   image.onload = function () {
      changeLoad(true)
   }
   image.src = photo;

   return (
      <div className={s.wrapper}>
         <div>
            <div>
               {loadImg &&
                  <div className={s.avatarBlock}>
                     <img src={image.src} className={s.avatarUser} />
                     <div className={s.addPhoto} onClick={inputClick}>
                        <AddPhotoAlternateIcon className={s.addLogo} />
                     </div>
                     <input className={s.addFile} ref={input} type='file' onChange={onChangePhoto} />
                  </div>}
               {!loadImg && <MyLoader />}
            </div>
            <div>


            </div>
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