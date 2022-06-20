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
const styleSelects = {
   minWidth: 120,
   margin: '10px 0',
}

export default function AddTasksModal(props) {
   const dispatch = useDispatch()

   const addStatusMessage = useSelector((state) => state.tasksSlice.addStatusMessage)
   const uid = useSelector((state) => state.registerSlice.profile)
   const addStatus = useSelector((state) => state.tasksSlice.addStatus)
   const tasks = useSelector((state) => state.tasksSlice.tasks)

   const [defaultValues, defChange] = useState({})
   const [titeText, changeTitle] = useState('')
   const [taskText, changeTask] = useState('')
   const [disabledForm, disabledChange] = useState(false)
   const [valueDateStart, setValueDateStart] = useState(null)
   const [valueDateEnd, setValueDateEnd] = useState(null)
   const [valueDateEndFact, setValueDateEndFact] = useState(null)
   const [status, setStatus] = useState('');
   const [priority, setPriority] = useState('');


   useEffect(() => {
      debugger
      if (props.indexItem !== '') {
         changeTask(tasks[props.indexItem].task)
         changeTitle(tasks[props.indexItem].title)
         setStatus(tasks[props.indexItem].status)
         setPriority(tasks[props.indexItem].priority)
         setValueDateStart(tasks[props.indexItem].startDate.seconds * 1000)
         setValueDateEnd(tasks[props.indexItem].endDate.seconds * 1000)
      }

   }, [props.indexItem])
   // if (props.editMode === 'edit') {
   //    defaultValues = 
   // } else {
   //    defaultValues = {
   //       title: ''
   //    }
   // }

   const { register, watch, handleSubmit, formState: { errors }, control, reset, setError, clearErrors } = useForm({
      defaultValues
   })





   const handleChangeStatus = (event) => {
      setStatus(event.target.value);
   };
   const handleChangePriority = (event) => {
      setPriority(event.target.value);
   };



   const onSubmit = (data) => {
      debugger
      let newObj = {}
      let newData = Object.keys(data).map(m => data[m] ? newObj[m] = data[m] : '')

      let taskId = nanoid(10)
      if (props.indexItem !== '') {
         newObj.number = tasks[props.indexItem].number
      } else {
         newObj.number = size(tasks) + 1
      }
      const arrData = [uid.id, newObj, taskId]
      const arrData2 = [uid.id, newObj, props.indexItem]
      if (props.indexItem !== '') {
         dispatch(addTask(arrData2))
      } else {
         dispatch(addTask(arrData))
      }
      setValueDateEnd(null)
      setValueDateStart(null)
      setValueDateEndFact(null)
      reset()
   }



   const startDate = watch('startDate')
   const watchTitle = watch('title')
   // if (size(watchTitle) < 2) {
   //    setError('titleError', { type: 'titleError', message: 'custom message' });
   // } else {
   //    clearErrors('titleError')
   // }

   const errorsItems = Object.keys(errors).map(key => {
      return (
         <div>{key} - {errors[key].type}</div>
      )
   })


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
                     <div>{errors && errorsItems}</div>
                     {/* <Controller
                        control={control}
                        defaultValue={titeText}
                        {...register('title', { minLength: 2, maxLength: 80 })}
                        render={({ field: { onChange, value } }) => <TextField
                           disabled={disabledForm}
                           fullWidth
                           value={titeText}

                           onChange={(value) => {
                              changeTitle(value.currentTarget.value)
                              onChange(value.currentTarget.value)
                           }}
                           id="outlined-textarea"
                           label="Название"
                           multiline />
                        } /> */}

                     <TextField
                        {...register('title', { minLength: 2, maxLength: 120 })}
                        control={control}
                        disabled={disabledForm}
                        // defaultValue={titeText}
                        fullWidth
                        value={titeText}
                        onChange={(value) => {
                           changeTitle(value.currentTarget.value)
                        }}
                        id="outlined-textarea"
                        label="Название"
                        multiline />
                     <TextField
                        {...register('task', { minLength: 2, maxLength: 1000 })}
                        disabled={disabledForm}
                        // defaultValue={taskText}
                        fullWidth
                        value={taskText}
                        onChange={(value) => {
                           changeTask(value.currentTarget.value)
                        }}
                        id="outlined-textarea"
                        label="Описание задачи"
                        multiline
                        rows={4}
                     />

                     <div style={{ display: 'flex', gap: '10px' }}>
                        <Controller
                           name="startDate"
                           control={control}
                           rules={{}}

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
                                 renderInput={(params) => <TextField {...params} className={s.calendar} fullWidth />}
                              />
                           </LocalizationProvider>}
                        />
                        <Controller
                           name="endDate"
                           control={control}
                           rules={{}}
                           render={({ field }) => <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                 disabled={disabledForm}
                                 p='2'
                                 label="Дата завершения"
                                 value={valueDateEnd}
                                 onChange={(newValue) => {
                                    if (newValue < startDate) {
                                       setError('endDate1', { type: 'errorDate', message: 'custom message' });
                                    } else {
                                       clearErrors('endDate1')
                                    }
                                    setValueDateEnd(newValue)
                                    field.onChange(newValue)
                                 }}
                                 renderInput={(params) => <TextField {...params} className={s.calendar} fullWidth />}
                              />
                           </LocalizationProvider>}
                        />
                     </div>
                  </div>
                  <div className={s.editBlock}>
                     <FormControl sx={styleSelects} size="small" fullWidth>
                        <InputLabel id="demo-select-small">Статус</InputLabel>
                        <NativeSelect
                           {...register('status')}
                           defaultValue={defaultValues.status}
                        >
                           <option value={'New'}>Новая</option>
                           <option value={'In work'}>В работе</option>
                           <option value={'Completed'}>Завершено</option>
                           <option value={'Canceled'}>Отменено</option>
                        </NativeSelect>
                     </FormControl>
                     <FormControl sx={styleSelects} size="small" fullWidth>
                        <InputLabel id="demo-select-small">Приоритет</InputLabel>
                        <NativeSelect
                           {...register('priority')}
                           defaultValue={defaultValues.priority}
                        >
                           <option value={'high'}>Высокий</option>
                           <option value={'medium'}>Средний</option>
                           <option value={'low'}>Низкий</option>
                        </NativeSelect>
                     </FormControl>




                     <Controller
                        name="endDateFact"
                        control={control}
                        render={({ field }) => <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DatePicker
                              disabled={disabledForm}
                              p='2'
                              label="Фактическая дата завершения"
                              value={valueDateEndFact}
                              onChange={(newValue) => {
                                 setValueDateEndFact(newValue)
                                 field.onChange(newValue)
                              }}
                              renderInput={(params) => <TextField {...params} className={s.calendar} fullWidth />}
                           />
                        </LocalizationProvider>}
                     />
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
