import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cNames from 'classnames'
import { fetchMessages, fetchUsers, fetchUser, fetchMessage } from '../actions/actions'
import pusherChannel from '../pusherChannel'
import Parse from 'parse'

class MessageList extends Component {
  constructor(props) {
    super(props)
    this.renderMessage = this.renderMessage.bind(this)
  }

  componentDidMount() {
    if (this.props.roomId) {
      this.props.dispatch(fetchMessages(this.props.roomId))
    }
    this.props.dispatch(fetchUsers())

    pusherChannel.bind('messageSent', (object) => {
      this.props.dispatch(fetchMessage(object.messageId))
    });

    pusherChannel.bind('userSignup', (object) => {
      this.props.dispatch(fetchUser(object.userId))
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.roomId && newProps.roomId !== this.props.roomId) {
      this.props.dispatch(fetchMessages(newProps.roomId))
    }
  }

  componentDidUpdate() {
    var node = this.refs.messageList
    node.scrollTop = node.scrollHeight
  }

  render() {
    const { messages } = this.props
    return (
      <ul
        className="messageList scrollbar"
        ref="messageList"
        >
        { messages.map(this.renderMessage) }
      </ul>
    )
  }

  renderMessage(message, i) {
    const { users } = this.props

    let messageClass = cNames({
      'messageList__item cf': true,
      'messageList__item--blue': message.userId !== this.props.activeUserId,
      'messageList__item--pink': message.userId === this.props.activeUserId
    })

    let textClass = cNames({
      'messageList__item__text': true,
      'messageList__item__text--left': message.userId !== this.props.activeUserId,
      'messageList__item__text--right': message.userId === this.props.activeUserId
    })

    return(
      <li
        className={ messageClass }
        key={ message.objectId }
      >
        <div className={ textClass }>
          <span className="messageList__item__text__username">{ users[i].username }</span>
          <br />
          { message.message }
        </div>
      </li>
    )
  }
}

function mapStateToProps(state) {
  const { currentRoomId, users: stateUsers, messages: stateMessages, activeUserId } = state

  let messages = Object.values(stateMessages.records)
    .filter(({ roomId }) => roomId === currentRoomId )
    .sort(({ createdAt: a }, { createdAt: b }) => a - b);

  let users = messages.map(({ userId }) => stateUsers.records[userId]);

  return { messages, users, roomId: currentRoomId, activeUserId };
}

export default connect(mapStateToProps)(MessageList)
