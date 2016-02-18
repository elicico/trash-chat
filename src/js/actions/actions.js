import Parse from 'parse'
import fetch from 'isomorphic-fetch'
import { createStore } from 'redux'
import { createAction } from 'redux-act'
import { polyfill } from 'es6-promise'
polyfill()

export const fetchRoomsPending = createAction()
export const fetchRoomsSuccess = createAction()
export const fetchRoomsFail = createAction()

export const fetchMessagesPending = createAction()
export const fetchMessagesSuccess = createAction()
export const fetchMessagesFail = createAction()

export const fetchUsersPending = createAction()
export const fetchUsersSuccess = createAction()
export const fetchUsersFail = createAction()

export const sendMessagePending = createAction()
export const sendMessageSuccess = createAction()
export const sendMessageFail = createAction()

export const addRoomPending = createAction()
export const addRoomSuccess = createAction()
export const addRoomFail = createAction()

export const signupUserPending = createAction()
export const signupUserSuccess = createAction()
export const signupUserFail = createAction()

export const loginUserPending = createAction()
export const loginUserSuccess = createAction()
export const loginUserFail = createAction()

export const fetchUserPending = createAction()
export const fetchUserSuccess = createAction()
export const fetchUserFail = createAction()

export const fetchMessagePending = createAction()
export const fetchMessageSuccess = createAction()
export const fetchMessageFail = createAction()

export const fetchRoomPending = createAction()
export const fetchRoomSuccess = createAction()
export const fetchRoomFail = createAction()

let pushEvent = function(eventName, payload) {
  payload.eventName = eventName;

  return fetch(
    'https://zapier.com/hooks/catch/3elae4/',
    {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
}

export function fetchRooms() {
  return function(dispatch, getState) {
    dispatch(fetchRoomsPending())

    return fetch('http://127.0.0.1:3517/rooms')
      .then((response) => {
        return response.json()
      }).then((rooms) => {
        dispatch(fetchRoomsSuccess(rooms))
      }).catch((error) => {
        dispatch(fetchRoomsFail(error))
      })
  }
}

export function fetchRoom(roomAdded) {
  return function(dispatch, getState) {
    dispatch(fetchRoomPending())

    return fetch(`http://127.0.0.1:3517/rooms/${parseInt(roomAdded.roomId)}`)
      .then((response) => {
        return response.json()
      }).then((room) => {
        dispatch(fetchRoomSuccess(room))
      }).catch((error) => {
        dispatch(fetchRoomFail(error))
      })
  }
}

export function addRoom(newRoom) {
  return function(dispatch, getState) {
    dispatch(addRoomPending())

    return fetch('http://127.0.0.1:3517/rooms',
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": newRoom })
      } )
      .then((response) => {
        return response.json()
      }).then((room) => {
        pushEvent("roomAdded", { roomId: room.id });
        dispatch(addRoomSuccess(room))
      }).catch((error) => {
        dispatch(addRoomFail(error))
      })
  }
}


export function fetchMoreMessages(currentRoomId) {
  return function(dispatch, getState) {
    dispatch(fetchMessagesPending())

    let messages = Object.values(getState().messages.records)
      .filter(({ roomId }) => roomId === currentRoomId )
      .sort(({ createdAt: a }, { createdAt: b }) => a - b)

    let url = `http://127.0.0.1:3517/rooms/${currentRoomId}/messages`

    if (messages.length !== 0) {
      url += `?idLessThan=${messages[0].id}`
    }

    return fetch(`http://127.0.0.1:3517/rooms/${currentRoomId}/messages`)
      .then((response) => {
        return response.json()
      }).then((messages) => {
        dispatch(fetchMessagesSuccess(messages))
      }).catch((error) => {
        dispatch(fetchMessagesFail(error))
      })
  }
}

export function fetchMessage(messageId) {
  return function(dispatch, getState) {
    dispatch(fetchMessagePending())
    return fetch(`http://127.0.0.1:3517/messages/${messageId}`)
      .then((response) => {
        return response.json()
      }).then((message) => {
        dispatch(fetchMessageSuccess(message))
      }).catch((error) => {
        dispatch(fetchMessageFail(error))
      })
  }
}

export function sendMessage(message, roomId, userId) {
  return function(dispatch, getState) {
    dispatch(sendMessagePending())

    return fetch('http://127.0.0.1:3517/messages',
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "message": message, "room_id": roomId, "user_id": userId })
      } )
      .then((response) => {
        return response.json()
      }).then((message) => {
        pushEvent("messageSent", { messageId: message.id })
        dispatch(sendMessageSuccess(message))
      }).catch((error) => {
        dispatch(sendMessageFail(error))
      })
  }
}

export function fetchUsers() {
  return function(dispatch, getState) {
    dispatch(fetchUsersPending())

    return fetch('http://127.0.0.1:3517/users')
      .then((response) => {
        return response.json()
      }).then((users) => {
        dispatch(fetchUsersSuccess(users))
      }).catch((error) => {
        dispatch(fetchUsersFail(error))
      })
  }
}

export function fetchUser(userId) {
  return function(dispatch, getState) {
    dispatch(fetchUserPending())

    return fetch(`http://127.0.0.1:3517/users/${userId}`)
      .then((response) => {
        return response.json()
      }).then((user) => {
        dispatch(fetchUserSuccess(user))
      }).catch((error) => {
        dispatch(fetchUserFail(error))
      })
  }
}

export function signupUser(username, password) {
  return function(dispatch, getState) {
    dispatch(signupUserPending())

    return fetch(`http://127.0.0.1:3517/users`,
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": username, "password": password })
      } )
      .then((response) => {
        return response.json()
      }).then((user) => {
        pushEvent("userSignup", { userId: user.id })
        localStorage.setItem("currentUser", JSON.stringify(user))
        dispatch(loginUserSuccess(user))
        dispatch(fetchUserSuccess(user))
      }).catch((error) => {
        dispatch(signupUserFail(error))
          return error
      })

  }
}

// var actionCounter = 0;
//
// function createAction() {
//   var type = "Action_" + actionCounter++;
//
//   var actionCreator = function(payload) {
//     return { type, payload };
//   }
//   actionCreator.type = type;
//   actionCreator.toString = function() {
//     return type;
//   }
//
//   return actionCreator;
// }

export function setActiveUser(user) {
  return loginUserSuccess(user);
}

export var logoutUser = createAction();
export var toggleModalVisibility = createAction();

export function logUser(username, password) {
  return function(dispatch, getState) {
    dispatch(loginUserPending())

    return fetch(`http://127.0.0.1:3517/users/authenticate`,
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": username, "password": password })
      } )
      .then((response) => {
        return response.json()
      }).then((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user))
        dispatch(loginUserSuccess(user))
      }).catch((error) => {
        dispatch(loginUserFail(error))
          return error
      })

  }
}
