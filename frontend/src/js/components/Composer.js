import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'

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
      e.preventDefault()
      if (this.state.value.trim().length > 0) {
        this.props.dispatch(sendMessage(this.state.value, this.props.roomId, this.props.currentUser))
        this.setState({ value: "" })
      }
    }
  }

  render() {
    const { currentRoomId } = this.props
    return (
      <div className="composer">
        <Textarea
          maxRows={5}
          placeholder="type your message here"
          className="composer__textarea scrollbar"
          value={ this.state.value }
          onChange={ this.handleChange.bind(this) }
          onKeyDown={ this.handleKeyDown.bind(this) }
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { users } = state

  let currentUser = function() {
    if (users.currentUser) {
      return users.currentUser.id
    } else {
      return ""
    }
  }()

  return {
    currentUser
  }
}

export default connect(mapStateToProps)(Composer)
