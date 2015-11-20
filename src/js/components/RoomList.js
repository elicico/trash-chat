import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cNames from 'classnames'
import { fetchRooms, changeRoom, fetchUsers, addRoom, toggleRoomModalVisibility, logout, fetchRoom } from '../actions/actions'
import pusherChannel from '../pusherChannel'
import Modal from "./Modal"

class RoomList extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.renderRoom = this.renderRoom.bind(this)
    this.state = { value: "", roomNameError: false }
  }

  componentDidMount() {
    this.props.dispatch(fetchRooms())

    pusherChannel.bind('roomAdded', (object) => {
      this.props.dispatch(fetchRoom(object.roomId))
    });
  }

  openModal(e) {
    this.props.dispatch(toggleRoomModalVisibility(true))
  }

  closeModal() {
    this.props.dispatch(toggleRoomModalVisibility(false))
    this.setState({ value: "" })
  }

  closeErrorModal() {
    this.setState({ value: "", roomNameError: false })
  }

  handleModalChange(e) {
    this.setState({ value: e.target.value })
  }

  handleModalKeyDown(e) {
    if (e.keyCode === 13) {
      let isRoomNameTaken = this.props.rooms.find( room => room.name.toLowerCase().trim() === this.state.value.toLowerCase().trim() )
      if (isRoomNameTaken) {
        this.setState({ roomNameError: "This room name already esists (」゜ロ゜)」" })
      } else if (this.state.value.trim().length === 0) {
        this.setState({ roomNameError: "A blank named room? Pls stahp." })
      } else {
        this.props.dispatch(addRoom(this.state.value))
        this.props.dispatch(toggleRoomModalVisibility(false))
        this.setState({ value: "" })
      }
    }
  }

  handleLogoutClick(e) {
    e.preventDefault()
    this.props.dispatch(logout(this.props.activeUserId))
  }

  handleClick(roomId, e) {
    e.preventDefault()
    this.props.dispatch(changeRoom(roomId))
  }

  render() {
    if (this.props.pending) {
        return (
          <div className="roomList">LOADING</div>
        );
    } else {
      return (
        <div className="roomList">
        <ul className="roomList__ul scrollbar">{ this.props.rooms.map(this.renderRoom) }</ul>
        <button
          className="button roomList__addRoom"
          onClick={ this.openModal.bind(this) }
          >
          add room
        </button>
        <button
          className="button roomList__logout"
          onClick={ this.handleLogoutClick.bind(this) }
          >
          log out
        </button>
        { this.props.roomModalIsOpen && (
          <Modal>
            <button
              className="modal__close-button"
              onClick={ this.closeModal.bind(this) }
              >
              close
            </button>
            <input
              type='text'
              placeholder="new room name here"
              className="modal__input"
              value={ this.state.value }
              onChange={ this.handleModalChange.bind(this) }
              onKeyDown={ this.handleModalKeyDown.bind(this) }
            />
          </Modal>
        ) }
        { this.state.roomNameError && (
          <Modal>
            <button
              className="modal__close-button"
              onClick={ this.closeErrorModal.bind(this) }
              >
              close
            </button>
            <div
              className="modal__error-message"
              >
               { this.state.roomNameError }
            </div>
          </Modal>
        ) }
        <div className="font-loading-cheat">preload motherfucker</div>
        </div>
      )
    }
  }

  renderRoom(room, i) {
    let roomClass = cNames({
      'roomList__ul__item': true,
      'roomList__ul__item--active': room.objectId === this.props.roomId
    })

    return (
      <li
        key={i}
        className={ roomClass }
        onClick={ this.handleClick.bind(this, room.objectId) }
        >
        { room.name }
      </li>
    );
  }
}

function mapStateToProps(state) {
  const { currentRoomId, rooms, roomModalIsOpen, activeUserId } = state

  return {
    pending: rooms.pending,
    rooms: Object.values(rooms.records),
    roomId: currentRoomId,
    roomModalIsOpen: roomModalIsOpen.roomModalIsOpen,
    activeUserId
  }
}

export default connect(mapStateToProps)(RoomList)
