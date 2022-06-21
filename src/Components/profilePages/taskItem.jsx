import s from '../../SCSS/tasksPage.module.scss';

import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/ru'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button'





dayjs.locale('ru')

const TaskItem = ({ title, task, index, number, startDate, endDate, endDateFact, onOpenModal, changeIndex, priority = null, status = null }) => {
   const [newStatus, statusChange] = useState(status)

   useEffect(() => {
      statusChange(status)
      let b = Date.parse(new Date())

      if (endDate < b) {
         if (status === 'In work' || status === 'New') {
            statusChange('Overdue')
         } else {
            statusChange(status)
         }
      }
   }, [status, endDate])
   function dateCreater(date) {

      return (
         dayjs(new Date(date)).format('MMMM D, YYYY')
      )
   }
   function countDay(dateE, dateS) {
      return dateE ?
         Math.round(((new Date(dateE / 1000) - Date.parse(new Date()) / 1000) / 86400)) :
         Math.round(((Date.parse(new Date(dateE)) / 1000 - Date.parse(new Date()) / 1000) / 86400))
   }



   function openModal(data, index) {
      onOpenModal(data)
      changeIndex(index)
   }
   const statusObj = {
      'New': 'Новая',
      'In work': 'В работе',
      'Completed': 'Завершено',
      'Canceled': 'Отменено',
      'Overdue': 'Просрочено',
   }
   const priorityObj = {
      'high': 'Высокий',
      'medium': 'Средний',
      'low': 'Низкий',
   }

   return (
      <div>
         <Accordion>
            <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header">
               <div className={s.titleBlock}>
                  <div className={s.titleBlock__index}>{number}</div>
                  <div className={
                     classnames(
                        s.titleBlock__preTitle,
                        {
                           [s.new]: newStatus === 'New',
                           [s.inWork]: newStatus === 'In work',
                           [s.completed]: newStatus === 'Completed',
                           [s.canceled]: newStatus === 'Canceled',
                           [s.overdue]: newStatus === 'Overdue',
                        }
                     )
                  }
                  >{statusObj[newStatus]}</div>
                  <div className={
                     classnames(
                        s.titleBlock__title,
                        s.mainTitle
                     )
                  }>{title}</div>
               </div>

            </AccordionSummary>
            <AccordionDetails className={s.taskDetail}>
               <div className={s.taskDetailBlock}>
                  <div className={s.taskMainText}>
                     <div className={s.taskMainText__info}>
                        <div>
                           <span className={s.dateStart}>Период выполнения: {dateCreater(startDate)}</span>
                           <span className={s.dateEnd}> - {dateCreater(endDate)}</span>
                        </div>
                        <div>{`Остаток дней: ${countDay(endDate, startDate)}`}</div>
                        {endDateFact &&
                           <div className={s.dateEnd}>  Фактически завершено: {dateCreater(endDateFact)}</div>
                        }
                        <div className={s.statusBlock}>
                           <div
                              className={
                                 classnames(
                                    s.titleBlock__preTitle,
                                    {
                                       [s.new]: newStatus === 'New',
                                       [s.inWork]: newStatus === 'In work',
                                       [s.completed]: newStatus === 'Completed',
                                       [s.canceled]: newStatus === 'Canceled',
                                       [s.overdue]: newStatus === 'Overdue',
                                    }
                                 )
                              }>{statusObj[newStatus]}</div>
                           <div
                              className={
                                 classnames(
                                    s.titleBlock__prority,
                                    {
                                       [s.high]: priority === 'high',
                                       [s.medium]: priority === 'medium',
                                       [s.low]: priority === 'low',
                                    }
                                 )
                              }>{priorityObj[priority]}</div>
                        </div>
                     </div>
                     <div className={s.taskMainText__text}>{task}</div>

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




