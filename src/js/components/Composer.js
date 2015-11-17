import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Parse from 'parse'

import { sendMessage } from "../actions/actions"

class Composer extends Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.props.dispatch(sendMessage(this.state.value, this.props.currentRoomId, this.props.activeUserId))
      this.setState({ value: "" })
    }
  }

  render() {
    const { currentRoomId } = this.props
    return (
      <div className="composer">
        <input
          type='text'
          placeholder="type your message here"
          className="composer__input"
          value={ this.state.value }
          onChange={ this.handleChange.bind(this) }
          onKeyDown={ this.handleKeyDown.bind(this) }
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { currentRoomId, activeUserId } = state

  return {
    currentRoomId,
    activeUserId
  }
}

export default connect(mapStateToProps)(Composer)
