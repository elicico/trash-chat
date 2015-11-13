import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import RoomList from "./components/RoomList"
import MessageList from "./components/MessageList"
import Composer from "./components/Composer"
import { toggleModalVisibility } from './actions/actions'
import Modal from './components/Modal'

class App extends Component {

  componentDidMount() {
    this.props.dispatch(toggleModalVisibility(true, false))
  }

  closeModal() {
    this.props.dispatch(toggleModalVisibility(false, false))
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
            />
            <input
              type='text'
              placeholder="password"
              className="modal__input modal__input--password"
            />
          <button
            className="button app__signup"
            >
            sign up
          </button>
          <button
            className="button app__login"
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
  const { appModalIsOpen } = state

  return {
    appModalIsOpen: appModalIsOpen.appModalIsOpen
  }
}

export default connect(mapStateToProps)(App)
