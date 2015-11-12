import React, { Component, PropTypes } from 'react'

import RoomList from "./components/RoomList"
import MessageList from "./components/MessageList"
import Composer from "./components/Composer"

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList />
        <Composer />
      </div>
    )
  }
}
