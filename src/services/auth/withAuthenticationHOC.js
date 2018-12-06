import React, { Component } from 'react'
import { firebase, db } from '~/services/firebase'
import AuthContext from './AuthContext'

const withAuthenticationHOC = ChildComponent =>
  class WithAuthentication extends Component {
    constructor(props) {
      super(props)

      this.state = {
        authUser: null,
      }
    }

    setUser(authUser) {
      db.setUserRef(authUser.uid)
      this.setState(() => ({ authUser }))
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setUser(authUser)
          : this.setState(() => ({ authUser: null }))
      })
    }

    render() {
      const { authUser } = this.state

      return (
        <AuthContext.Provider value={authUser}>
          <ChildComponent />
        </AuthContext.Provider>
      )
    }
  }

export default withAuthenticationHOC
