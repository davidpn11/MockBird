import React, { Component, Fragment } from 'react'
import { loaderService } from '~/services/loaderService'
import PropTypes from 'prop-types'

class Loader extends Component {
  static propTypes = {
    name: PropTypes.string,
    show: PropTypes.bool,
    component: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      show: this.props.hasOwnProperty('show') ? this.props.show : false,
    }
    this.loaderService = loaderService
    this.loaderService.register(this)
  }

  get name() {
    return this.props.name
  }

  set show(show) {
    this.setState({ show })
  }

  get show() {
    return this.state.show
  }

  componentWillUnmount() {
    this.loaderService.unregister(this)
  }

  render() {
    const { show } = this.state
    const { component = null } = this.props
    return <Fragment>{show ? component : null}</Fragment>
  }
}

export default Loader
