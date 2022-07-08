// Стилі та зображення
import s from '../../../SCSS/budget.module.scss'



// Бібліотеки
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size } from 'lodash'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'


// Єлементи МАТЕРІАЛ ЮІ

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { setFilters } from '../../../Redux/budget-reducer'


const BudgetFilter = (props) => {
   // Базові виклики різних функций та інше.
   const dispatch = useDispatch()
   // Блок з селекторами


   // Функції (може бути локальний стейт, та функція повязана з ним в одному функциональному блоці)
   const [monthFilter, setMonth] = useState('');
   const handleChange = (event) => {
      setMonth(event.target.value)
   };



   // Глобальні ефекти та інші хуки
   useEffect(() => {
      dispatch(setFilters([props.data[0].name, monthFilter]))
   }, [monthFilter])


   //Функції рендеру повторяючихся компонентів на сторінку


   // Функція відправки форми
   const items = Object.keys(props.data[1]).map(key => {
      return (
         <MenuItem key={key} value={key}>{props.data[1][key]}</MenuItem>
      )
   })

   return (
      <div className={s.filter}>
         <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">{props.data[2]}</InputLabel>
            <Select
               {...props.data[0]}
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={monthFilter}
               label={props.data[2]}
               onChange={handleChange}
            >
               {items}
            </Select>
         </FormControl>
      </div >
   )
}




export default BudgetFilter