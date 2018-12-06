import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import './Project.scss'
import { Provider } from 'mobx-react'
import { projectDetailStore, buildStore } from '~/store'
import withPermissionHOC from '~/services/auth/withPermissionHOC'
import {
  ProjectBoard,
  ProjectDisplay,
  ProjectMenu,
} from '~/components/ProjectDetails'
class Project extends Component {
  render() {
    return (
      <Provider projectDetailStore={projectDetailStore} buildStore={buildStore}>
        <div className="project-details">
          <ProjectMenu />
          <ProjectDisplay />
          <ProjectBoard />
        </div>
      </Provider>
    )
  }
}

export default compose(
  withRouter,
  withPermissionHOC
)(Project)
