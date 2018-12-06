class LoaderService {
  _loadersList = {}

  register(loader) {
    if (this._loadersList[loader.name]) {
      this._loadersList[loader.name] = loader
    } else {
      this._loadersList = { ...this._loadersList, [loader.name]: loader }
    }
  }

  unregister(loader) {
    this._loadersList = Object.keys(this._loadersList).reduce(
      (loaders, key) => {
        const curr = this._loadersList[key]
        return curr.name !== loader.name ? { ...loaders, curr } : loaders
      },
      {}
    )
  }

  clear() {
    this._loadersList = {}
  }

  show(name = '') {
    if (this._loadersList[name]) {
      this._loadersList[name].show = true
    }
  }

  hide(name = '') {
    if (!name) return
    if (this._loadersList[name]) {
      this._loadersList[name].show = false
    }
  }

  isShowing(name = '') {
    return this._loadersList[name] ? this._loadersList[name].show : false
  }
}
const loaderService = new LoaderService()
export { loaderService }
