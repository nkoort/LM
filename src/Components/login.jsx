import s from '../SCSS/statePage.module.scss';


import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { useForm, Controller } from "react-hook-form"

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'


import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { authAPI } from '../FIREBASE/api';




const LoginModal = (props) => {
   const loadingStatus = useSelector((state) => state.registerSlice.loadingStatus)
   const dispatch = useDispatch();

   const handleClose = () => props.changeOpen();


   const { register, handleSubmit, formState: { errors } } = useForm();
   const onSubmit = data => {
      authAPI.logIN(data.email, data.password)
   };
   return (
      <>
         <Modal
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}>
            <Box className={s.modal} p={4}>
               <Typography variant="h4" component="div" mb={2}>Авторизация пользователя</Typography>
               <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
                  <TextField
                     sx={{ width: '70ch' }}
                     className={s.inputs}
                     id="outlined-basic"
                     label="Почта"
                     variant="outlined"
                     type='email'
                     color="success"
                     {...register("email", { required: true, minLength: 2, maxLength: 99 })}
                  />
                  <TextField
                     sx={{ width: '70ch' }}
                     className={s.inputs}
                     id="outlined-basic"
                     label="Почта"
                     variant="outlined"
                     type='password'
                     color="success"
                     {...register("password", { required: true, minLength: 2, maxLength: 99 })}
                  />
                  <Button type="submit" variant="contained" color="success">Далее</Button>
               </form>
            </Box>
         </Modal>
      </>

   )
}


export default LoginModal;
