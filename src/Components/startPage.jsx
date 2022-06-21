import s from '../SCSS/statePage.module.scss';


import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { isEmpty } from 'lodash';


import Button from '@mui/material/Button';
import StartModal from './startModal';
import LoginModal from './login';

const StartPage = (props) => {
   const profile = useSelector((state) => state.registerSlice.profile)
   const profileStatus = useSelector((state) => state.registerSlice.profileStatus)
   const [openModal, changeOpen] = useState(false);
   const handleOpen = () => openModal ? changeOpen(true) : changeOpen(true);
   const [openLogin, changeOpenLogin] = useState(false);

   if (profileStatus) {
      return <Navigate to='/profile/user' />
   }
   return (
      <div className={s.wrapperPage}>
         <div className={s.login} onClick={() => changeOpenLogin(true)}>
            <Button className={s.buttonLogOut} variant="contained">Авторизация</Button>
         </div>
         <div className={s.start}>
            <div className={s.titleBlock}>
               <div className={s.title}>Добро пожаловать в Life Manager</div>
               <div className={s.desc}>Он поможет упростить контроль над твоими задачами, бюджетом и другими составляющими твоей жизни.</div>
            </div>
            <div className={s.buttonBlock}>
               <Button variant="contained" className={s.buttonCustom} onClick={handleOpen}>Начать</Button>
               <StartModal open={openModal} changeOpen={changeOpen} />
               <LoginModal open={openLogin} changeOpen={changeOpenLogin} />
            </div>
         </div>
      </div>
   )
}


export default StartPage;
