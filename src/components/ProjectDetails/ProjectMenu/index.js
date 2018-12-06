import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import ScreensGrid from './ScreensGrid'
import { observer, inject } from 'mobx-react'
import { Button, Intent, Icon } from '@blueprintjs/core'
import ConfigModal from './ConfigModal'
import styled from 'styled-components'
import BuildModal from './BuildModal'

const ProjectButton = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 20px 0;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : 'inherit'};
  opacity: 1;
  &:hover {
    opacity: 0.6;
  }
`

@inject('projectDetailStore')
@inject('buildStore')
@observer
class ProjectMenu extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    addScreen: PropTypes.func,
    project: PropTypes.object,
    changeCurrentScreen: PropTypes.func,
    projectDetailStore: PropTypes.object,
    buildStore: PropTypes.object,
  }

  state = {
    configModalOpen: false,
    isUpdating: false,
    isBuilding: false,
    buildModalOpen: false,
  }

  closeModal = () => {
    this.setState({ configModalOpen: false, buildModalOpen: false })
  }

  componentDidMount() {
    const { id = '' } = this.props.match.params
    this.props.buildStore.initialize(id)
    this.props.projectDetailStore.setProject(id)
  }

  getScreens() {
    const screens = this.props.projectDetailStore.screens
    return screens
      .map(s => (
        <span
          onClick={() => this.props.changeCurrentScreen(s.id)}
          className={s.id === this.state.currScreenId ? 'active' : ''}
          key={s.id}
        >
          {s.name}
        </span>
      ))
      .concat()
  }

  updateProject = async updatedProject => {
    try {
      this.setState({ isUpdating: true })
      await this.props.projectDetailStore.updateProject(updatedProject)
      this.setState({ isUpdating: false, configModalOpen: false })
    } catch (error) {
      console.error(error)
    }
  }

  addScreen() {
    this.props.projectDetailStore.addScreen()
  }

  deleteScreen = async screenId =>
    this.props.projectDetailStore.deleteScreen(screenId)

  changeCurrentScreen(id) {
    this.props.projectDetailStore.setCurrentScreen(id)
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

  render() {
    const {
      configModalOpen,
      isUpdating,
      isBuilding,
      buildModalOpen,
    } = this.state
    const { history, projectDetailStore, buildStore } = this.props
    const project = this.props.projectDetailStore.project
    const build = this.props.buildStore.currentBuild
    return (
      <div className="flex flex-column h-100">
        <div className="flex flex-row mv3">
          <Button
            onClick={() => history && history.goBack()}
            type="button"
            intent={Intent.PRIMARY}
            large
            minimal
          >
            <Icon icon="circle-arrow-left" iconSize={25} />
          </Button>
          <div className="flex flex-column">
            <span>{project.name}</span>
            <span>Last published: {build.modifiedAt || '-'}</span>
          </div>
        </div>
        <ScreensGrid
          screens={projectDetailStore.screens}
          currScreen={projectDetailStore.currScreen}
          changeCurrScreen={id => this.changeCurrentScreen(id)}
          addScreen={() => this.addScreen()}
          deleteScreen={this.deleteScreen}
        />
        <ProjectButton
          backgroundColor="#FFB300"
          onClick={() => this.setState({ configModalOpen: true })}
        >
          <Icon icon="cog" color="white" iconSize={15} />
        </ProjectButton>
        <ProjectButton
          backgroundColor="#137cbd"
          onClick={() => this.setState({ buildModalOpen: true })}
        >
          <Icon icon="build" color="white" iconSize={15} />
        </ProjectButton>
        <ConfigModal
          isOpen={configModalOpen}
          closeModal={this.closeModal}
          project={project}
          updateProject={this.updateProject}
          isUpdating={isUpdating}
        />
        <BuildModal
          build={buildStore.currentBuild}
          isOpen={buildModalOpen}
          closeModal={this.closeModal}
          isBuilding={isBuilding}
          screens={project.screens}
          makeBuild={this.makeBuild}
        />
      </div>
    )
  }
}

export default withRouter(ProjectMenu)
