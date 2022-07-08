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
        items[a?.meta?.id] = a
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
  realtimeUpdate(uid, type, date, fieldId, text) {
    debugger
    set(ref(db, `plans/${uid}/${type}/${date}/${fieldId}`), text)
  },
}
