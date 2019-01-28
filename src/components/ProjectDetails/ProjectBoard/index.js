import React, { Component } from 'react'
import * as InputForms from '~/components/UI/InputForms'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { AdvancedConfigs } from '~/store'
import ConfigBoard from './ConfigBoard'
import isEmpty from 'lodash/isEmpty'

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

  selectBoard() {
    const advancedConfig = this.props.projectDetailStore.advancedConfig
    if (advancedConfig) {
      if (advancedConfig === AdvancedConfigs.config) {
        const project = this.props.projectDetailStore.project

        return (
          <ConfigBoard
            project={project}
            updateProject={this.updateProject}
            isUpdating={this.updateProject}
          />
        )
      } else if (advancedConfig === AdvancedConfigs.build) {
        return <div>build</div>
      }
    } else {
      return this.selectForm()
    }
  }

  updateProject = async updatedProject => {
    try {
      await this.props.projectDetailStore.updateProject(updatedProject)
    } catch (error) {
      console.error(error)
    }
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
    return <div className="flex flex-column">{this.selectBoard()}</div>
  }
}

export default ProjectBoard
