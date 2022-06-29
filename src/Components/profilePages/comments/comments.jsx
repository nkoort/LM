import s from '../../../SCSS/comments.module.scss';
import avatar from '../../../assets/img/avatarDefault.png'


import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { size, orderBy, filter } from 'lodash'
import { useForm } from "react-hook-form";
import { useMatch } from 'react-router-dom';
import { useEffect } from 'react';


//Власні компоненти на слайсиі
import { addComments, getComments, addLikeFunc, removeLikeFunc } from '../../../Redux/comments-reducer';



//Matriel UI components
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';





const Comments = (props) => {
   const dispatch = useDispatch()
   const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
   const match = useMatch('profile/user/:pid')


   //Локальні стейти
   const [pageId, setPageId] = useState('')


   //Блок з селекторами
   const { userName, id, photoURL } = useSelector((state) => state.registerSlice.profile)
   const { comments, users } = useSelector((state) => state.commentsSlice)

   // Глобальні ефекти та інші хуки

   useEffect(() => {
      size(match) === 0 ? setPageId(id) : setPageId(match.params.pid)
      if (pageId !== '') {
         dispatch(getComments(['profiles', pageId]))
      }
   }, [pageId, size(match)])


   const onSubmit = data => {
      const { v4: uuidv4 } = require('uuid')
      data.dateCreation = Date.parse(new Date())
      data.pageId = pageId
      data.author = id
      // data.commentId = uuidv4(10)
      data.likes = []
      dispatch(addComments(['profiles', pageId, data]))
      reset()
   }


   // Бере массив коментарів який приходить з сервера, потім за допомгою orderBy сортує його по даті створення
   //    від більшого до мншого, та повертає інший массив. Дале Обєек.ключь і мап переробляють цей массив в
   //    потрібний формат та повертають JSX розмітку.
   const orderComments = orderBy(comments, ['dateCreation'], ['desc'])
   const itemsRender = Object.keys(orderComments).map(key => {

      const statusLike = [false]
      const data = orderComments[key].likes
      const dif = filter(data, function (item) {

         return item === id;
      })

      // data.forEach(i => {
      //    if (id === i) {
      //       statusLike[0].push(true)
      //    }
      // });
      const item = []

      if (size(users) > 0) {
         const user = users.map(u => {
            if (orderComments[key].author === u.id) {
               item.push(u)
            }
         })
      } else {
         item.push({ photoURL: avatar })
      }

      return (
         <div key={orderComments[key].commentId} className={s.commentBlock}>
            <div className={s.user}>
               <img src={item[0].photoURL} alt="" />
            </div>
            <div className={s.comment}> {orderComments[key].comment}</div>
            <div className={s.likes}>
               <div>{size(orderComments[key].likes)}</div>
               {size(dif) === 0 && <div onClick={(comId) => addLike(orderComments[key].commentId)}><FavoriteBorderIcon /></div>}
               {size(dif) !== 0 && <div onClick={(comId) => removeLike(orderComments[key].commentId)}><FavoriteIcon /></div>}
               {/* <div onClick={(comId) => addLike(orderComments[key].commentId)}><FavoriteBorderIcon /></div>
               <div><FavoriteIcon /></div> */}

            </div>
         </div>
      )
   })
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function addLike(commentId) {
      dispatch(addLikeFunc(['profiles', pageId, commentId, id]))
      // commentsAPI.addLike('profiles', pageId, commentId, id)
   }
   function removeLike(commentId) {
      dispatch(removeLikeFunc(['profiles', pageId, commentId, id]))
      // commentsAPI.removeLike('profiles', pageId, commentId, id)
   }

   if (pageId === '') {
      return <div>LOADING</div>
   }
   return (

      <div className={s.wrapper}>
         <div >
            <form onSubmit={handleSubmit(onSubmit)} className={s.formBlock}>
               <input className={s.input} placeholder='Коментар' {...register("comment")} />

               <input className={s.button} type="submit" />
            </form>
         </div>
         <div className={s.comments}>
            {size(comments) > 0 && itemsRender}
            {size(comments) === 0 && <div>Комментарі відсутні. Ви можете залишити свій коменат першим :)</div>}
         </div>
      </div >
   )
}

export default Comments