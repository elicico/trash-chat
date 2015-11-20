import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import cNames from 'classnames'
import { fetchMoreMessages, fetchUsers, fetchUser, fetchMessage } from '../actions/actions'
import pusherChannel from '../pusherChannel'
import Parse from 'parse'
import InfiniteScroll from './InfiniteScroll'

class MessageList extends Component {
  constructor(props) {
    super(props)
    this.renderMessage = this.renderMessage.bind(this)
  }

  componentDidMount() {
    if (this.props.roomId) {
      this.props.dispatch(fetchMoreMessages(this.props.roomId))
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
      this.props.dispatch(fetchMoreMessages(newProps.roomId))
      this.shouldScrollBottom = true
    }

    if (this.props.messages.length === 0 && newProps.messages.length > 0) {
      this.shouldScrollBottom = true
    }

    var node = ReactDOM.findDOMNode(this.refs.messageList)
    if (
      this.props.messages.length > 0 &&
      newProps.messages.length > 0 &&
      newProps.messages.length !== this.props.messages.length &&
      node.scrollTop + node.offsetHeight === node.scrollHeight
    ) {
      this.shouldScrollBottom = true
    }
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      var node = ReactDOM.findDOMNode(this.refs.messageList)
      node.scrollTop = node.scrollHeight
      this.shouldScrollBottom = false
    }
  }

  handleTopReached() {
    var node = ReactDOM.findDOMNode(this.refs.messageList)
    let oldScrollHeight = node.scrollHeight
    this.props.dispatch(fetchMoreMessages(this.props.roomId))
    .then(() => {
      let newScrollHeight = node.scrollHeight
      node.scrollTop = newScrollHeight - oldScrollHeight
    })
  }

  render() {
    const { messages } = this.props
    return (
      <InfiniteScroll
        className="messageList scrollbar"
        ref="messageList"
        tagName="ul"
        onTopReached={ this.handleTopReached.bind(this) }
        >
        { messages.map(this.renderMessage) }
      </InfiniteScroll>
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
