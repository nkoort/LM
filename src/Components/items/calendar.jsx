import s from '../../SCSS/items/calendar.module.scss'
import 'react-calendar/dist/Calendar.css'


import { useForm, Controller } from "react-hook-form"
import { useState } from 'react'
import Calendar from 'react-calendar'
import * as dayjs from 'dayjs'


import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TextField from '@mui/material/TextField';


const CalendarForm = ({ name, setDate, value, field, label }) => {
   const [open, setOpen] = useState(false)
   function handleOpen() {
      open ? setOpen(false) : setOpen(true)
   }
   const format = 'DD/MM/YYYY'
   const date = value ? dayjs(Date.parse(value)).format(format) : dayjs(new Date()).format(format)




   return (
      <div className={s.wrapper}>
         <div className={s.calendarInput} onClick={handleOpen}>
            <TextField id="standard-basic" label={label} variant="standard" value={date} className={s.input} disabled />
            <div className={s.icon}><CalendarMonthIcon /></div>
         </div>

         {open &&
            <div className={s.calendarBlock}>
               <Calendar className={s.calendarItem} onChange={(v) => {
                  field.onChange(v)
                  setDate(v)
                  handleOpen()
               }} value={value} name={name} />
            </div>
         }
      </div>





   )
}




export default CalendarForm