import s from '../../SCSS/tasksPage.module.scss';

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import AddTasksModal from './addTasksModal';
import { getTasks, setStatusMessage } from '../../Redux/tasks-reducer';



const TasksPage = (props) => {
   const dispatch = useDispatch()

   const tasks = useSelector((state) => state.tasksSlice.tasks)
   const uid = useSelector((state) => state.registerSlice.profile.id)
   const addStatusMessage = useSelector((state) => state.tasksSlice.addStatusMessage)

   const [open, setOpen] = useState(false);

   useEffect(() => {
      dispatch(getTasks(uid))
   }, [])


   const onOpenModal = () => {
      if (open) {
         setOpen(false)
         dispatch(setStatusMessage(null))
      } else {
         setOpen(true)
      }
   }

   let tasksItems = tasks.map((t, index) => {
      return (
         <div key={index} className={s.blockTask}>
            <div className={s.indexNumber}>{index + 1}</div>
            <div className={s.title}>{t.title}</div>
            <div className={s.task}>{t.task}</div>
         </div>
      )
   })

   return (
      <div>
         <AddTasksModal open={open} handleClose={onOpenModal} />
         <div>
            <Tooltip title="Добавить новую задачу" placement="right" arrow >
               <Fab color="primary" aria-label="add" onClick={onOpenModal}>
                  <div style={{ fontSize: '32px', fontWeight: 100 }}>+</div>
               </Fab>
            </Tooltip>
         </div >
         <div>
            {addStatusMessage}
            {tasksItems}
         </div>
      </div>

   )
}

export default TasksPage