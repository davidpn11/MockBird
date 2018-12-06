//@flow
import type { Project } from '../../utils/types'
import { userRef } from './index'

export function getProjectsAPI() {
  return userRef && userRef.get()
}

export function getProjectAPI(id: string): Promise<void> {
  return id && userRef
    ? userRef
        .doc(id)
        .get()
        .then((doc: Object) => {
          if (doc.exists) {
            return doc.data()
          } else {
            throw new Error('No document')
          }
        })
    : new Promise((resolve: Function, reject: Function) =>
        reject(new Error('id undefined'))
      )
}

export function deleteProjectAPI(id: string): Promise<void> {
  return id && userRef
    ? userRef.doc(id).delete()
    : new Promise((resolve: Function, reject: Function) =>
        reject(new Error('id undefined'))
      )
}

export function addProjectAPI(project: Project) {
  if (!project.name || !project.templateId) return new Error()
  project = { ...project, createdAt: Date.now() }
  return userRef && userRef.add(project)
}
