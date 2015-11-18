import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import RoomList from "./components/RoomList"
import MessageList from "./components/MessageList"
import Composer from "./components/Composer"
import { signupUser, logUser } from './actions/actions'
import Modal from './components/Modal'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { username: "", password: "" }
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleSignupClick(e) {
    e.preventDefault()
    this.props.dispatch(signupUser(this.state.username, this.state.password))
    this.setState({ username: "", password: "" })
  }

  handleLoginClick(e) {
    e.preventDefault()
    this.props.dispatch(logUser(this.state.username, this.state.password))
    this.setState({ username: "", password: "" })
  }

  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList />
        <Composer />
        { this.props.appModalIsOpen && (
          <Modal
            >
            <input
              type='text'
              placeholder="username"
              className="modal__input modal__input--username"
              value={ this.state.username }
              onChange={ this.handleUsernameChange.bind(this) }
            />
            <input
              type='text'
              placeholder="password"
              className="modal__input modal__input--password"
              value={ this.state.password }
              onChange={ this.handlePasswordChange.bind(this) }
            />
          <button
            className="button app__signup"
            onClick={ this.handleSignupClick.bind(this) }
            >
            sign up
          </button>
          <button
            className="button app__login"
            onClick={ this.handleLoginClick.bind(this) }
            >
            log in
          </button>
          </Modal>
          ) }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { activeUserId } = state

  return {
    appModalIsOpen: !activeUserId
  }
}

export default connect(mapStateToProps)(App)
