import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  query,
  orderByChild,
  orderByValue,
  orderByKey,
  limitToFirst,
  startAt,
  remove,
} from 'firebase/database'

import { nanoid } from '@reduxjs/toolkit'
import { app } from './api'
import { setPlan } from '../Redux/budget-reducer'

// const firebaseConfig = {
//   apiKey: 'AIzaSyDRrYxJB50ropBvUh0y7kxl31FbCMSwWzY',
//   authDomain: 'lifemanager-59bee.firebaseapp.com',
//   projectId: 'lifemanager-59bee',
//   storageBucket: 'lifemanager-59bee.appspot.com',
//   messagingSenderId: '297848949164',
//   appId: '1:297848949164:web:2cbe0a3658204f62645209',
//   measurementId: 'G-FEY9JNWZ3J',
//   databseURL:
//     'https://lifemanager-59bee-default-rtdb.europe-west1.firebasedatabase.app',
// }
// const app = initializeApp(firebaseConfig)

const analytics = getAnalytics(app)
const db = getDatabase(app)

const { v4: uuidv4 } = require('uuid')
/////////////////// NEXT ROWS WITH USER API CODE ///////////////////

/////////////////////////////////////////////////////////////////////////////
//                   BUDGET API                                             //
/////////////////////////////////////////////////////////////////////////////

export const budgetAPI = {
  async addField(uid, type, date, data) {
    set(ref(db, `plans/${uid}/${type}/${date}`), data)
  },
  async getDocs(uid, type, date, dispatch) {
    const refD = query(
      ref(db, `plans/${uid}/${type}/${date}`),
      orderByChild('meta/createDate'),
    )
    get(refD).then((snap) => {
      const a = snap.val()
      const items = {}
      snap.forEach(function (child) {
        const a = child.val()
        items[a.meta.id] = a
        //   items[a.meta.id].meta.period = date
      })
      if (a) {
        dispatch(setPlan(items))
      } else {
        dispatch(setPlan([]))
      }
    })
  },
  async deleteField(uid, type, date, field) {
    remove(ref(db, `plans/${uid}/${type}/${date}/${field}`))
  },
}
