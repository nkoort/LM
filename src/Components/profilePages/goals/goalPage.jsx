//Стилі та все шо з ними повязано
import s from '../../../SCSS/goals.module.scss'
import st from '../../../SCSS/tasksPage.module.scss'


// Імпорт бібліотек
import { useForm, Controller } from "react-hook-form"
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { getTasks } from '../../../Redux/tasks-reducer'
import { filter, size, orderBy } from 'lodash'
import classnames from 'classnames'
import * as dayjs from 'dayjs'
//  Власті слайси та компоненти


//  Компоненти із матеріал ЮІ



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


const GoalPage = (props) => {
   //Базові виклики різних функций та інше.
   const dispatch = useDispatch()
   const match = useMatch('profile/goals/:gID')



   //Блок з селекторами
   const goals = useSelector((state) => state.goalsSlice.goals)
   const uid = useSelector((state) => state.registerSlice.profile.id)
   const tasks = useSelector((state) => state.tasksSlice.tasks)
   const cat = useSelector((state) => state.goalsSlice.categories)
   const stat = useSelector((state) => state.goalsSlice.status)

   // Глобальні ефекти та інші хуки

   const [thisGoal, setThisGoal] = useState({})
   const [targetTasks, setTargetTasks] = useState([])
   const [count, setCount] = useState(0)

   useEffect(() => {
      dispatch(getTasks(uid))
      const obj = Object.keys(goals).filter(key => goals[key].id === match.params.gID)
      // debugger
      if (size(tasks) > 0) {
         const objTasks = Object.keys(tasks).filter(key => tasks[key].goal === goals[obj[0]].title)

         let item = Object.keys(objTasks).map(key => {
            let status = tasks[objTasks[key]].status
            let priority = tasks[objTasks[key]].priority

            return (
               <div key={key} className={s.goalPageWrapper__tasks_item}>
                  <div className={s.statusBlock}>
                     {tasks[objTasks[key]].number}
                     <div
                        className={
                           classnames(
                              st.titleBlock__preTitle,
                              {
                                 [st.new]: status === 'New',
                                 [st.inWork]: status === 'In work',
                                 [st.completed]: status === 'Completed',
                                 [s.canceled]: status === 'Canceled',
                                 [st.overdue]: status === 'Overdue',
                              }
                           )
                        }>{statusObj[tasks[objTasks[key]].status]}</div>
                     <div
                        className={
                           classnames(
                              st.titleBlock__prority,
                              {
                                 [st.high]: priority === 'high',
                                 [st.medium]: priority === 'medium',
                                 [st.low]: priority === 'low',
                              }
                           )
                        }>{priorityObj[tasks[objTasks[key]].priority]}</div>
                  </div>
                  <div className={s.title}>{tasks[objTasks[key]].title}</div>
               </div>
            )
         })

         setTargetTasks(item)
      }

      setThisGoal(goals[obj[0]])
   }, [match.params.gID, size(tasks)])

   // Деструктуризация и форматирование переменных
   const title = thisGoal.title
   const goal = thisGoal.goal
   const startDate = dayjs(thisGoal.dateStart).format('MM.DD.YYYY')
   const endDate = dayjs(thisGoal.dateEnd).format('MM.DD.YYYY')
   const category = cat[thisGoal.category]
   const status = stat[thisGoal.status]

   return (
      <div className={s.goalPageWrapper}>
         <div className={s.goalPageWrapper__goal}>
            <div className={s.goalPageWrapper__goal_title}>{title}</div>
            <div className={s.goalPageWrapper__goal_statusBar}>
               <div>{category}</div>
               <div>{status}</div>
               <div className={s.goalPageWrapper__goal_dates}>
                  <div>({startDate}</div>
                  <div>{endDate})</div>
               </div>
            </div>
            <div className={s.goalPageWrapper__goal_text}>{goal}</div>


         </div>

         <div className={s.goalPageWrapper__tasks}>
            <div>Список задач, закріплених за цією ціллю:</div>
            {targetTasks.length === 0 && <div className={s.goalPageWrapper__tasks_item} >За данною ціллю не закріплено жодної задачі. Ви можете створити задачу в розділі задачі та прикріпити до неї головну ціль, або додати її до вже існуючих задач!</div>}
            {targetTasks}
         </div>

      </div >
   )
}




export default GoalPage