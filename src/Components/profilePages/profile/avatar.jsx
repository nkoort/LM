import s from '../../../SCSS/profile.module.scss';
import avatar from '../../../assets/img/avatarDefault.png'

import { useState, createRef } from 'react'
import { useDispatch } from 'react-redux'
import ContentLoader from "react-content-loader"


import { uploadProto } from '../../../Redux/login-reducer';


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


const Avatar = ({ url, idMe, id, matchSize, loadStatus }) => {
   const dispatch = useDispatch()

   const [loadImg, changeLoad] = useState(false)
   const [ava, setAvatar] = useState(url)


   // console.log(match)
   //Блок з селекторами


   // Глобальні ефекти та інші хуки


   //Звязує власну кнопку додавання файлу, з стандартний інпутом тип файл.
   const input = createRef();
   function inputClick(e) {
      input.current.click()
   }

   const idUser = matchSize == 0 ? idMe : id
   const onChangePhoto = (e) => {
      if (e.target.files.length) {
         changeLoad(false)
         dispatch(uploadProto([idUser, e.target.files[0]])).then(res => {
            debugger
            setAvatar(res.payload)
         })
      }
   }


   const photo = ava ? ava : avatar
   var image = new Image(ava);
   image.onload = function () {
      changeLoad(true)
   }
   image.src = photo


   function addItem() {
      if (id === idMe || matchSize == 0) {
         return <div className={s.addPhoto} onClick={inputClick}>
            <AddPhotoAlternateIcon className={s.addLogo} />
         </div>
      }
   }
   function changePhoto() {
      if (loadStatus && loadImg) {
         return <div className={s.avatarBlock}>
            <img src={ava} className={s.avatarUser} />
            {addItem()}
            <input className={s.addFile} ref={input} type='file' onChange={onChangePhoto} />
         </div>
      } else {
         return <MyLoader />
      }
   }

   return (
      <div className={s.wrapper}>
         <div>
            {changePhoto()}
         </div>
      </div >
   )
}

export default Avatar