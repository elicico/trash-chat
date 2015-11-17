import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cNames from 'classnames'
import { fetchRooms, changeRoom, fetchUsers, addRoom, toggleRoomModalVisibility } from '../actions/actions'
import Modal from "./Modal"

class RoomList extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.renderRoom = this.renderRoom.bind(this)
    this.state = { value: "" }
  }

  componentDidMount() {
    this.props.dispatch(fetchRooms())
    this.props.dispatch(fetchUsers())
  }

  openModal(e) {
    this.props.dispatch(toggleRoomModalVisibility(true))
  }

  closeModal() {
    this.props.dispatch(toggleRoomModalVisibility(false))
    this.setState({ value: "" })
  }

  handleModalChange(e) {
    this.setState({ value: e.target.value })
  }

  handleModalKeyDown(e) {
    if (e.keyCode === 13) {
      this.props.dispatch(addRoom(this.state.value))
      this.props.dispatch(toggleRoomModalVisibility(false))
      this.setState({ value: "" })
    }
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
        <ul className="roomList__ul">{ this.props.rooms.map(this.renderRoom) }</ul>
        <button
          className="button roomList__addRoom"
          onClick={ this.openModal.bind(this) }
          >
          add room
        </button>
        { this.props.roomModalIsOpen && (
          <Modal
            onClose={ this.closeModal.bind(this) }
            >
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
  const { currentRoomId, rooms, roomModalIsOpen } = state

  return {
    pending: rooms.pending,
    rooms: Object.values(rooms.records),
    roomId: currentRoomId,
    roomModalIsOpen: roomModalIsOpen.roomModalIsOpen
  }
}

export default connect(mapStateToProps)(RoomList)
