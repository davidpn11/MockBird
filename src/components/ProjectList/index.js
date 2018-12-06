import React, { Component } from 'react'
import * as _ from 'lodash'
import './ProjectList.scss'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import ProjectBox from './ProjectBox'
import HelperText from '../UI/HelperText'
import { loaderService } from '~/services/loaderService'

@inject('projectStore')
@observer
class ProjectList extends Component {
  static propTypes = {
    projectStore: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  deleteProject = id => async () => this.props.projectStore.deleteProject(id)

  getProjectsList() {
    const { projectStore } = this.props
    const projects = projectStore.getProjects
    return !loaderService.isShowing('global') &&
      Object.keys(projects).length === 0 ? (
      <HelperText text="You don't have any project =(" size="2" />
    ) : (
      _.map(projects, p => (
        <ProjectBox
          key={p.id}
          project={p}
          deleteProject={this.deleteProject(p.id)}
        />
      ))
    )
  }

  loading() {}

  render() {
    return <div className="project-list">{this.getProjectsList()}</div>
  }
}
export default ProjectList
