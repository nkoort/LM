import s from '../../SCSS/tasksPage.module.scss';

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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

   useEffect(() => {
      dispatch(getTasks(uid))
   }, [])


   function changeEditMode(mode) {
      changeMode(mode)
   }

   const onOpenModal = (data) => {
      if (open) {
         setOpen(false)
         dispatch(setStatusMessage(null))
         changeEditMode('')
      } else {
         changeEditMode(data)
         setOpen(true)
      }
   }
   let tasksItems = Object.keys(tasks).map(key => {
      return (
         <TaskItem
            key={key}
            changeIndex={changeIndex}
            onOpenModal={onOpenModal}
            editMode={editMode}
            changeEditMode={changeEditMode}
            title={tasks[key].title}
            task={tasks[key].task}
            index={key}
            startDate={tasks[key].startDate}
            endDate={tasks[key].endDate}
            status={tasks[key].status}
            priority={tasks[key].priority} />
      )
   })


   return (
      <div>
         <AddTasksModal open={open} handleClose={onOpenModal} editMode={editMode} indexItem={indexItem} />
         <div>
            <Tooltip title="Добавить новую задачу" placement="right" arrow >
               <Fab color="primary" aria-label="add" onClick={onOpenModal}>
                  <div style={{ fontSize: '32px', fontWeight: 100 }}>+</div>
               </Fab>
            </Tooltip>
         </div >
         <div className={s.tasksBlock}>
            {addStatusMessage}
            {tasksItems}
         </div>
      </div>

   )
}

export default TasksPage