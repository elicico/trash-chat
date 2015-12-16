import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './reducers/store'
import App from './App'
import Room from './components/Room'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter,
  pushState
} from 'redux-router'
import { Route, Link } from 'react-router'

export default class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path="/" component={ App }>
              <Route path="/rooms/:roomId" component={ Room } />
            </Route>
          </ReduxRouter>
        </Provider>
      </div>
    )
  }
}
