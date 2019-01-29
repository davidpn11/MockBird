import React, { Component } from 'react'
import * as InputForms from '~/components/UI/InputForms'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { AdvancedConfigs } from '~/store'
import ConfigBoard from './ConfigBoard'
import BuildBoard from './BuildBoard'
import isEmpty from 'lodash/isEmpty'

@inject('projectDetailStore')
@inject('buildStore')
@observer
class ProjectBoard extends Component {
  static propTypes = {
    projectDetailStore: PropTypes.object,
    buildStore: PropTypes.object,
  }

  state = {
    isBuilding: false,
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  get currScreenInput() {
    return this.props.projectDetailStore.currScreenInput || {}
  }

  makeBuild = screens => {
    return new Promise(async (resolve, reject) => {
      const project = this.props.projectDetailStore.project

      this.setState({ isBuilding: true }, async () => {
        await this.props.projectDetailStore.setAllScreenInputs()
        const deepScreens = this.props.projectDetailStore.deepScreens
        const screenBuilds = deepScreens.map(screen => {
          const { id, createdAt, maxWeight, ...rest } = screen
          return {
            ...rest,
            id,
            generatedURL: `/${project.id}/${id}`,
            targetURL: screens[id].targetURL,
          }
        })
        const build = {
          projectId: project.id,
          templateId: project.templateId,
          primaryColor: project.primaryColor,
          secundaryColor: project.secundaryColor,
          accentColor: project.accentColor,
          backgroundColor: project.backgroundColor,
          screenBuilds,
        }

        await this.props.buildStore
          .makeBuild(build)
          .then(result => {
            this.props.buildStore.setBuild(build)
            this.setState({ isBuilding: false }, () => {
              resolve(true)
            })
          })
          .catch(err => {
            console.error(err)
            this.setState({ isBuilding: false }, () => {
              reject(false)
            })
          })
      })
    })
  }

  onChange(values) {
    const newInput = { ...this.currScreenInput, ...values }
    this.props.projectDetailStore.updateCurrentInput(newInput)
  }

  selectBoard() {
    const { isBuilding } = this.state
    const { history, projectDetailStore, buildStore } = this.props
    const project = this.props.projectDetailStore.project
    const screens = this.props.projectDetailStore.screens
    const build = this.props.buildStore.currentBuild

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
        console.log(buildStore.currentBuild, screens)
        return (
          <BuildBoard
            build={buildStore.currentBuild}
            isBuilding={isBuilding}
            screens={screens}
            makeBuild={this.makeBuild}
          />
        )
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
