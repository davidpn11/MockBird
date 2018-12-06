import { Component } from 'react'
import PropTypes from 'prop-types'

class AsyncStyled extends Component {
  static propTypes = {
    children: PropTypes.any,
    module: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      mod: {},
    }
  }

  componentDidMount = () => {
    const { module } = this.props
    module && this.setModules(module)
  }

  setModules = importPath => {
    if (importPath.constructor.name !== 'Promise') {
      console.error('is not a promise')
      return
    }
    importPath
      .then(modules => this.setState({ mod: { ...modules } }))
      .catch(err => console.error(err))
  }

  render() {
    const { mod } = this.state
    return this.props.children({
      ...mod,
      setModules: this.setModules,
    })
  }
}

export default AsyncStyled
