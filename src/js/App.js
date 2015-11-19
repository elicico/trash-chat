import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import RoomList from "./components/RoomList"
import MessageList from "./components/MessageList"
import Composer from "./components/Composer"
import { signupUser, logUser, fetchUsers } from './actions/actions'
import Modal from './components/Modal'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { username: "", password: "", logError: false }
  }

  componentDidMount() {
    this.props.dispatch(fetchUsers())
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
    .then(
      () => this.setState({ username: "", password: "" }),
      (error) => this.setState({ logError: error.message })
    )
  }

  handleLoginClick(e) {
    e.preventDefault()
    this.props.dispatch(logUser(this.state.username, this.state.password))
    .then(
      () => this.setState({ username: "", password: "" }),
      (error) => this.setState({ logError: error.message })
    )
  }

  closeModal() {
    this.setState({ username: "", password: "", logError: false })
  }

  render() {
    return (
      <div className="app">
        <RoomList />
        <div className="app__messages-composer">
          <MessageList />
          <Composer />
        </div>
        { this.props.appModalIsOpen && (
          <Modal>
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
          { this.state.logError && (
            <Modal>
              <button
                className="modal__close-button"
                onClick={ this.closeModal.bind(this) }
                >
                close
              </button>
              <div
                className="modal__error-message"
                >
                 { this.state.logError }
              </div>
            </Modal>
          ) }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { activeUserId, users } = state

  return {
    appModalIsOpen: !activeUserId,
    users : Object.values(users.records)
  }
}

export default connect(mapStateToProps)(App)
