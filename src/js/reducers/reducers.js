import { combineReducers } from 'redux'
import { FETCH_ROOMS_PENDING, FETCH_ROOMS_SUCCESS, FETCH_MESSAGES_PENDING, FETCH_MESSAGES_SUCCESS, CHANGE_ROOM, FETCH_USERS_PENDING, FETCH_USERS_SUCCESS, SEND_MESSAGE_SUCCESS, ADD_ROOM_PENDING, ADD_ROOM_SUCCESS, TOGGLE_MODAL_VISIBILITY, ADD_USER_PENDING, ADD_USER_SUCCESS } from '../actions/actions'

function currentRoomId(state = null, action) {
  switch (action.type) {
    case FETCH_ROOMS_SUCCESS:
      return action.payload[0].id
    case CHANGE_ROOM:
      return action.payload
    default:
      return state
  }
}

function modal(
  state = {
    appModalIsOpen: false,
    roomModalIsOpen: false
  }, action) {
    switch (action.type) {
      case TOGGLE_MODAL_VISIBILITY:
        return {
          ...state,
          appModalIsOpen: action.payload.appModalIsOpen,
          roomModalIsOpen: action.payload.roomModalIsOpen
          }
      default:
        return state
    }
  }

function messages(
  state = {
    pending: false,
    error: null,
    records: {}
  }, action) {
    switch (action.type) {
      case FETCH_MESSAGES_PENDING:
        return { ...state, pending: true }
      case FETCH_MESSAGES_SUCCESS:

        var records = state.records;

        for (let i=0; i<action.payload.length; i++) {
          let message = action.payload[i];
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

      case SEND_MESSAGE_SUCCESS:

        var records = state.records;

        records[action.payload.id] = {
          createdAt: action.payload.createdAt,
          message: action.payload.get("message"),
          objectId: action.payload.id,
          userId: action.payload.get("user").id,
          roomId: action.payload.get("room").id
        };

        return {
          ...state,
          pending: false,
          records
        }

      default:
        return state
  }
}

function users(
  state = {
    pending: false,
    error: null,
    records: {}
  }, action) {
    switch (action.type) {
      case FETCH_USERS_PENDING:
        return { ...state, pending: true }
      case FETCH_USERS_SUCCESS:
        var records = {}

        for (let i=0; i<action.payload.length; i++) {
          let user = action.payload[i];
          records[user.id] = {
            email: user.get("email"),
            objectId: user.id,
            username: user.get("username")
          }
        }

        return {
          ...state,
          pending: false,
          records
        }
      default:
        return state;
    }
}

function rooms(
  state = {
    pending: false,
    error: null,
    records: {}
  }, action) {
    switch (action.type) {
      case FETCH_ROOMS_PENDING:
        return { ...state, pending: true }
      case FETCH_ROOMS_SUCCESS:

        // let records = action.payload.reduce((previousReturn, room) => {
        //   previousReturn[room.id] = {
        //     objectId: room.id,
        //     name: room.get("name")
        //   };
        //   return previousReturn;
        // }, {})

        var records = {};

        for (let i=0; i<action.payload.length; i++) {
          let room = action.payload[i];

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

      case ADD_ROOM_SUCCESS:
        var records = state.records
        let room = action.payload;

        records[room.id] = {
          objectId: room.id,
          name: room.get("name")
        }

        return {
          ...state,
          pending: false,
          records
        }

      default:
        return state
  }
}

function activeUser(
  state = {
    pending: false,
    error: null,
    records: {}
  }, action) {
    switch (action.type) {
      case ADD_USER_PENDING:
        return { ...state, pending: true }
      case ADD_USER_SUCCESS:
        let records = {}
        let loggedUser = action.payload

        records[loggedUser] = {
          objectId: loggedUser.id,
          username: loggedUser.get("username")
        }

        return {
          ...state,
          pending: false,
          records
        }

      default:
        return state
    }
  }

const rootReducer = function(state = {}, action) {
  return {
    users: users(state.users, action),
    rooms: rooms(state.rooms, action),
    messages: messages(state.messages, action),
    currentRoomId: currentRoomId(state.currentRoomId, action),
    appModalIsOpen: modal(state.appModalIsOpen, action),
    roomModalIsOpen: modal(state.roomModalIsOpen, action),
    loggedUser: activeUser(state.activeUser, action)
  }
}

export default rootReducer
