import { observable, computed, action, toJS } from 'mobx'
import { db } from '~/services/firebase'
import throttle from 'lodash/throttle'
const updateScreenThrottle = throttle(db.updateScreenAPI, 1000)
const updateScreenSubmitThrottle = throttle(db.updateScreenSubmitAPI, 1000)
const updateInputThrottle = throttle(db.updateInputAPI, 1000)

class ProjectDetailStore {
  @observable
  _inputOptions = {}
  @observable
  _project = {}
  @observable
  _currScreen = ''
  @observable
  _currScreenInput = ''

  constructor() {
    this.fetchInputOptions()
  }

  /* @computed for currScreenInput */

  @computed
  get currScreenInput() {
    return (
      this.currScreen &&
      this.currScreen.screenInputs &&
      this.currScreen.screenInputs.find(
        screenInput => screenInput.id === this._currScreenInput
      )
    )
  }

  @computed
  get inputOptions() {
    return this._inputOptions
  }
  @computed
  get project() {
    return this._project
  }

  @computed
  get templateId() {
    return this._project ? this._project.templateId : ''
  }

  @computed
  get currScreen() {
    return this._project.screens
      ? this._project.screens.find(screen => screen.id === this._currScreen)
      : {}
  }
  @computed
  get screenInputs() {
    return this.currScreen ? this.currScreen.screenInputs : []
  }

  set screenInputs(newInput) {
    this.currScreen.screenInputs = newInput
  }

  @computed
  get screenName() {
    return this.currScreen ? this.currScreen.name : ''
  }
  @computed
  get screens() {
    return this.project.screens || []
  }

  get deepScreens() {
    return this.project.screens ? toJS(this.project.screens) : []
  }

  @action
  addInputOptions(key, data) {
    this._inputOptions = { ...this._inputOptions, [key]: { ...data } }
  }

  async fetchInputOptions() {
    try {
      const result = await db.getInputOptionsAPI()
      result &&
        result.forEach(doc => {
          let data = doc.data()
          if (data.collections) {
            data.collections.forEach(async col => {
              const collection = await db.getInputOptionCollectionAPI(
                doc.id,
                col
              )
              data = [...data, { [col]: collection }]
            })
          }
          const { collections, ...dataRest } = data
          this.addInputOptions(data.metadata.type, dataRest)
        })
    } catch (error) {
      console.error(error)
    }
  }
  @action
  async setProject(id) {
    try {
      this._project = {}
      let proj = await db.setProjectRef(id)
      proj = { ...proj, id: id }
      const screens = await db.getProjectScreensAPI()
      proj.screens = []
      screens &&
        screens.forEach(doc => {
          proj.screens = [...proj.screens, { ...doc.data(), id: doc.id }]
        })
      this._project = proj
      this.setCurrentScreen()
    } catch (error) {
      console.error(error)
    }
  }

  @action
  async updateProject(newProject) {
    try {
      await db.updateProjectAPI(newProject)
      this._project = newProject
    } catch (err) {
      console.error(err)
      return false
    }
  }

  @action
  async setCurrentScreen(id = '') {
    if (!id && this.project.screens.length > 0) {
      this._currScreen = this.project.screens[0].id
    } else {
      this._currScreen = id
    }
    await this.setScreenInputs(this._currScreen)
  }

  async setAllScreenInputs() {
    const promises = this.screens.map(screen => this.setScreenInputs(screen.id))
    await Promise.all(promises)
  }

  async setScreenInputs(screenId) {
    try {
      const result = await db.getScreenInputsAPI(screenId)
      let inputs = []
      result &&
        result.forEach(doc => {
          inputs = [...inputs, { id: doc.id, ...doc.data() }]
        })
      this.project.screens.forEach(screen => {
        if (screen.id === screenId) {
          screen.screenInputs = inputs
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  @action
  addScreen() {
    db.addScreenAPI()
      .then(screen => {
        this._project.screens = [...this._project.screens, screen]
      })
      .catch(error => {
        console.error('Error adding document: ', error)
      })
  }

  @action
  async deleteScreen(screenId) {
    return db
      .deleteScreenAPI(screenId)
      .then(res => {
        this.project.screens = this.project.screens.filter(
          s => s.id !== screenId
        )
        if (this._currScreen === screenId) {
          this._currScreen = ''
        }
      })
      .catch(err => console.error(err))
  }

  @action
  updateScreenName(name) {
    this._project.screens = this._project.screens.map(screen => {
      if (screen.id === this._currScreen) {
        screen.name = name
        updateScreenThrottle(this._currScreen, screen)
      }
      return screen
    })
  }

  @action
  updateScreenSubmitText(submitText) {
    if (this.currScreen) {
      this.currScreen.submitText = submitText
      updateScreenSubmitThrottle(submitText)
    }
  }

  @action
  async addNewInput(input) {
    try {
      input = { ...input, position: this.currScreen.screenInputs.length }
      const newScreen = await db.addInputAPI(this._currScreen, input)
      this.project.screens.forEach(screen => {
        if (screen.id === this._currScreen) {
          screen.screenInputs = [...screen.screenInputs, newScreen]
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  @action
  async deleteInput(screenId = '', inputId = '') {
    return db
      .deleteInputAPI(screenId, inputId)
      .then(res => {
        this.project.screens = this.project.screens.map(screen => {
          if (screen.id === screenId) {
            return {
              ...screen,
              screenInputs: screen.screenInputs.filter(
                input => input.id !== inputId
              ),
            }
          } else {
            return screen
          }
        })
      })
      .catch(err => console.error(err))
  }

  @action
  setCurrScreenInput(id) {
    this._currScreenInput = id
  }

  @action
  async updateCurrentInput(newInput) {
    this.screenInputs = this.currScreen.screenInputs.map(input => {
      if (input.id === newInput.id) {
        return newInput
      } else {
        return input
      }
    })
    const result = await updateInputThrottle(newInput)
    return result
  }
}

export const projectDetailStore = new ProjectDetailStore()
