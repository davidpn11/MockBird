import React, { Component } from 'react'
import withPermissionHOC from '~/services/auth/withPermissionHOC'
import FAB from '~/components/UI/FAB'
import { Provider, observer } from 'mobx-react'
import { projectStore } from '~/store'
import ProjectList from '~/components/ProjectList'
import MainHeader from '~/components/MainHeader'
import Modal from '~/components/UI/Modal'
import TemplatesModal from '~/components/TemplatesModal'
import Loader from '~/components/UI/Loader'
import GlobalLoader from '~/components/UI/GlobalLoader'
@observer
export class Home extends Component {
  state = {
    isOpen: false,
    isLoading: true,
  }

  closeModal = () => this.setState({ isOpen: false })

  componentDidMount = () => {
    projectStore.setProjects()
  }

  render() {
    return (
      <Provider projectStore={projectStore}>
        <div>
          <MainHeader />
          <FAB
            icon="plus"
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          />
          <ProjectList />
          <Modal
            closeModal={() => this.closeModal()}
            isOpen={this.state.isOpen}
            width="50%"
            render={() => (
              <TemplatesModal closeModal={() => this.closeModal()} />
            )}
            title="Add Project"
          />
          <Loader component={<GlobalLoader />} name="global" />
        </div>
      </Provider>
    )
  }
}

export default withPermissionHOC(Home)
