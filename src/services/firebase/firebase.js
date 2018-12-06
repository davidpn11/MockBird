import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { config } from './config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const database = firebase.firestore()
const settings = { timestampsInSnapshots: true }
database.settings(settings)
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { database, auth, provider }
