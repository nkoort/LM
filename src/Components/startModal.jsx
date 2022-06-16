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
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { registerUser } from '../Redux/login-reducer';


const StartModal = (props) => {
   const loadingStatus = useSelector((state) => state.registerSlice.loadingStatus)
   const dispatch = useDispatch();



   const userRegister = (data) => {
      dispatch(registerUser(data))
   };

   const handleClose = () => props.changeOpen();
   const [valueDate, setValueDate] = useState(null);

   const [values, setValues] = useState({
      password: '',
      showPassword: false,
   });
   const handleClickShowPassword = () => {
      setValues({
         ...values,
         showPassword: !values.showPassword,
      });
   };
   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };
   const handleChange = (prop) => (event) => {
      setValues({ ...values, [prop]: event.target.value });
   };


   const formSchema = Yup.object().shape({
      password: Yup.string()
         .required('Password is mendatory')
         .min(3, 'Password must be at 3 char long'),
      passRepeat: Yup.string()
         .required('Password is mendatory')
         .oneOf([Yup.ref('password')], 'Passwords does not match'),
   })
   const formOptions = { resolver: yupResolver(formSchema) }




   const { register, handleSubmit, watch, formState: { errors }, control } = useForm(formOptions);
   const onSubmit = data => {
      userRegister(data)
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
               <Typography variant="h4" component="div" mb={2}>Расскажите о себе</Typography>
               <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
                  <TextField
                     sx={{ width: '70ch' }}
                     className={s.inputs}
                     id="outlined-basic"
                     label="Ваше Имя"
                     variant="outlined"
                     color="success"
                     {...register("userName", { required: true, minLength: 2, maxLength: 99 })}
                  />
                  {errors.userName && <span className={s.errorText}>Минимальная длинна имени 2 символа!</span>}
                  <TextField
                     {...register("userNumber")}
                     sx={{ width: '70ch' }}
                     id="outlined-number"
                     label="Номер телефона"
                     type="number"
                     color="success"
                     p='4'
                     InputLabelProps={{
                        shrink: true,
                     }}
                  />
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
                  <div className={s.passBlockContainter}>
                     <div className={s.passBlock}>
                        <FormControl sx={{ width: '34ch' }} variant="outlined">
                           <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                           <OutlinedInput
                              id="outlined-adornment-password"
                              type={values.showPassword ? 'text' : 'password'}
                              value={values.password}
                              {...register("password")}
                              onChange={handleChange('password')}
                              endAdornment={
                                 <InputAdornment position="end">
                                    <IconButton
                                       aria-label="toggle password visibility"
                                       onClick={handleClickShowPassword}
                                       onMouseDown={handleMouseDownPassword}
                                       edge="end"
                                    >
                                       {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                 </InputAdornment>
                              }
                              label="Пароль"
                           />
                        </FormControl>
                        <TextField
                           {...register("passRepeat")}
                           sx={{ width: '34ch' }}
                           className={s.inputs}
                           id="outlined-basic"
                           label="Пароль повторно"
                           variant="outlined"
                           color="success"
                           type='password'
                        />
                     </div>
                     {watch('password') !== watch('passRepeat') && <div className={s.errorText}>Пароли не совпадают</div>}
                  </div>

                  <Controller
                     name="birthDay"
                     control={control}
                     rules={{ required: true }}
                     render={({ field }) => <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                           p='4'
                           label="Дата вашего рождения"
                           value={valueDate}
                           onChange={(newValue) => {
                              setValueDate(newValue)
                              let d = new Date(newValue);
                              let year = d.getFullYear(newValue)
                              let month = d.getMonth(newValue) + 1 <= 9 ? '0' + String(d.getMonth(newValue) + 1) : d.getMonth(newValue) + 1
                              let day = d.getDate(newValue) <= 9 ? '0' + String(d.getDate(newValue)) : d.getDate(newValue)
                              field.onChange(`${day}.${month}.${year}`)
                           }}
                           renderInput={(params) => <TextField {...params} color="success" sx={{ width: '70ch' }} />}
                        />
                     </LocalizationProvider>}
                  />
                  {errors.date && <span className={s.errorText}>Нужно указать дату</span>}
                  <Button type="submit" variant="contained" color="success">Далее</Button>
                  {loadingStatus && <div>Регистрация прошла успешно. Поздравляем!</div>}
               </form>
            </Box>
         </Modal>
      </>

   )
}


export default StartModal;
