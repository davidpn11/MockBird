//@flow
import type { Screen, Project } from '../../utils/types'
import { userRef } from './index'
export let projectRef = null
export let screenRef = null
export let inputRef = null

export function setProjectRef(projectId: string): Promise<any> {
  return new Promise((resolve: Function, reject: Function) => {
    if (userRef) {
      userRef
        .doc(projectId)
        .get()
        .then((doc: Object) => {
          if (doc.exists) {
            projectRef = doc.ref
            resolve(doc.data())
          }
        })
        .catch(err => reject(err))
    } else {
      reject(new Error('no project or userRef'))
    }
  })
}

export function updateProjectAPI(project: Project) {
  return new Promise((resolve: Function, reject: Function) => {
    if (projectRef) {
      projectRef
        .set(project)
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      reject(new Error('no project ref'))
    }
  })
}

export function getScreenInputsAPI(screenId: string) {
  screenRef =
    projectRef && screenId && projectRef.collection('screens').doc(screenId)
  return (
    screenRef &&
    screenRef
      .collection('screenInputs')
      .orderBy('position')
      .get()
  )
}

export function getProjectScreensAPI() {
  return projectRef && projectRef.collection('screens').get()
}

export function updateScreenAPI(id: string, screen: Screen) {
  return (
    projectRef &&
    projectRef
      .collection('screens')
      .doc(id)
      .set(screen)
  )
}

export function updateScreenSubmitAPI(submitText: string) {
  return screenRef && screenRef.update({ submitText })
}

export function addScreenAPI(nameFactor: number): Promise<any> {
  const screen = {
    name: nameFactor ? `New Screen (${nameFactor})` : 'New Screen',
    isFinal: true,
    size: 'full',
    maxWeight: 5,
    submitText: 'Submit',
    createdAt: Date.now(),
  }
  return new Promise((resolve: Function, reject: Function) => {
    if (projectRef) {
      projectRef
        .collection('screens')
        .add(screen)
        .then(docRef => {
          const newScreen = { ...screen, id: docRef.id }
          resolve(newScreen)
        })
        .catch(err => reject(err))
    } else {
      reject(new Error('no project reference'))
    }
  })
}

export function deleteScreenAPI(screenId: string): Promise<any> {
  if (projectRef) {
    return projectRef
      .collection('screens')
      .doc(screenId)
      .delete()
  } else {
    return new Promise((resolve: Function, reject: Function) => {
      reject(new Error('no project reference'))
    })
  }
}

export function addInputAPI(screenId: string, input: any) {
  return new Promise((resolve: Function, reject: Function) => {
    if (projectRef) {
      projectRef
        .collection('screens')
        .doc(screenId)
        .collection('screenInputs')
        .add(input)
        .then(docRef => {
          const newInput = { ...input, id: docRef.id }
          resolve(newInput)
        })
        .catch(err => reject(err))
    } else {
      reject(new Error('no project reference'))
    }
  })
}

export function deleteInputAPI(screenId: string, inputId: string) {
  if (projectRef) {
    return projectRef
      .collection('screens')
      .doc(screenId)
      .collection('screenInputs')
      .doc(inputId)
      .delete()
  } else {
    return new Promise((resolve: Function, reject: Function) => {
      reject(new Error('no project reference'))
    })
  }
}

export function updateInputAPI(newInput: Object) {
  return new Promise((resolve: Function, reject: Function) => {
    if (!newInput.id) {
      reject(new Error('noId'))
    }
    if (screenRef) {
      screenRef
        .collection('screenInputs')
        .doc(newInput.id)
        .set(newInput)
    } else {
      reject(new Error('no project reference'))
    }
  })
}
