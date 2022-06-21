import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'

import { getStorage, ref, uploadBytes } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDRrYxJB50ropBvUh0y7kxl31FbCMSwWzY',
  authDomain: 'lifemanager-59bee.firebaseapp.com',
  projectId: 'lifemanager-59bee',
  storageBucket: 'lifemanager-59bee.appspot.com',
  messagingSenderId: '297848949164',
  appId: '1:297848949164:web:2cbe0a3658204f62645209',
  measurementId: 'G-FEY9JNWZ3J',
}
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)
const storage = getStorage(app)
/////////////////// NEXT ROWS WITH USER API CODE ///////////////////

/////////////////////////////////////////////////////////////////////////////
//                   API AUTHENTICATION                                    //
/////////////////////////////////////////////////////////////////////////////
export const authAPI = {
  async authMe() {
    const auth = getAuth()
    return auth
  },
  async register(email, password, fullData) {
    const auth = getAuth()
    let res = await createUserWithEmailAndPassword(auth, email, password)
    debugger
    const ref = doc(db, 'tasks', res.user.uid)
    await setDoc(ref, { new: { startValue: 'value' } })
    return res
  },
  async setProfile(profile, id) {
    await setDoc(doc(db, 'users', id), profile)
  },
  logIN(email, password) {
    const auth = getAuth()
    let res = signInWithEmailAndPassword(auth, email, password)
    return res
  },
  async logOUT() {
    const auth = getAuth()
    let res = await signOut(auth)
    return res
  },
}

export const profileAPI = {
  async getProfile(id) {
    const ref = doc(db, 'users', id)
    const docSnap = await getDoc(ref)
    let profile = docSnap.data()
    return profile
  },
  async uploadPhoto(id, file) {
    //  const storage = getStorage()
    const storageRef = ref(storage, id)
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!')
      console.log(snapshot)
    })
  },
}

/////////////////////////////////////////////////////////////////////////////
//                   TASKS API                                             //
/////////////////////////////////////////////////////////////////////////////

export const tasksAPI = {
  async addTask(id, data, taskId) {
    const ref = doc(db, 'tasks', id)
    data.taskId = taskId
    //  if (index) {
    //    await updateDoc(ref, {[tasks[index]: ]})
    //  } else {
    await updateDoc(ref, {
      [`tasks.${taskId}`]: data,
    })
    //  }

    //
  },
  async getTasks(id) {
    const ref = doc(db, 'tasks', id)
    const docSnap = await getDoc(ref)
    return docSnap.data()
  },
}
