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
import Autocomplete from '@mui/material/Autocomplete';
import { getd } from '../../Redux/goals-reducer'



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

   // const goals = useSelector((state) => state.goalsSlice.goals)
   const addStatusMessage = useSelector((state) => state.tasksSlice.addStatusMessage)
   const uid = useSelector((state) => state.registerSlice.profile)
   const addStatus = useSelector((state) => state.tasksSlice.addStatus)
   const tasks = useSelector((state) => state.tasksSlice.tasks)


   const [titeText, changeTitle] = useState('')
   const [taskText, changeTask] = useState('')
   const [disabledForm, disabledChange] = useState(false)
   const [valueDateStart, setValueDateStart] = useState(null)
   const [valueDateEnd, setValueDateEnd] = useState(null)
   const [valueDateEndFact, setValueDateEndFact] = useState(null)
   const [status, setStatus] = useState('');
   const [priority, setPriority] = useState('');
   const [goalName, setGoalName] = useState(null);
   const [goalsNameSearch, setGoalNameSearch] = useState('');

   const indexItem = props.indexItem


   console.log(props.goals)
   useEffect(() => {
      if (indexItem !== '') {
         let start = tasks[indexItem].startDate
         let end = tasks[indexItem].endDate
         let fact = tasks[indexItem].endDateFact
         changeTask(tasks[indexItem].task)
         changeTitle(tasks[indexItem].title)
         setStatus(tasks[indexItem].status)
         setPriority(tasks[indexItem].priority)
         setValueDateStart(start ? start : null)
         setValueDateEnd(end ? end : null)
         setValueDateEndFact(fact ? fact : null)
      } else {
         changeTask(null)
         changeTitle(null)
         setStatus(null)
         setPriority(null)
         setValueDateStart(null)
         setValueDateEnd(null)
         setValueDateEndFact(null)
      }
   }, [indexItem])
   useEffect(() => {
      console.log(props.open)
      // dispatch(getGoals(uid))
      if (indexItem && tasks[indexItem].goal) {
         setGoalName(tasks[indexItem].goal)
      } else {
         setGoalName('')
      }
      const arr = []
      if (props.goals) {
         Object.keys(props.goals).map(key => {
            arr.push({ label: props.goals[key].title, id: key })
         })
      }
      console.log(props.goals)
      console.log(arr)
      setGoalNameSearch(arr)
   }, [indexItem, props.goals])

   useEffect(() => {
      // dispatch(getd(uid))
   }, [])

   const { register, watch, handleSubmit, formState: { errors }, control, reset, setError, clearErrors } = useForm({

      mode: 'onSubmit',
      reValidateMode: 'onChange',
      resolver: undefined,
      context: undefined,
      criteriaMode: "firstError",
      shouldFocusError: true,
      shouldUnregister: false,
      shouldUseNativeValidation: false,
      delayError: undefined
   })



   const onSubmit = (data) => {
      data = {
         title: titeText,
         task: taskText,
         startDate: valueDateStart,
         endDate: valueDateEnd,
         status: status,
         priority: priority,
         endDateFact: valueDateEndFact,
         goal: goalName,
      }

      let newObj = {}
      let newData = Object.keys(data).map(m => data[m] ? newObj[m] = data[m] : '')

      let taskId = nanoid(10)
      if (indexItem !== '') {
         newObj.number = tasks[indexItem].number
      } else {
         newObj.number = size(tasks) + 1
      }
      const arrData = [uid.id, newObj, taskId]
      const arrData2 = [uid.id, newObj, indexItem]
      if (indexItem !== '') {
         dispatch(addTask(arrData2))
      } else {
         dispatch(addTask(arrData))
      }
      props.changeIndex('')
      changeTask('')
      changeTitle('')
      setStatus('New')
      setPriority('high')
      setValueDateStart(null)
      setValueDateEnd(null)
      setValueDateEndFact(null)
      reset()
   }


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
                     <Autocomplete
                        onChange={(e, value) => {
                           setGoalName(value.label)
                        }}
                        value={goalName}
                        inputValue={goalName}
                        onInputChange={(event, newInputValue) => {
                           setGoalName(newInputValue)
                        }}
                        disablePortal
                        id="combo-box-demo"
                        options={goalsNameSearch}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...register('goal')} {...params} label="Ціль (не обов'язково)" />}
                     />
                     <TextField
                        {...register('title', { minLength: 2, maxLength: 80 })}
                        control={control}
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


                                 p='4'
                                 label="Дата начала"
                                 value={valueDateStart}
                                 onChange={(newValue) => {
                                    if (newValue > valueDateEnd && valueDateEnd > 0) {
                                       setError('startDateError', { type: 'errorDate', message: 'custom message' });
                                    } else {
                                       clearErrors('startDateError')
                                    }
                                    let data = Date.parse(newValue)
                                    setValueDateStart(data)
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
                                 p='2'
                                 label="Дата завершения"
                                 value={valueDateEnd}
                                 onChange={(newValue) => {
                                    if (newValue < valueDateStart) {
                                       setError('endDate1', { type: 'errorDate', message: 'custom message' });
                                    } else {
                                       clearErrors('endDate1')
                                    }
                                    let data = Date.parse(newValue)
                                    setValueDateEnd(data)
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
                           value={status}
                           onChange={(value) => {
                              setStatus(value.currentTarget.value)
                           }}
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
                           value={priority}
                           onChange={(value) => {
                              setPriority(value.currentTarget.value)
                           }}
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

                              p='2'
                              label="Фактическая дата завершения"
                              value={valueDateEndFact}
                              onChange={(newValue) => {
                                 let data = Date.parse(newValue)
                                 setValueDateEndFact(data)
                                 field.onChange(newValue)
                              }}
                              renderInput={(params) => <TextField {...params} className={s.calendar} fullWidth />}
                           />
                        </LocalizationProvider>}
                     />
                  </div>


                  <div>
                     <Button variant="contained" type='submit' >Сохранить</Button>
                  </div>
               </form>

            </Box>
         </Modal>
      </div>
   )
}
