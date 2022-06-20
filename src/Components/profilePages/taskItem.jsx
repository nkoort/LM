import s from '../../SCSS/tasksPage.module.scss';

import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/ru'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'





dayjs.locale('ru')

const TaskItem = ({ title, task, index, startDate, endDate, onOpenModal, changeIndex, priority = 'null null', status = 'null null' }) => {


   function dateCreater(date) {
      return (
         date.seconds ?
            dayjs(new Date(date.seconds * 1000)).format('MMMM D, YYYY') :
            dayjs(new Date(Date.parse(date))).format('MMMM D, YYYY')
      )
   }
   function countDay(dateE, dateS) {
      return dateE.seconds ?
         Math.round(((new Date(dateE.seconds) - Date.parse(new Date()) / 1000) / 86400)) :
         Math.round(((Date.parse(new Date(dateE)) / 1000 - Date.parse(new Date()) / 1000) / 86400))
   }

   let b = Date.parse(new Date())

   function openModal(data, index) {
      onOpenModal(data)
      changeIndex(index)
   }

   return (
      <div>
         <Accordion>
            <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header">
               <div className={s.titleBlock}>
                  <div className={s.titleBlock__index}>{index + 1}</div>
                  <div className={s.titleBlock__title}>{title}</div>
               </div>

            </AccordionSummary>
            <AccordionDetails className={s.taskDetail}>
               <div className={s.taskDetailBlock}>
                  <div className={s.taskMainText}>
                     <div className={s.taskMainText__dates}>
                        <div className={s.dateStart}>Период выполнения: {dateCreater(startDate)}</div>
                        <div className={s.dateEnd}> - {dateCreater(endDate)}</div>
                        <div>{`(${countDay(endDate, startDate)})`}</div>
                     </div>
                     <div className={s.taskMainText__text}>{task}</div>
                     <div>{status}</div>
                     <div>{priority}</div>
                  </div>

                  <div className={s.taskEdit}>
                     <Button variant="contained" size="small" className={s.buttonEdit} onClick={() => openModal('edit', index)}>Изменить</Button>
                  </div>
               </div>

            </AccordionDetails>
         </Accordion>

      </div >
   )
}

export default TaskItem




