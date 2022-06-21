import s from '../../SCSS/tasksPage.module.scss';

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size } from 'lodash';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import AddTasksModal from './addTasksModal';
import { getTasks, setStatusMessage } from '../../Redux/tasks-reducer';
import TaskItem from './taskItem';


const TasksPage = (props) => {
   const dispatch = useDispatch()

   const tasks = useSelector((state) => state.tasksSlice.tasks)
   const uid = useSelector((state) => state.registerSlice.profile.id)
   const addStatusMessage = useSelector((state) => state.tasksSlice.addStatusMessage)

   const [open, setOpen] = useState(false);
   const [editMode, changeMode] = useState('')
   const [indexItem, changeIndex] = useState('')
   const [sizeTasks, changeSize] = useState(size(tasks))


   useEffect(() => {
      console.log(sizeTasks)
      changeSize(size(tasks))
      dispatch(getTasks(uid))
   }, [size(tasks)])



   const onOpenModal = (data) => {
      if (open) {
         setOpen(false)
         dispatch(setStatusMessage(null))
         changeIndex('')
      } else {
         setOpen(true)
      }
   }


   let newArr = []
   let arr = Object.keys(tasks).map(key => {
      newArr.push(tasks[key])
   })
   let orderObj = orderBy(newArr, ['number'], ['asc'])
   let tasksItems = orderObj.map(i => {
      return (
         <TaskItem
            key={i.taskId}
            changeIndex={changeIndex}
            onOpenModal={onOpenModal}
            editMode={editMode}
            changeEditMode={changeMode}
            title={i.title}
            task={i.task}
            index={i.taskId}
            number={i.number}
            startDate={i.startDate}
            endDate={i.endDate}
            status={i.status}
            priority={i.priority}
            endDateFact={i.endDateFact} />
      )
   })


   return (
      <div>
         <AddTasksModal open={open} handleClose={onOpenModal} editMode={editMode} changeMode={changeMode} indexItem={indexItem} changeIndex={changeIndex} />
         <div className={s.toolBar}>
            <div className={s.toolBar__addBtn}><Tooltip title="Добавить новую задачу" placement="right" arrow >
               <Fab color="primary" aria-label="add" onClick={(data) => onOpenModal('add')}>
                  <div style={{ fontSize: '32px', fontWeight: 100 }}>+</div>
               </Fab>
            </Tooltip>
            </div>
            <div className={s.toolBar__stats}>{sizeTasks}</div>
         </div >
         <div className={s.tasksBlock}>
            {addStatusMessage}
            {tasksItems}
         </div>
      </div>

   )
}

export default TasksPage