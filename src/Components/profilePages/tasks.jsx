import s from '../../SCSS/tasksPage.module.scss';

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size } from 'lodash';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import AddTasksModal from './addTasksModal';
import { getTasks, setStatusMessage } from '../../Redux/tasks-reducer';
import TaskItem from './taskItem';
import { height } from '@mui/system';


const TasksPage = (props) => {

   const dispatch = useDispatch()

   const tasks = useSelector((state) => state.tasksSlice.tasks)
   const uid = useSelector((state) => state.registerSlice.profile.id)
   const addStatusMessage = useSelector((state) => state.tasksSlice.addStatusMessage)

   // debugger

   const [open, setOpen] = useState(false);
   const [editMode, changeMode] = useState('')
   const [indexItem, changeIndex] = useState('')
   const [sizeTasks, changeSize] = useState(size(tasks))
   const [sizeCompleted, changeCompleted] = useState(0)
   const [prorityFilter, priorityChange] = useState('all')
   const [arr, arrChange] = useState([])

   let sizeCompletedValue = tasks ? Object.keys(tasks).filter(key => tasks[key].status === 'Completed') : {}

   useEffect(() => {
      console.log(sizeTasks)

      changeCompleted(size(sizeCompletedValue))
      changeSize(size(tasks))
      dispatch(getTasks(uid))


   }, [size(tasks), size(sizeCompletedValue)])



   const onOpenModal = () => {
      if (open) {
         setOpen(false)
         dispatch(setStatusMessage(null))
         changeIndex('')
      } else {
         setOpen(true)
      }
   }



   useEffect(() => {
      if (size(tasks) !== 0) {
         let newArr = []
         Object.keys(tasks).map(key => { newArr.push(tasks[key]) })
         arrChange(newArr)

      }
   }, [size(tasks)])

   let orderObj = orderBy(arr, ['number'], ['asc'])
   let tasksFilter = orderObj.filter(f => prorityFilter === 'all' ? f : f.priority === prorityFilter)
   let tasksItems = tasksFilter.map(i => {
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
   let persent = Math.floor(Number(sizeCompleted) / Number(sizeTasks) * 100)

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
            <div className={s.toolBar__stats}></div>
            <Box sx={{ width: '50%' }} className={s.lineBlock}>
               <div className={s.lineBlock__counter}>{sizeCompleted} / {sizeTasks} ({persent}%)</div>
               <LinearProgress style={{ height: '30px' }} variant="determinate" value={persent} />
            </Box>
            <div className={s.radioBlock}>
               <FormControl  >
                  <FormLabel className={s.title}>Приоритет</FormLabel>
                  <RadioGroup
                     row
                     defaultValue="all"
                     className={s.group}
                     onChange={(data) => {
                        priorityChange(data.target.value)
                     }}
                  >
                     <FormControlLabel size="small" value="all" control={<Radio size='small' />} label="Все" />
                     <FormControlLabel value="high" control={<Radio size="small" />} label="Высокий" />
                     <FormControlLabel value="medium" control={<Radio size="small" />} label="Средний" />
                     <FormControlLabel value="low" control={<Radio size="small" />} label="Низкий" />
                  </RadioGroup>
               </FormControl>
            </div>
         </div >
         <div className={s.tasksBlock}>
            {addStatusMessage}
            {tasksItems}
         </div>
      </div>

   )
}

export default TasksPage


