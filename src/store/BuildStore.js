import { observable, computed, action, toJS } from 'mobx'
import { db } from '~/services/firebase'

class BuildStore {
  @observable
  _projectId = ''
  @observable
  _currentBuild = ''

  @computed
  get currentBuild() {
    return this._currentBuild || {}
  }

  @action
  initialize(projectId) {
    this._projectId = projectId
    this._currentBuild = {}
    if (!projectId) {
      console.error('project id is required')
      return
    }
    db.getCurrentBuildAPI(projectId)
      .then(build => {
        this._currentBuild = {
          ...build,
          modifiedAt: new Date(build.modifiedAt).toLocaleDateString(),
        }
        console.log({ build: toJS(this._currentBuild) })
      })
      .catch(err => console.error(err))
  }

  @action
  setBuild(build) {
    this._currentBuild = build
  }

  @action
  async makeBuild(build) {
    db.setCurrentBuildAPI(this._projectId, build)
      .then(build => {
        this._currentBuild = build
      })
      .catch(err => console.error(err))
  }
}

export const buildStore = new BuildStore()
