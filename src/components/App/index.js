import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import * as routes from '~/services/utils/routes'
import { Home, Login, Project } from '~/containers/Routes'
import withAuthenticationHOC from '~/services/auth/withAuthenticationHOC'
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={routes.HOME} component={() => <Home />} />
        <Route exact path={routes.LOGIN} component={() => <Login />} />
        <Route
          exact
          path={routes.PROJECT}
          component={props => <Project {...props} />}
        />
      </Switch>
    )
  }
}

export default withAuthenticationHOC(App)
