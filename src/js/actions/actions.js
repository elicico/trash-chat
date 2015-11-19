import Parse from 'parse'
import fetch from 'isomorphic-fetch'

export const FETCH_ROOMS_PENDING = 'FETCH_ROOMS_PENDING'
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS'
export const FETCH_ROOMS_FAIL = 'FETCH_ROOMS_FAIL'

export const FETCH_MESSAGES_PENDING = 'FETCH_MESSAGES_PENDING'
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS'
export const FETCH_MESSAGES_FAIL = 'FETCH_MESSAGES_FAIL'

export const CHANGE_ROOM = "CHANGE_ROOM"

export const FETCH_USERS_PENDING = 'FETCH_USERS_PENDING'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const FETCH_USERS_FAIL = 'FETCH_USERS_FAIL'

export const SEND_MESSAGE_PENDING = 'SEND_MESSAGE_PENDING'
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS'
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL'

export const ADD_ROOM_PENDING = 'ADD_ROOM_PENDING'
export const ADD_ROOM_SUCCESS = 'ADD_ROOM_SUCCESS'
export const ADD_ROOM_FAIL = 'ADD_ROOM_FAIL'

export const TOGGLE_MODAL_VISIBILITY = 'TOGGLE_MODAL_VISIBILITY'

export const SIGNUP_USER_PENDING = 'SIGNUP_USER_PENDING'
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS'
export const SIGNUP_USER_FAIL = 'SIGNUP_USER_FAIL'

export const LOGIN_USER_PENDING = 'LOGIN_USER_PENDING'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL'

export const LOGOUT_USER = 'LOGOUT_USER'

export const FETCH_USER_PENDING = 'FETCH_USER_PENDING'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAIL = 'FETCH_USER_FAIL'

export const FETCH_MESSAGE_PENDING = 'FETCH_MESSAGE_PENDING'
export const FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS'
export const FETCH_MESSAGE_FAIL = 'FETCH_MESSAGE_FAIL'

export const FETCH_ROOM_PENDING = 'FETCH_ROOM_PENDING'
export const FETCH_ROOM_SUCCESS = 'FETCH_ROOM_SUCCESS'
export const FETCH_ROOM_FAIL = 'FETCH_ROOM_FAIL'

let pushEvent = function(eventName, payload) {
  payload.eventName = eventName;

  return fetch(
    'https://zapier.com/hooks/catch/3ks388/',
    {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
}


const Room = Parse.Object.extend("Room");
const User = Parse.Object.extend("_User");
const Message = Parse.Object.extend("Message");

export function fetchRooms() {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_ROOMS_PENDING })

    new Parse.Query(Room).find().then(
      rooms => {
        dispatch({ type: FETCH_ROOMS_SUCCESS, payload: rooms })
      },
      (model, error) => {
        dispatch({ type: FETCH_ROOMS_FAIL, payload: error })
      }
    );
  }
}

export function fetchRoom(roomAdded) {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_ROOM_PENDING })

    let room = new Parse.Query(Room)
    room.get(roomAdded).then(
      room => {
        dispatch({ type: FETCH_ROOM_SUCCESS, payload: room })
      },
      (model, error) => {
        dispatch({ type: FETCH_ROOM_FAIL, payload: error })
      }
    );
  }
}

export function addRoom(newRoom) {
  return function(dispatch, getState) {
    dispatch({ type: ADD_ROOM_PENDING })

    let room = new Room()
    room.set("name", newRoom)
    room.save().then(
      result => {
        pushEvent("roomAdded", { roomId: result.id });
        dispatch({ type: ADD_ROOM_SUCCESS, payload: result })
      },
      (model, error) => {
        dispatch({ type: ADD_ROOM_FAIL, payload: error })
      }
    )
  }
}

export function toggleRoomModalVisibility(roomModalIsOpen) {
  let payload = { roomModalIsOpen }

  return function(dispatch, getState) {
    dispatch({ type: TOGGLE_MODAL_VISIBILITY, payload })
  }
}

export function changeRoom(roomId) {
  return {
    type: CHANGE_ROOM,
    payload: roomId
  }
}

export function fetchMessages(roomId) {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_MESSAGES_PENDING })

    var messageQuery = new Parse.Query(Message)
    var room = new Room()
    room.id = roomId
    messageQuery.equalTo("room", room)
    messageQuery.limit(1000)
    messageQuery.find().then(
      messages => {
        dispatch({ type: FETCH_MESSAGES_SUCCESS, payload: messages })
      },
      (model, error) => {
        dispatch({ type: FETCH_MESSAGES_FAIL, payload: error })
      }
    );
  }
}

export function fetchMessage(messageId) {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_MESSAGE_PENDING })

    let newMessage = new Parse.Query(Message)
    newMessage.get(messageId).then(
      message => {
        dispatch({ type: FETCH_MESSAGE_SUCCESS, payload: message })
      },
      (model, error) => {
        dispatch({ type: FETCH_MESSAGE_FAIL, payload: error })
      }
    )
  }
}

export function fetchUsers() {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_USERS_PENDING })

    new Parse.Query(User).find().then(
      users => {
        dispatch({ type: FETCH_USERS_SUCCESS, payload: users })
      },
      (model, error) => {
        dispatch({ type: FETCH_USERS_FAIL, payload: error })
      }
    );
  }
}

export function fetchUser(userId) {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_USER_PENDING })

    let newUser = new Parse.Query(Parse.User)
    newUser.get(userId).then(
      user => {
        dispatch({ type: FETCH_USER_SUCCESS, payload: user })
      },
      (model, error) => {
        dispatch({ type: FETCH_USER_FAIL, payload: error })
      }
    )
  }
}

export function sendMessage(message, roomId, userId) {
  return function(dispatch, getState) {
    dispatch({ type: SEND_MESSAGE_PENDING })

    let user = new User();
    user.id = userId;

    let room = new Room();
    room.id = roomId;

    let newMessage = new Message()
    newMessage.set("message", message)
    newMessage.set("room", room)
    newMessage.set("user", user)
    newMessage.save().then(
      result => {
        pushEvent("messageSent", { messageId: result.id });
        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: result })
      },
      (error) => {
        dispatch({ type: SEND_MESSAGE_FAIL, payload: error })
      }
    );
  }
}

export function signupUser(username, password) {
  return function(dispatch, getState) {
    dispatch({ type: SIGNUP_USER_PENDING })

    var user = new Parse.User()
    user.set("username", username)
    user.set("password", password)

    return user.signUp().then(
      result => {
        pushEvent("userSignup", { userId: result.id });
        dispatch({ type: LOGIN_USER_SUCCESS, payload: result })
        dispatch({ type: FETCH_USER_SUCCESS, payload: result })
      },
      (error) => {
        dispatch({ type: SIGNUP_USER_FAIL, payload: error })
        return error;
      }
    )
  }
}

export function setActiveUser(user) {
  return { type: LOGIN_USER_SUCCESS, payload: user };
}

export function logout(activeUser) {
  Parse.User.logOut();
  return { type: LOGOUT_USER, payload: null }
}

export function logUser(username, password) {
  return function(dispatch, getState) {
    dispatch({ type: LOGIN_USER_PENDING })

    return Parse.User.logIn(username, password).then(
      result => {
        dispatch({ type: LOGIN_USER_SUCCESS, payload: result })
      },
      (error) => {
        dispatch({ type: LOGIN_USER_FAIL, payload: error })
        return error
      }
    );

  }
}
