//Стилі та все шо з ними повязано
import s from '../../../SCSS/goals.module.scss'
import 'react-calendar/dist/Calendar.css';


// Імпорт бібліотек
import { useForm, Controller } from "react-hook-form"
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

//  Власті слайси та компоненти
import { addGoal, getDirectory } from '../../../Redux/goals-reducer'

import CalendarForm from '../../items/calendar';

//  Компоненти із матеріал ЮІ

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { goalsAPI } from '../../../FIREBASE/api';
import { nanoid } from '@reduxjs/toolkit';



//Стилі для модального вікна (в майбутньому перенести)
const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   bgcolor: 'background.paper',
   border: '2px solid #000',
   boxShadow: 24,
   padding: '10px',
   minWidth: '450px',
}
const GoalsModal = (props) => {
   //Базові виклики різних функций та інше.
   const dispatch = useDispatch()
   const { register, handleSubmit, watch, reset, control, formState: { errors, touchedFields }, setError, clearErrors } = useForm()


   //Блок з селекторами
   const categories = useSelector((state) => state.goalsSlice.categories)
   const status = useSelector((state) => state.goalsSlice.status)
   const uid = useSelector((state) => state.registerSlice.profile.id)

   // Глобальні ефекти та інші хуки
   useEffect(() => {
      dispatch(getDirectory())
   }, [])



   // Блок по обробці дат
   const [dateStartValue, setDS] = useState()
   const [dateEndValue, setDE] = useState()
   const changeDS = (v) => { setDS(v) }
   const changeDE = (v) => { setDE(v) }
   useEffect(() => {
      if (dateStartValue && dateEndValue) {

         if (dateStartValue > dateEndValue) {
            setError('dateError', { type: 'dateError', message: 'Дата початку не може бути більшою за дату закінчення!' });
         } else {
            clearErrors('dateError');
         }
      } else {
         setError('dateError', { type: 'dateError', message: 'Вкажіть дату початку та закінчення' });
      }
   }, [dateStartValue, dateEndValue])


   // Блок по обробці селекторів
   const [category, setCategory] = useState('')
   const handleChangeCategory = (event) => { setCategory(event.target.value) }
   const categoriesSelect = Object.keys(categories).sort().map(key => {
      return <MenuItem key={key} value={key}>{categories[key]}</MenuItem>
   })

   const [stat, setStatus] = useState('')
   const handleChangeStatus = (event) => { setStatus(event.target.value) }
   const statusSelect = Object.keys(status).sort().map(key => {
      return <MenuItem key={key} value={key}>{status[key]}</MenuItem>
   })


   // Блок по обробці помилок
   const errorsText = {
      'category': 'Вкажіть категорію',
      'status': 'Вкажіть статус',
      'title': 'Назва повинна бути від 2 до 80 символів!',
      'goal': 'Текст повинен бути від 10 до 1000 символів!',
      'dateError': errors.dateError ? errors.dateError.message : '',
   }
   const errorsItems = Object.keys(errors).map(key => {
      return <div key={key}>{errorsText[key]}</div>
   })



   // Блок для відправлення форми на сервер
   const onSubmit = data => {
      const goalId = nanoid(10)
      data.createDate = Date.parse(new Date())
      data.dateEnd = Date.parse(data.dateEnd)
      data.dateStart = Date.parse(data.dateStart)
      console.log(data)
      dispatch(addGoal([uid, data, goalId]))
      reset()
   }

   return (
      <div>
         <Modal
            open={props.open}
            onClose={props.modalControl}
         >
            <Box sx={style}>
               <div>{errorsItems}</div>
               <form onSubmit={handleSubmit(onSubmit)} className={s.formContainer} >
                  <FormControl variant="filled" fullWidth>
                     <InputLabel>Категорія</InputLabel>
                     <Select
                        value={category}
                        {...register("category", { required: true })}
                        label="Category"
                        onChange={handleChangeCategory}
                     >
                        {categoriesSelect}
                     </Select>

                  </FormControl>
                  <TextField {...register("title", { required: true, minLength: 2, maxLength: 80 })} label="Назва" variant="filled" />
                  <TextField {...register("goal", { required: true, minLength: 10, maxLength: 1000 })} label="Опис" variant="outlined" multiline rows={4} />
                  <Controller
                     name="dateStart"
                     control={control}
                     rules={{}}
                     render={({ field }) =>
                        <CalendarForm field={field} name='dateStart' setDate={changeDS} value={dateStartValue} label='Дата початку' />
                     } />
                  <Controller
                     name="dateEnd"
                     control={control}
                     rules={{}}
                     render={({ field }) =>
                        <CalendarForm field={field} name='dateEnd' setDate={changeDE} value={dateEndValue} label='Дата завершення' />
                     } />
                  <FormControl variant="filled" fullWidth>
                     <InputLabel>Статус</InputLabel>
                     <Select
                        value={stat}
                        {...register("status", { required: true })}
                        label="status"
                        onChange={handleChangeStatus}
                     >
                        {statusSelect}
                     </Select>

                  </FormControl>

                  <div>
                     <Button variant="contained" type='submit' >Сохранить</Button>
                  </div>
               </form>

            </Box>
         </Modal>
      </div >
   )
}




export default GoalsModal