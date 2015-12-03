import React, { Component, PropTypes } from 'react'
import MessageList from "./MessageList"
import Composer from "./Composer"

class Room extends Component {
  render() {
    return (
      <div className="app__messages-composer">
        <MessageList roomId={ this.props.params.roomId } />
        <Composer roomId={ this.props.params.roomId } />
      </div>
    )
  }
}

export default Room
