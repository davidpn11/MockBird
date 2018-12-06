import React, { Component } from 'react'
import * as InputForms from '~/components/UI/InputForms'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject('projectDetailStore')
@observer
class ProjectBoard extends Component {
  static propTypes = {
    projectDetailStore: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  get currScreenInput() {
    return this.props.projectDetailStore.currScreenInput || {}
  }

  onChange(values) {
    const newInput = { ...this.currScreenInput, ...values }
    this.props.projectDetailStore.updateCurrentInput(newInput)
  }

  selectForm() {
    switch (
      this.currScreenInput.metadata && this.currScreenInput.metadata.type
    ) {
      case 'textInput':
        return (
          <InputForms.TextInputForm
            {...this.currScreenInput}
            onChange={this.onChange}
          />
        )
      case 'radioButton':
        return (
          <InputForms.RadioInputForm
            {...this.currScreenInput}
            onChange={this.onChange}
          />
        )
      case 'header':
        return (
          <InputForms.HeaderForm
            {...this.currScreenInput}
            onChange={this.onChange}
          />
        )
      case 'subheader':
        return (
          <InputForms.SubHeaderForm
            {...this.currScreenInput}
            onChange={this.onChange}
          />
        )
      default:
        return null
    }
  }

  render() {
    return <div className="flex flex-column">{this.selectForm()}</div>
  }
}

export default ProjectBoard
