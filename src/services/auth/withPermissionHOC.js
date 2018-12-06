import React, { Component } from 'react'
import { firebase, auth } from '~/services/firebase'
import { withRouter } from 'react-router-dom'
import * as routes from '~/services/utils/routes'
import PropTypes from 'prop-types'
import AuthContext from './AuthContext'

const withPermissionHOC = ChildComponent => {
  class WithPermission extends Component {
    static propTypes = {
      history: PropTypes.any.isRequired,
    }

    state = {}

    authCondition = authUser => !!authUser
    getUserDisplayData = () => ({
      displayName: this.state.authUser && this.state.authUser.displayName,
      photoURL: this.state.authUser && this.state.authUser.photoURL,
    })

    userLogout = () => {
      auth.signOut()
    }

    componentDidMount() {
      this.unsubscribe = firebase.auth.onAuthStateChanged(authUser => {
        if (!this.authCondition(authUser)) {
          this.props.history.push(routes.LOGIN)
        } else {
          this.setState({ authUser })
        }
      })
    }
    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return (
        <AuthContext.Consumer>
          {authUser =>
            authUser ? (
              <ChildComponent
                userLogout={() => this.userLogout()}
                getUser={this.getUserDisplayData()}
                {...this.props}
              />
            ) : null
          }
        </AuthContext.Consumer>
      )
    }
  }

  return withRouter(WithPermission)
}

export default withPermissionHOC
