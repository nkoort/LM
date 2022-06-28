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
  serverTimestamp,
  arrayUnion,
  collection,
  getDocs,
} from 'firebase/firestore'

import {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage'

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

    const ref = doc(db, 'tasks', res.user.uid)
    await setDoc(ref, { new: { startValue: 'value' } })
    return res
  },
  async setProfile(profile, id) {
    await setDoc(doc(db, 'users', id), profile)
  },
  async upProfile(data, id) {
    const ref = doc(db, 'users', id)

    await updateDoc(ref, data)
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
    const storageRef = ref(storage, `avatars/${id}`)
    let a = uploadBytes(storageRef, file).then((snapshot) => {
      let b = getDownloadURL(storageRef).then((url) => {
        return url
      })
      return b
    })
    return a
  },
}

/////////////////////////////////////////////////////////////////////////////
//                   TASKS API                                             //
/////////////////////////////////////////////////////////////////////////////

export const tasksAPI = {
  async addTask(id, data, taskId) {
    const ref = doc(db, 'tasks', id)
    data.taskId = taskId
    await updateDoc(ref, {
      [`tasks.${taskId}`]: data,
    })
  },
  async getTasks(id) {
    const ref = doc(db, 'tasks', id)
    const docSnap = await getDoc(ref)
    return docSnap.data()
  },
}

/////////////////////////////////////////////////////////////////////////////
//                   GOALS API                                             //
/////////////////////////////////////////////////////////////////////////////

export const goalsAPI = {
  async getGategorys() {
    const ref = doc(db, 'directory', 'categories')
    const docSnap = await getDoc(ref)
    return docSnap.data()
  },
  async getStatus() {
    const ref = doc(db, 'directory', 'status')
    const docSnap = await getDoc(ref)
    return docSnap.data()
  },
  async addGoal(id, data, goalId) {
    const ref = doc(db, 'goals', id)
    data.id = goalId
    try {
      let res = await updateDoc(ref, {
        [`goals.${goalId}`]: data,
      })
      return res
    } catch (e) {
      await setDoc(doc(db, 'goals', id), {
        goals: { [goalId]: data },
      })
    }
  },
  async getGoals(id) {
    const ref = doc(db, 'goals', id)
    const docSnap = await getDoc(ref)
    return docSnap.data()
  },
}

/////////////////////////////////////////////////////////////////////////////
//                   USERS API                                             //
/////////////////////////////////////////////////////////////////////////////

export const usersAPI = {
  async getUsers() {
    const ref = await getDocs(collection(db, 'users'))
    const users = []
    ref.forEach((doc) => {
      users.push(doc.data())
    })
    return users
  },
  async getUser(id) {
    const ref = doc(db, 'users', id)
    const docSnap = await getDoc(ref)
    return docSnap.data()
  },
}
