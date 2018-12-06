//@flow
import { database } from '../firebase'
import type { Build } from '../../utils/types'

export function getCurrentBuildAPI(projectId: string = '123') {
  // console.log(userRef, projectRef)
  return new Promise((resolve: Function, reject: Function) => {
    database
      .collection('/builds')
      .doc(projectId)
      .get()
      .then((doc: Object) => {
        if (doc.exists) {
          resolve(doc.data())
        }
      })
      .catch(err => reject(err))
  })
}

export function setCurrentBuildAPI(projectId: string, build: Build) {
  build = {
    ...build,
    modifiedAt: Date.now(),
  }
  return database
    .collection('/builds')
    .doc(projectId)
    .set(build)
}
