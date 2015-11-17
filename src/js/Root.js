import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './reducers/store'
import App from './App'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

export default class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <App />
        </Provider>
      </div>
    )
  }
}

// <DebugPanel top right bottom>
//   <DevTools store={store} monitor={LogMonitor} />
// </DebugPanel>
