import s from '../../SCSS/tasksPage.module.scss'

import { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { size } from 'lodash'

import { addTask } from '../../Redux/tasks-reducer'


import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';



const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 'calc(0.7*100vw)',
   bgcolor: 'background.paper',
   borderRadius: '15px',
   boxShadow: 24,
   p: 4,
}

export default function AddTasksModal(props) {
   const dispatch = useDispatch()

   const addStatusMessage = useSelector((state) => state.tasksSlice.addStatusMessage)
   const uid = useSelector((state) => state.registerSlice.profile)
   const addStatus = useSelector((state) => state.tasksSlice.addStatus)
   const tasks = useSelector((state) => state.tasksSlice.tasks)



   let defaultValues = ''
   if (props.editMode === 'edit') {

      defaultValues = {
         task: tasks[props.indexItem].task,
         title: tasks[props.indexItem].title,
         status: tasks[props.indexItem].status,
         priority: tasks[props.indexItem].priority,

      }
   } else {
      defaultValues = {
         title: ''
      }
   }

   const { register, handleSubmit, formState: { errors }, control, reset } = useForm()

   const [disabledForm, disabledChange] = useState(false)
   const [valueDateStart, setValueDateStart] = useState(null)
   const [valueDateEnd, setValueDateEnd] = useState(null)
   const [valueDateEndFact, setValueDateEndFact] = useState(null)
   const [status, setStatus] = useState('');
   const [priority, setPriority] = useState('');



   const handleChangeStatus = (event) => {
      setStatus(event.target.value);
   };
   const handleChangePriority = (event) => {
      setPriority(event.target.value);
   };

   useEffect(() => {
      if (props.editMode === 'edit') {
         setValueDateStart(tasks[props.indexItem].startDate.seconds * 1000)
         setValueDateEnd(tasks[props.indexItem].endDate.seconds * 1000)
         // setValueDateEndFact(tasks[props.indexItem].endDateFact.seconds * 1000)
         // setValueDateEndFact()
      }
   }, [props.editMode]);

   const onSubmit = (data) => {
      let taskId = nanoid(10)
      if (props.indexItem !== '') {
         data.number = size(tasks)
      } else {
         data.number = size(tasks) + 1
      }
      const arrData = [uid.id, data, taskId]
      const arrData2 = [uid.id, data, props.indexItem]
      if (props.indexItem !== '') {
         dispatch(addTask(arrData2))
      } else {
         dispatch(addTask(arrData))
      }
      disabledChange(true)
      setValueDateEnd(null)
      setValueDateStart(null)
      setValueDateEndFact(null)
      reset()
   }

   return (
      <div>
         <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box sx={style}>
               {addStatusMessage && <div style={{ margin: '0 0 15px 0', textAlign: 'center' }}>{addStatusMessage}</div>}
               <form onSubmit={handleSubmit(onSubmit)} className={s.formAddTask}>
                  <div className={s.inputContainer}>
                     <Controller
                        control={control}
                        {...register('title')}
                        render={({ field: { onChange } }) => <TextField
                           defaultValue={defaultValues.title}
                           disabled={disabledForm}
                           fullWidth
                           onChange={onChange}
                           id="outlined-textarea"
                           label="Название"
                           multiline />
                        } />
                     <Controller
                        control={control}
                        {...register('task')}
                        render={({ field: { onChange } }) => <TextField
                           disabled={disabledForm}
                           defaultValue={defaultValues.task}
                           fullWidth
                           onChange={onChange}
                           id="outlined-textarea"
                           label="Описание задачи"
                           multiline
                           rows={4}
                        />
                        } />

                     <div style={{ display: 'flex', gap: '10px' }}>
                        <Controller
                           name="startDate"
                           control={control}
                           rules={{ required: true }}
                           render={({ field }) => <LocalizationProvider dateAdapter={AdapterDateFns} >
                              <DatePicker
                                 disabled={disabledForm}
                                 p='4'
                                 label="Дата начала"
                                 value={valueDateStart}
                                 onChange={(newValue) => {
                                    setValueDateStart(newValue)
                                    field.onChange(newValue)
                                 }}
                                 renderInput={(params) => <TextField {...params} className={s.calendar} />}
                              />
                           </LocalizationProvider>}
                        />
                        <Controller
                           name="endDate"
                           control={control}
                           rules={{ required: true }}
                           render={({ field }) => <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                 disabled={disabledForm}
                                 p='2'
                                 label="Дата завершения"
                                 value={valueDateEnd}
                                 onChange={(newValue) => {
                                    setValueDateEnd(newValue)
                                    field.onChange(newValue)
                                 }}
                                 renderInput={(params) => <TextField {...params} className={s.calendar} />}
                              />
                           </LocalizationProvider>}
                        />
                     </div>
                  </div>



                  <div>
                     <Button variant="contained" type='submit' disabled={disabledForm}>Сохранить</Button>
                  </div>
               </form>

            </Box>
         </Modal>
      </div>
   )
}
