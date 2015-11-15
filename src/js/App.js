import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import RoomList from "./components/RoomList"
import MessageList from "./components/MessageList"
import Composer from "./components/Composer"
import { toggleModalVisibility, addUser, logUser } from './actions/actions'
import Modal from './components/Modal'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { username: "", password: "" }
  }

  componentDidMount() {
    this.props.dispatch(toggleModalVisibility(true, false))
  }

  closeModal() {
    this.props.dispatch(toggleModalVisibility(false, false))
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleSignupClick(e) {
    e.preventDefault()
    this.props.dispatch(toggleModalVisibility(false, false))
    this.props.dispatch(addUser(this.state.username, this.state.password))
  }

  handleLoginClick(e) {
    e.preventDefault()
    this.props.dispatch(toggleModalVisibility(false, false))
    this.props.dispatch(logUser(this.state.username, this.state.password))
  }

  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList />
        <Composer />
        { this.props.appModalIsOpen && (
          <Modal
            onClose={ this.closeModal.bind(this) }
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
  const { appModalIsOpen, loggedUser } = state

  return {
    appModalIsOpen: appModalIsOpen.appModalIsOpen,
    loggedUser: loggedUser
  }
}

export default connect(mapStateToProps)(App)
