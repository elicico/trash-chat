import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import RoomList from "./components/RoomList"
import { signupUser, logUser, fetchUsers, setActiveUser } from './actions/actions'
import Modal from './components/Modal'
import { Route, Link } from 'react-router'
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter,
  pushState
} from 'redux-router'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { username: "", password: "", logError: false }
  }

  componentDidMount() {
    this.props.dispatch(fetchUsers())

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      this.props.dispatch(setActiveUser(currentUser))
    }
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
      () => {
        this.props.dispatch(logUser(this.state.username, this.state.password))
        this.setState({ username: "", password: ""})
        this.props.dispatch(pushState(null, '/rooms/1'))
      },
      (error) => this.setState({ logError: error.message})
    )
  }

  handleLoginClick(e) {
    e.preventDefault()
    this.props.dispatch(logUser(this.state.username, this.state.password))
    .then(
      () => {
        this.props.dispatch(logCurrentUser(this.state.username, this.state.password))
        this.setState({ username: "", password: ""})
        this.props.dispatch(pushState(null, '/rooms/1'))
      },
      (error) => this.setState({ logError: error.message })
    )
  }

  closeModal() {
    this.setState({ username: "", password: "", logError: false })
  }

  render() {
    return (
      <div className="app">
        { this.props.currentUser && (
          <RoomList roomId={ this.props.params.roomId } />
        )}
        { this.props.children }
        { (this.props.currentUser === null && this.props.appModalIsOpen) && (
          <Modal>
            <input
              type='text'
              placeholder="username"
              className="modal__input modal__input--username"
              value={ this.state.username }
              onChange={ this.handleUsernameChange.bind(this) }
            />
            <input
              type='password'
              placeholder="password"
              className="modal__input modal__input--password"
              value={ this.state.password }
              onChange={ this.handlePasswordChange.bind(this) }
            />
          <button
            className="button app__signup"
            disabled={ this.props.userSignupPending }
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

          { this.props.userSignupPending && (
            <div className="modal">
              <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
              </div>
            </div>
          ) }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { users } = state

  return {
    appModalIsOpen: !users.currentUser,
    users : Object.values(users.records),
    currentUser: users.currentUser,
    userSignupPending : users.signupPending
  }
}

export default connect(mapStateToProps)(App)
