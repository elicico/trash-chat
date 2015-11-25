import { combineReducers } from 'redux'
import { createAction, createReducer } from 'redux-act'
import { logoutUser, toggleModalVisibility, changeRoom } from '../actions/actions'
import {
  fetchRoomsPending,
  fetchRoomsSuccess,
  fetchRoomsFail,
  fetchMessagesPending,
  fetchMessagesSuccess,
  fetchMessagesFail,
  fetchUsersPending,
  fetchUsersSuccess,
  fetchUsersFail,
  sendMessagePending,
  sendMessageSuccess,
  sendMessageFail,
  addRoomPending,
  addRoomSuccess,
  addRoomFail,
  signupUserPending,
  signupUserSuccess,
  signupUserFail,
  loginUserPending,
  loginUserSuccess,
  loginUserFail,
  fetchUserPending,
  fetchUserSuccess,
  fetchUserFail,
  fetchMessagePending,
  fetchMessageSuccess,
  fetchMessageFail,
  fetchRoomPending,
  fetchRoomSuccess,
  fetchRoomFail
} from '../actions/actions'

var currentRoomId = createReducer({
  [ fetchRoomsSuccess ]: (state, payload) => payload[0].id,
  [ changeRoom ]: (state, payload) => payload
}, null)

var modal = createReducer({
  [ toggleModalVisibility ]: (state, payload) => {
    return { ...state, roomModalIsOpen: payload }
  }
},
{ roomModalIsOpen: false } )

var messages = createReducer({
  [ fetchMessagesPending ]: (state, payload) => {
    return { ...state, pending: true }
  },
  [ fetchMessagesSuccess ]: (state, payload) => {
    var records = state.records;

    for (let i=0; i<payload.length; i++) {
      let message = payload[i];
      records[message.id] = {
        createdAt: message.createdAt,
        message: message.get("message"),
        objectId: message.id,
        userId: message.get("user").id,
        roomId: message.get("room").id
      };
    }

    return {
      ...state,
      pending: false,
      records
    }
  },
  [ fetchMessageSuccess ]: (state, payload) => {
    let records = state.records
    let message = payload

      records[message.id] = {
        createdAt: message.createdAt,
        message: message.get("message"),
        objectId: message.id,
        userId: message.get("user").id,
        roomId: message.get("room").id
      }

    return {
      ...state,
      pending: false,
      records
    }
  },
  [ sendMessageSuccess ]: (state, payload) => {
    var records = state.records;

    records[payload.id] = {
      createdAt: payload.createdAt,
      message: payload.get("message"),
      objectId: payload.id,
      userId: payload.get("user").id,
      roomId: payload.get("room").id
    };

    return {
      ...state,
      pending: false,
      records
    }
  }
}, {
  pending: false,
  error: null,
  records: {}
} )

var users = createReducer({
  [ fetchUsersPending ]: (state, payload) => {
    return { ...state, pending: true }
  },
  [ fetchUsersSuccess ]: (state, payload) => {
    var records = state.records

    for (let i=0; i<payload.length; i++) {
      let user = payload[i];
      records[user.id] = {
        objectId: user.id,
        username: user.get("username")
      }
    }

    return {
      ...state,
      signupPending: false,
      pending: false,
      records
    }
  },
  [ fetchUserSuccess ]: (state, payload) => {
    var records = state.records
    let user = payload

    records[user.id] = {
      objectId: user.id,
      username: user.get("username")
    }

    return {
      ...state,
      signupPending: false,
      records
    }
  },
  [ signupUserPending ]: (state, pending) => {
    return { ...state, signupPending: true }
  },
  [ signupUserFail ]: (state, pending) => {
    return { ...state, signupPending: false }
  }
}, {
  signupPending: false,
  pending: false,
  error: null,
  records: {}
} )

var rooms = createReducer({
  [ fetchRoomsPending ]: (state, payload) => {
    return { ...state, pending: true }
  },
  [ fetchRoomsSuccess ]: (state, payload) => {
    var records = {};

    for (let i=0; i<payload.length; i++) {
      let room = payload[i];

      records[room.id] = {
        objectId: room.id,
        name: room.get("name")
      };
    }

    return {
      ...state,
      pending: false,
      records
    }
  },
  [ fetchRoomSuccess ]: (state, payload) => {
    var records = state.records
    let newroom = payload;

    records[newroom.id] = {
      objectId: newroom.id,
      name: newroom.get("name")
    }

    return {
      ...state,
      pending: false,
      records
    }
  },
  [ addRoomSuccess ]: (state, payload) => {
    var records = state.records
    let room = payload;

    records[room.id] = {
      objectId: room.id,
      name: room.get("name")
    }

    return {
      ...state,
      pending: false,
      records
    }
  }
}, {
  pending: false,
  error: null,
  records: {}
} )


var activeUserId = createReducer({
  [ loginUserSuccess ]: (state, payload) => payload.id,
  [ logoutUser ]: (state, payload) => null
}, null)

const rootReducer = function(state = {}, action) {
  return {
    users: users(state.users, action),
    rooms: rooms(state.rooms, action),
    messages: messages(state.messages, action),
    currentRoomId: currentRoomId(state.currentRoomId, action),
    roomModalIsOpen: modal(state.roomModalIsOpen, action),
    activeUserId: activeUserId(state.activeUserId, action)
  }
}

export default rootReducer
