import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cNames from 'classnames'
import { fetchRooms, changeRoom, fetchUsers, addRoom } from '../actions/actions'
import Modal from "./Modal"

class RoomList extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.renderRoom = this.renderRoom.bind(this)
    this.state = { modalIsOpen: false, value: "" }
  }

  componentDidMount() {
    this.props.dispatch(fetchRooms())
    this.props.dispatch(fetchUsers())
  }

  openModal(e) {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ value: "", modalIsOpen: false })
  }

  handleModalChange(e) {
    this.setState({ value: e.target.value })
  }

  handleModalKeyDown(e) {
    if (e.keyCode === 13) {
      this.props.dispatch(addRoom(this.state.value))
      this.setState({ value: "", modalIsOpen: false })
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
          className="roomList__addRoom"
          onClick={ this.openModal.bind(this) }
          >
          add room
        </button>
        { this.state.modalIsOpen && (
          <Modal
            onClose={ this.closeModal.bind(this) }
            >
            <input
              type='text'
              placeholder="type your message here"
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
  const { currentRoomId, rooms } = state

  return {
    pending: rooms.pending,
    rooms: Object.values(rooms.records),
    roomId: currentRoomId
  }
}

export default connect(mapStateToProps)(RoomList)
