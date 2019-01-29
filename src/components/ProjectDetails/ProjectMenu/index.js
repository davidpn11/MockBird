import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import ScreensGrid from './ScreensGrid'
import { observer, inject } from 'mobx-react'
import { Button, Intent, Icon } from '@blueprintjs/core'
import styled from 'styled-components'
import { AdvancedConfigs } from '~/store'
import Loader from 'react-loaders'
import { gray800 } from '~/services/utils/colors'

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

  &:disabled {
    cursor: not-allowed;
  }
`
const LoaderOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: ${gray800};
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
    loadingProject: true,
    isUpdating: false,
    isAddingScreen: false,
  }

  get isConfigOpen() {
    return (
      this.props.projectDetailStore.advancedConfig === AdvancedConfigs.config
    )
  }

  get isBuildOpen() {
    return (
      this.props.projectDetailStore.advancedConfig === AdvancedConfigs.build
    )
  }

  componentDidMount() {
    const { id = '' } = this.props.match.params
    this.props.buildStore.initialize(id)
    this.props.projectDetailStore
      .setProject(id)
      .then(res => this.setState({ loadingProject: false }))
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

  addScreen() {
    this.setState({ isAddingScreen: true }, () => {
      this.props.projectDetailStore
        .addScreen()
        .finally(() => this.setState({ isAddingScreen: false }))
    })
  }

  deleteScreen = async screenId =>
    this.props.projectDetailStore.deleteScreen(screenId)

  changeCurrentScreen(id) {
    this.props.projectDetailStore.setCurrentScreen(id)
  }

  setAdvancedConfig(config) {
    this.props.projectDetailStore.setAdvancedConfig(config)
  }

  render() {
    const {
      isUpdating,
      loadingProject,
      buildModalOpen,
      isAddingScreen,
    } = this.state
    const { history, projectDetailStore } = this.props
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
        {loadingProject ? (
          <LoaderOverlay>
            <Loader type="ball-pulse-sync" />
          </LoaderOverlay>
        ) : (
          <ScreensGrid
            screens={projectDetailStore.screens}
            currScreen={projectDetailStore.currScreen}
            changeCurrScreen={id => this.changeCurrentScreen(id)}
            addScreen={() => this.addScreen()}
            deleteScreen={this.deleteScreen}
            isAddingScreen={isAddingScreen}
          />
        )}
        <ProjectButton
          backgroundColor="#FFB300"
          disabled={loadingProject}
          onClick={() => this.setAdvancedConfig(AdvancedConfigs.config)}
        >
          <Icon
            icon="cog"
            color={this.isConfigOpen ? '#29A634' : 'white'}
            iconSize={this.isConfigOpen ? 20 : 15}
          />
        </ProjectButton>
        <ProjectButton
          disabled={loadingProject}
          backgroundColor="#137cbd"
          onClick={() => this.setAdvancedConfig(AdvancedConfigs.build)}
        >
          <Icon
            icon="build"
            color={this.isBuildOpen ? '#29A634' : 'white'}
            iconSize={this.isBuildOpen ? 20 : 15}
          />
        </ProjectButton>
      </div>
    )
  }
}

export default withRouter(ProjectMenu)
