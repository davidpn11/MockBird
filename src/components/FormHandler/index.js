import { Component } from 'react'
import PropTypes from 'prop-types'

class FormHandler extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    children: PropTypes.func,
    onValidate: PropTypes.func,
    autoSave: PropTypes.func,
    resetValues: PropTypes.func,
  }

  state = {
    values: this.props.initialValues || {},
    touched: {},
    errors: {},
  }

  componentDidMount = () => {
    this.props.initialValues && this.validate()
  }

  validate() {
    if (!this.props.onValidate) {
      console.warn('No on validate')
      return
    }
    const errors = this.props.onValidate(this.state.values)
    this.setState({ errors }, () => {
      if (this.props.autoSave) {
        this.props.autoSave(this.state.values)
      }
    })
  }

  directChange = (name, value) => {
    this.setState(
      prev => ({
        values: {
          ...prev.values,
          [name]: value,
        },
      }),
      () => this.props.onValidate && this.validate()
    )
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.resetValues &&
      this.props.resetValues(prevProps, this.props)
    ) {
      this.setState(prev => ({
        values: this.props.initialValues || {},
        touched: {},
        errors: {},
      }))
    }
  }

  handleChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    if (!name) {
      console.warn(
        'the input you just modified doesnt have a name. To use the FormHandler, please provide one.'
      )
    }
    /**
     * remove the synthetic event
     * from the pool and allow references to the event to be retained by user code
     */
    event.persist()
    this.setState(
      prev => ({
        values: {
          ...prev.values,
          [name]: value,
        },
      }),
      () => this.props.onValidate && this.validate()
    )
  }

  render() {
    return this.props.children({
      ...this.state,
      handleChange: this.handleChange,
      directChange: this.directChange,
    })
  }
}

export default FormHandler
