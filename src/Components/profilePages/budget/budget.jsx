// Стилі та зображення
import s from '../../../SCSS/budget.module.scss'



// Бібліотеки
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size } from 'lodash'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'


//Власні функції, редьюсери, компоненти
import { budgetAPI } from '../../../FIREBASE/apiRealtime'
import { addField, getPlan } from '../../../Redux/budget-reducer'
import BudgetField from './budgetField'
import BudgetFilter from './budgetFilter'

// Єлементи МАТЕРІАЛ ЮІ
import Button from '@mui/material/Button'



const monthArr = {
   '1': 'Січень',
   '2': 'Лютий',
   '3': 'Березень',
   '4': 'Квітень',
   '5': 'Травень',
   '6': 'Червень',
   '7': 'Липень',
   '8': 'Серпень',
   '9': 'Вересень',
   '10': 'Жовтень',
   '11': 'Листопад',
   '12': 'Грудень',
}

const typeArr = {
   'year': 'Рік',
   'month': 'Місяць',
   'week': 'Тиждень'
}

const yearsArr = { 2021: 2021, 2022: 2022, 2023: 2023, 2024: 2024 }


const BudgetPage = (props) => {
   // Базові виклики різних функций та інше.
   const dispatch = useDispatch()
   // const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({ defaultValues: { plan } })



   // Блок з селекторами
   const uid = useSelector((state) => state.registerSlice.profile.id)
   const filters = useSelector(state => state.budgetSlice.filters)
   const plan = useSelector(state => state.budgetSlice.plan)
   const { register, handleSubmit, watch, formState: { errors }, reset, unregister, resetField } = useForm({ defaultValues: plan[0] })
   // Функції (може бути локальний стейт, та функція повязана з ним в одному функциональному блоці)

   // Глобальні ефекти та інші хуки
   useEffect(() => {

      if (filters.year !== '' && filters.month !== '' && filters.type !== '') {

         dispatch(getPlan([uid, filters.type, filters.month, filters.year, dispatch]))
         reset({})
      }

   }, [filters])


   //Функції рендеру повторяючихся компонентів на сторінку

   // Функція відправки форми
   const onSubmit = (data, e) => {
      const m = Number(data.month)
      const y = Number(data.year)
      const mon = m < 10 ? `0${m}` : m
      const newDate = dayjs(`${y}-01-${mon}`).valueOf()
      dispatch(addField([uid, data.type, newDate, plan[0], 'submit']))
   }
   return (
      <div>
         BUDGET!!!!!!!
         <form onSubmit={handleSubmit(onSubmit)}>
            <div>
               <div>filters:</div>
               {errors.data && <div>Вкажіть корректну дату!</div>}
               <div className={s.fillters}>
                  <BudgetFilter data={[{ ...register('year', { required: true }) }, yearsArr, 'Рік', reset]} />
                  <BudgetFilter data={[{ ...register('month', { required: true }) }, monthArr, 'Місяць', reset]} />
                  <BudgetFilter data={[{ ...register('type', { required: true }) }, typeArr, 'Тип', reset]} />
               </div>
            </div>
            <div className={s.subtitle}>Базові витрати</div>
            <div>
               <BudgetField register={register} plan={plan} watch={watch} errors={errors} />
            </div>



            <Button variant="contained" type='submit'>Зберегти</Button>
         </form>
      </div >
   )
}




export default BudgetPage