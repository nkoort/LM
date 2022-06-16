import s from '../../SCSS/tasksPage.module.scss'

import { useState } from 'react'
import { useForm, Controller } from "react-hook-form"



import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask } from '../../Redux/tasks-reducer'



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
   const { register, handleSubmit, formState: { errors }, control, reset } = useForm()


   const [disabledForm, disabledChange] = useState(false)
   const [valueDateStart, setValueDateStart] = useState(null)
   const [valueDateEnd, setValueDateEnd] = useState(null)

   console.log(addStatus)
   useEffect(() => {
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1 <= 9 ? '0' + String(d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() <= 9 ? '0' + String(d.getDate()) : d.getDate()
      setValueDateStart(`${day}.${month}.${year}`)
      if (addStatus === true) {
         disabledChange(false)
      }
   }, [addStatus])

   const onSubmit = (data) => {
      const arrData = [uid.id, data]
      dispatch(addTask(arrData))
      disabledChange(true)

      setValueDateEnd(null)
      setValueDateStart(null)
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
                     <TextField
                        {...register("title")}
                        disabled={disabledForm}
                        fullWidth
                        id="outlined-textarea"
                        label="Название"
                        multiline
                     />
                     <TextField
                        {...register("task")}
                        disabled={disabledForm}
                        fullWidth
                        id="outlined-textarea"
                        label="Описание задачи"
                        multiline
                        rows={4}
                     />
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <Controller
                           name="startDate"
                           control={control}
                           rules={{ required: true }}
                           render={({ field }) => <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                 disabled={disabledForm}
                                 p='4'
                                 label="Дата начала"
                                 value={valueDateStart}
                                 onChange={(newValue) => {
                                    setValueDateStart(newValue)
                                    let d = new Date(newValue)
                                    let year = d.getFullYear(newValue)
                                    let month = d.getMonth(newValue) + 1 <= 9 ? '0' + String(d.getMonth(newValue) + 1) : d.getMonth(newValue) + 1
                                    let day = d.getDate(newValue) <= 9 ? '0' + String(d.getDate(newValue)) : d.getDate(newValue)
                                    field.onChange(`${day}.${month}.${year}`)
                                 }}
                                 renderInput={(params) => <TextField {...params} />}
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
                                    let d = new Date(newValue)
                                    let year = d.getFullYear(newValue)
                                    let month = d.getMonth(newValue) + 1 <= 9 ? '0' + String(d.getMonth(newValue) + 1) : d.getMonth(newValue) + 1
                                    let day = d.getDate(newValue) <= 9 ? '0' + String(d.getDate(newValue)) : d.getDate(newValue)
                                    field.onChange(`${day}.${month}.${year}`)
                                 }}
                                 renderInput={(params) => <TextField {...params} />}
                              />
                           </LocalizationProvider>}
                        />
                     </div>

                     <div>
                        <Button variant="contained" type='submit' disabled={disabledForm}>Сохранить</Button>
                     </div>
                  </div>


               </form>

            </Box>
         </Modal>
      </div>
   )
}
