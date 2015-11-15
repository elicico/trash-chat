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

export const ADD_USER_PENDING = 'ADD_USER_PENDING'
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS'
export const ADD_USER_FAIL = 'ADD_USER_FAIL'


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


export function fetchMessages(roomId) {
  return function(dispatch, getState) {
    dispatch({ type: FETCH_MESSAGES_PENDING })

    var messageQuery = new Parse.Query(Message)
    var room = new Room()
    room.id = roomId
    messageQuery.equalTo("room", room)

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

export function changeRoom(roomId) {
  return {
    type: CHANGE_ROOM,
    payload: roomId
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

        fetch(
          'https://zapier.com/hooks/catch/3ks388/',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: JSON.stringify({ roomId })
          }
        )

        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: result })
      },
      (model, error) => {
        dispatch({ type: SEND_MESSAGE_FAIL, payload: error })
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
        dispatch({ type: ADD_ROOM_SUCCESS, payload: result })
      },
      (model, error) => {
        dispatch({ type: ADD_ROOM_FAIL, payload: error })
      }
    )
  }
}

export function toggleModalVisibility(appModalIsOpen, roomModalIsOpen) {
  let payload = {
    appModalIsOpen,
    roomModalIsOpen
  }
  return function(dispatch, getState) {
    dispatch({ type: TOGGLE_MODAL_VISIBILITY, payload })
  }
}

export function addUser(username, password) {
  return function(dispatch, getState) {
    dispatch({ type: ADD_USER_PENDING })

    var user = new Parse.User()
    user.set("username", username)
    user.set("password", password)
    user.signUp().then(
      result => {
        dispatch({ type: ADD_USER_SUCCESS, payload: result })
      },
      (model, error) => {
        dispatch({ type: ADD_USER_FAIL, payload: error })
      }
    )
  }
}
