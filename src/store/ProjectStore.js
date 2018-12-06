import { observable, computed, action } from 'mobx'
import { db } from '~/services/firebase'
import { loaderService } from '~/services/loaderService'

class ProjectStore {
  @observable
  _projects = []

  @computed
  get getProjects() {
    return this._projects
  }
  @action
  setProjects() {
    loaderService.show('global')
    let projects = []
    db.getProjectsAPI()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          projects = [...projects, { id: doc.id, ...doc.data() }]
        })
      })
      .then(() => {
        loaderService.hide('global')
        this._projects = projects
      })
      .catch(err => !console.error(err) && loaderService.hide('global'))
  }

  @action
  addProject = project => {
    this._projects.push(project)
  }

  @action
  deleteProject = projectId => {
    return db
      .deleteProjectAPI(projectId)
      .then(() => {
        this._projects = this._projects.filter(p => p.id !== projectId)
      })
      .catch(err => console.log(err))
  }
}

export const projectStore = new ProjectStore()
