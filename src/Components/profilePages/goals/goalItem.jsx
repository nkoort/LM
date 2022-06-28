//Стилі та все шо з ними повязано
import s from '../../../SCSS/goals.module.scss'



// Імпорт бібліотек
import { useForm, Controller } from "react-hook-form"
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

//  Власті слайси та компоненти


//  Компоненти із матеріал ЮІ

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs'
import { NavLink } from 'react-router-dom'





const GoalItem = ({ goals, uid }) => {
   //Базові виклики різних функций та інше.
   const dispatch = useDispatch()


   //Блок з селекторами
   const categories = useSelector((state) => state.goalsSlice.categories)
   const status = useSelector((state) => state.goalsSlice.status)
   // Глобальні ефекти та інші хуки



   // Мапінг компонента цілі
   const goal = Object.keys(goals).map(key => {
      const dateCreate = dayjs(goals[key].createData).format('MM.DD.YYYY HH:mm')
      return (
         <div className={s.goalItem} key={key}>
            <div className={s.goalItem__status}>{status[goals[key].status]}</div>
            <div className={s.goalItem__category}>{categories[goals[key].category]}</div>
            <NavLink to={`/profile/goals/${goals[key].id}`}>
               <div className={s.goalItem__title}>{goals[key].title} ({dateCreate})</div>
            </NavLink>


         </div>
      )
   })

   return (
      <div>
         <Box sx={{ width: '100%' }}>
            <Stack spacing={3}>
               {goal}
            </Stack>
         </Box>
      </div >
   )
}




export default GoalItem