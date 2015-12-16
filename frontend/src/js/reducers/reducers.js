import { combineReducers } from 'redux'
import { createAction, createReducer } from 'redux-act'
import { logoutUser, toggleModalVisibility } from '../actions/actions'
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
import { routerStateReducer } from 'redux-router'


var modal = createReducer({

  [ toggleModalVisibility ]: (state, payload) => {
    return { ...state, roomModalIsOpen: payload }
  }
},{ roomModalIsOpen: false } )


var messages = createReducer({

  [ fetchMessagesPending ]: (state, payload) => {
    return { ...state, pending: true }
  },

  [ fetchMessagesSuccess ]: (state, payload) => {
    var records = state.records

    for (let i=0; i<payload.length; i++) {
      let message = payload[i]
      let roomIdNum = parseInt(message.room_id)

      records[message.id] = {
        message: message.message,
        objectId: message.id,
        sentAt: message.sent_at,
        userId: message.user_id,
        roomId: roomIdNum
      }
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
    let roomIdNum = parseInt(message.room_id)

    records[message.id] = {
      message: message.message,
      objectId: message.id,
      sentAt: message.sent_at,
      userId: message.user_id,
      roomId: roomIdNum
    }

    return {
      ...state,
      pending: false,
      records
    }
  },

  [ sendMessageSuccess ]: (state, payload) => {
    var records = state.records

    let roomIdNum = parseInt(payload.room_id)

    records[payload.id] = {
      message: payload.message,
      objectId: payload.id,
      sentAt: payload.sent_at,
      userId: payload.user_id,
      roomId: roomIdNum
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
        username: user.username
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
      username: user.username
    }

    return {
      ...state,
      signupPending: false,
      records
    }
  },

  [ signupUserPending ]: (state, payload) => {
    return { ...state, signupPending: true }
  },

  [ signupUserFail ]: (state, payload) => {
    return { ...state, signupPending: false }
  },

  [ loginUserSuccess ]: (state, payload) => {
    return { ...state, currentUser : payload }
  },

  [ logoutUser ]: (state, payload) => {
    return { ...state, currentUser : null }
  }

}, {
  currentUser : null,
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
    var records = {}
    for (let i=0; i<payload.length; i++) {
      let room = payload[i];

      records[room.id] = {
        objectId: room.id,
        name: room.name
      }
    }

    return {
      ...state,
      pending: false,
      records
    }
  },

  [ fetchRoomSuccess ]: (state, payload) => {
    var records = state.records
    let newroom = payload

    records[newroom.id] = {
      objectId: newroom.id,
      name: newroom.name
    }

    return {
      ...state,
      pending: false,
      records
    }
  },

  [ addRoomSuccess ]: (state, payload) => {
    var records = state.records
    let room = payload

    records[room.id] = {
      objectId: room.id,
      name: room.name
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


const rootReducer = function(state = {}, action) {
  return {
    users: users(state.users, action),
    rooms: rooms(state.rooms, action),
    messages: messages(state.messages, action),
    roomModalIsOpen: modal(state.roomModalIsOpen, action),
    router: routerStateReducer(state.router, action)
  }
}

export default rootReducer
