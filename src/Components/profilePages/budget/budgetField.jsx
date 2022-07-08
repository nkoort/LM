// Стилі та зображення
import s from '../../../SCSS/budget.module.scss'



// Бібліотеки
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size, sortBy } from 'lodash'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { nanoid } from '@reduxjs/toolkit'


import { addField, changeField, delField, realtimeUpdate } from '../../../Redux/budget-reducer'

// Єлементи МАТЕРІАЛ ЮІ
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import { budgetAPI } from '../../../FIREBASE/apiRealtime'


const BudgetField = ({ register, plan, watch, errors }) => {
   // Базові виклики різних функций та інше.
   const dispatch = useDispatch()


   // Блок з селекторами
   const fields = useSelector(state => state.budgetSlice.fields)
   const filters = useSelector(state => state.budgetSlice.filters)
   const uid = useSelector((state) => state.registerSlice.profile.id)
   // console.log(plan)

   // Функції (може бути локальний стейт, та функція повязана з ним в одному функциональному блоці)
   function addFields() {
      const m = Number(filters.month)
      const y = Number(filters.year)
      const mon = m < 10 ? `0${m}` : m
      const newDate = dayjs(`${y}-01-${mon}`).valueOf()
      const a = size(plan[0])
      const id = nanoid(10)
      dispatch(addField([id, size(plan[0]), newDate]))
   }

   function deleteField(uid, type, date, field) {
      dispatch(delField([uid, type, date, field]))
   }



   // Глобальні ефекти та інші хуки
   useEffect(() => {
   }, [filters, plan[0]])

   //Функції рендеру повторяючихся компонентів на сторінку
   function item() {
      const field = []
      function onChange(e, key, type, date, item) {
         dispatch(changeField([e.target.value, key, type]))
         dispatch(realtimeUpdate([uid, filters.type, date, key, type, e.target.value, item]))
         // budgetAPI.realtimeUpdate(uid, filters.type, date, key, type, e.target.value)
      }
      if (size(plan) > 0) {


         const item = Object.keys(plan[0]).map((key, i) => {
            // setNumber(number + 1)
            const errName = errors?.plan?.[key]?.name ? true : false
            const nameText = (type) => {
               switch (type) {
                  case 'minLength':
                     return 'Мінімум 2 символи';
                  case 'required':
                     return 'Вкажіть назву';
                  default:
                     return 'Назва'
               }
            }
            const errCat = errors?.plan?.[key]?.category ? true : false
            const categoryText = (type) => {
               switch (type) {
                  case 'minLength':
                     return 'Мінімум 2 символи';
                  case 'required':
                     return 'Вкажіть категорію';
                  default:
                     return 'Категорія'
               }
            }
            const errValue = errors?.plan?.[key]?.value ? true : false
            const valueText = (type) => {
               switch (type) {
                  case 'minLength':
                     return 'Вкажіть вартість';
                  case 'required':
                     return 'Вкажіть вартість';
                  default:
                     return 'Вартість'
               }
            }
            const errAmount = errors?.plan?.[key]?.amount ? true : false
            const valueAmont = (type) => {
               switch (type) {
                  case 'minLength':
                     return 'Вкажіть кількість';
                  case 'required':
                     return 'Вкажіть кількість';
                  default:
                     return 'Кількість'
               }
            }



            field.push(
               <div key={plan[0][key]?.meta?.id} className={s.wrapper}>
                  <div className={s.fieldLine}>
                     <div className={s.number}>
                        №: {i + 1}
                     </div>
                     <TextField
                        {...register(`plan.${key}.name`, { required: true, minLength: 2 })}
                        id="standard-helperText"
                        error={errName}
                        onChange={(e, k, type, d, i) => onChange(e, key, 'name', plan[0][key].meta.periodDate, plan[0][key])}
                        value={plan[0][key].name}
                        helperText={nameText(errors?.plan?.[key]?.name?.type)}
                        variant="standard"
                     />
                     <TextField
                        {...register(`plan.${key}.category`, { required: true, minLength: 2 })}
                        id="standard-helperText"
                        error={errCat}
                        onChange={(e, k) => onChange(e, key, 'category', plan[0][key].meta.periodDate, plan[0][key])}
                        defaultValue={plan[0][key].category}
                        helperText={categoryText(errors?.plan?.[key]?.category?.type)}
                        variant="standard"
                     />
                     <TextField
                        {...register(`plan.${key}.price`, { required: true, minLength: 1 })}
                        id="standard-helperText"
                        error={errAmount}
                        onChange={(e, k) => onChange(e, key, 'amount', plan[0][key].meta.periodDate, plan[0][key])}
                        defaultValue={plan[0][key].amount}
                        helperText={valueAmont(errors?.plan?.[key]?.amount)}
                        variant="standard"
                        type="number"
                     />
                     <TextField
                        {...register(`plan.${key}.amount`, { required: true, minLength: 1 })}
                        id="standard-helperText"
                        error={errValue}
                        onChange={(e, k) => onChange(e, key, 'value', plan[0][key].meta.periodDate, plan[0][key])}
                        defaultValue={plan[0][key].value}
                        helperText={valueText(errors?.plan?.[key]?.value?.type)}
                        variant="standard"
                        type="number"
                     />

                  </div>
                  <ClearIcon onClick={(i, t, d, f) => deleteField(uid, filters.type, plan[0][key].meta.periodDate, key)} />
               </div>
            )
         })
      } else {
         field.push(<div key={1}>null</div>)
      }
      return field
   }


   // Функція відправки форми


   return (
      <div>
         <div><AddIcon onClick={addFields} /></div>
         <div className={s.fields}>
            {item()}
         </div>


      </div >
   )
}




export default BudgetField

