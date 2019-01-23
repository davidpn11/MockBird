//@flow
import { database } from '../firebase'
import type { User } from '../../utils/types'

export * from './projectDetails'
export * from './project'
export * from './build'
export * from './templates'
export let userRef = null

export function setUserAPI(userData: User) {
  database
    .collection('/users')
    .doc(userData.uid)
    .set(userData)
    .then(result => {
      setUserRef(userData.uid)
    })
}

export function setUserRef(userId: string) {
  userRef = database
    .collection(`data`)
    .doc(userId)
    .collection('projects')
}

export function getInputOptionsAPI() {
  return database.collection('inputs').get()
}

export function getInputOptionCollectionAPI(
  inputId: string,
  collection: string
) {
  return database
    .collection('inputs')
    .doc(inputId)
    .collection(collection)
    .get()
    .then(result => {
      let options = []
      result.forEach(doc => {
        options = [...options, doc.data()]
      })
      return options
    })
    .catch(err => new Error(err))
}
