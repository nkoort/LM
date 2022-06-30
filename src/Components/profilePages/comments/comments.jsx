import s from '../../../SCSS/comments.module.scss';
import avatar from '../../../assets/img/avatarDefault.png'


import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { size, orderBy, filter } from 'lodash'
import { useForm } from "react-hook-form";
import { NavLink, useMatch } from 'react-router-dom';
import { useEffect } from 'react';


//Власні компоненти на слайсиі
import { addComments, getComments, addLikeFunc, removeLikeFunc } from '../../../Redux/comments-reducer';



//Matriel UI components
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';




// Компонент приймає тип коментара в залежності від якого, подалший код буде зберігати
// та відображати коментарі на сторінках ЦІЛІ та в профілях користувача.
// Типів поки що може бути 2 : 'goals', 'profiles'
const Comments = ({ type }) => {
   const dispatch = useDispatch()
   const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
   const match = useMatch('profile/user/:pid')
   const matchGoal = useMatch('profile/goals/:gid')

   const matchID = type == 'goals' ? matchGoal : match
   //Локальні стейти
   const [pageId, setPageId] = useState('')


   //Блок з селекторами
   const { userName, id, photoURL } = useSelector((state) => state.registerSlice.profile)
   const { comments, users } = useSelector((state) => state.commentsSlice)

   // Глобальні ефекти та інші хуки

   useEffect(() => {
      // Ефект перевіряє який сценарій потрібно запустити, в зажелності від того, який тип прийшов до
      // компонента. 
      const meProfile = { id: id, photoURL: photoURL }
      if (type === 'goals') {
         setPageId(matchGoal.params.gid)

         if (pageId !== '') {

            dispatch(getComments([type, pageId, meProfile]))

         }
      } else {
         size(match) === 0 ? setPageId(id) : setPageId(matchID.params.pid)
         if (pageId !== '') {
            dispatch(getComments([type, pageId, meProfile]))
         }
      }
   }, [pageId, size(match), match])

   //Функція відправки форми для додавання коментара. Отримує данні з поля для вводу, потім
   // доповнює їх потрібною інформацією та відправляє в подальшу обробку. В закінчення обнуляє форму.
   const onSubmit = data => {
      data.dateCreation = Date.parse(new Date())
      data.pageId = pageId
      data.author = id
      data.likes = []
      dispatch(addComments([type, pageId, data]))
      reset()
   }

   // Бере массив коментарів який приходить з сервера, потім за допомгою orderBy сортує його по даті створення
   //    від більшого до мншого, та повертає інший массив. Дале Обєек.ключь і мап переробляють цей массив в
   //    потрібний формат та повертають JSX розмітку.
   const orderComments = orderBy(comments, ['dateCreation'], ['desc'])
   const itemsRender = Object.keys(orderComments).map(key => {
      const data = orderComments[key].likes

      const dif = filter(data, function (i) {

         return i === id;
      })

      // Алгоритм який перевіряє наявність коментарів та формує обєекти для стфорення блоків
      // з відображення який саме користувачь написав коментар, перевіряє наявність фото, в разі
      // відсутності додає фото профілю, тобто дефолтне зображення, та айді користувача який зараз залогінився
      // В подальшому потрібо додавати в блок ЕЛСЕ додаткові данні, які повинні показуватись, в разі
      // відсутності раніше створених коментів. Цей блок також допомагае уникнути помилок в разі коли
      // коментар публікується першим, щоб сторінка корректно його відобразила.
      const item = []
      if (size(users) > 0) {

         const user = users.map(u => {
            // Конструкція let obj = { ...u } робить копію обєкту який сформовано функциєю
            // таким чином зявляється можливість його змінювати, обект який сформовано функцією
            //змінювати заборонено, буде помилка.
            let obj = { ...u }

            if (orderComments[key].author === u.id) {

               if (!u.photoURL) {
                  obj['photoURL'] = avatar
                  item.push(obj)
               } else {
                  item.push(obj)
               }
            }
            // } else if (type === 'goals' && size(users) === 0) {
            //    
            //    item.push({ photoURL: photoURL, id: id })
            // }
         })
      } else {
         item.push({ photoURL: photoURL, id: id })
      }

      return (
         <div key={orderComments[key].commentId} className={s.commentBlock}>
            <div className={s.user}>
               <NavLink to={`/profile/user/${item[0].id}`}>
                  <img src={item[0].photoURL} alt="" />
               </NavLink>
            </div>
            <div className={s.comment}> {orderComments[key].comment}</div>
            <div className={s.likes}>
               <div>{size(orderComments[key].likes)}</div>
               {size(dif) === 0 && <div onClick={(t, comId) => likeFunc('add', orderComments[key].commentId)}><FavoriteBorderIcon /></div>}
               {size(dif) !== 0 && <div onClick={(t, comId) => likeFunc('remove', orderComments[key].commentId)}><FavoriteIcon /></div>}
            </div>
         </div >
      )
   })
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function likeFunc(t, commentId) {
      const params = [type, pageId, commentId, id]
      t == 'add' ? dispatch(addLikeFunc(params)) :
         dispatch(removeLikeFunc(params))
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