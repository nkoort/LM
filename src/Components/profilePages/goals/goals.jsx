import s from '../../../SCSS/goals.module.scss'


import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderBy, size } from 'lodash';

import Button from '@mui/material/Button'



import GoalsModal from './goalsModal'
import { getGoals } from '../../../Redux/goals-reducer'
import GoalItem from './goalItem'


const GoalsPage = (props) => {
   //Базові виклики різних функций та інше.
   const dispatch = useDispatch()


   const [goalsArr, changeArr] = useState([])
   //Блок з селекторами
   const goals = useSelector((state) => state.goalsSlice.goals.goals)
   const uid = useSelector((state) => state.registerSlice.profile.id)


   // Глобальні ефекти та інші хуки
   useEffect(() => {

      dispatch(getGoals(uid))
      let newArr = []
      Object.keys(goals).map(key => { newArr.push(goals[key]) })
      changeArr(newArr)
   }, [size(goals)])

   let orderObj = orderBy(goalsArr, ['createData'], ['asc'])

   console.log('render')
   const [open, setOpen] = useState(true)
   const modalControl = () => open ? setOpen(false) : setOpen(true)



   return (
      <div>
         <div>Other</div>
         <div>

            <Button onClick={modalControl}>Open modal</Button>
            <GoalsModal modalControl={modalControl} open={open} />
            {size(goals) > 0 && <GoalItem goals={orderObj} uid={uid} />}
         </div>
      </div >
   )
}




export default GoalsPage