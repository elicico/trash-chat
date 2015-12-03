import Parse from 'parse'
import fetch from 'isomorphic-fetch'
import { createStore } from 'redux'
import { createAction } from 'redux-act'

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
    'https://zapier.com/hooks/catch/3ks388/',
    {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
}


const Room = Parse.Object.extend("Room");
const User = Parse.Object.extend("User");
const Message = Parse.Object.extend("Message");

export function fetchRooms() {
  return function(dispatch, getState) {
    dispatch(fetchRoomsPending())

    new Parse.Query(Room).find().then(
      rooms => {
        dispatch(fetchRoomsSuccess(rooms))
      },
      (model, error) => {
        dispatch(fetchRoomsFail(error))
      }
    );
  }
}

export function fetchRoom(roomAdded) {
  return function(dispatch, getState) {
    dispatch(fetchRoomPending())

    let room = new Parse.Query(Room)
    room.get(roomAdded).then(
      room => {
        dispatch(fetchRoomSuccess(room))
      },
      (model, error) => {
        dispatch(fetchRoomFail(error))
      }
    );
  }
}

export function addRoom(newRoom) {
  return function(dispatch, getState) {
    dispatch(addRoomPending())

    let room = new Room()
    room.set("name", newRoom)
    room.save().then(
      result => {
        pushEvent("roomAdded", { roomId: result.id });
        dispatch(addRoomSuccess(result))
      },
      (model, error) => {
        dispatch(addRoomFail(error))
      }
    )
  }
}


export function fetchMoreMessages(currentRoomId) {
  return function(dispatch, getState) {
    dispatch(fetchMessagesPending())

    let messages = Object.values(getState().messages.records)
      .filter(({ roomId }) => roomId === currentRoomId )
      .sort(({ createdAt: a }, { createdAt: b }) => a - b)

    var messageQuery = new Parse.Query(Message)
    var room = new Room()
    room.id = currentRoomId
    messageQuery.equalTo("room", room)
    messageQuery.descending("createdAt")
    messageQuery.limit(10)

    if (messages.length !== 0) {
      messageQuery.lessThan("createdAt", messages[0].createdAt)
    }
    return messageQuery.find().then(
      messages => {
        dispatch(fetchMessagesSuccess(messages))
      },
      (model, error) => {
        dispatch(fetchMessagesFail(error))
      }
    );
  }
}

export function fetchMessage(messageId) {
  return function(dispatch, getState) {
    dispatch(fetchMessagePending())

    let newMessage = new Parse.Query(Message)
    newMessage.get(messageId).then(
      message => {
        dispatch(fetchMessageSuccess(message))
      },
      (model, error) => {
        dispatch(fetchMessageFail(error))
      }
    )
  }
}

export function fetchUsers() {
  return function(dispatch, getState) {
    dispatch(fetchUsersPending())

    new Parse.Query(User).find().then(
      users => {
        dispatch(fetchUsersSuccess(users))
      },
      (model, error) => {
        dispatch(fetchUsersFail(error))
      }
    );
  }
}

export function fetchUser(userId) {
  return function(dispatch, getState) {
    dispatch(fetchUserPending())

    let newUser = new Parse.Query(Parse.User)
    newUser.get(userId).then(
      user => {
        dispatch(fetchUserSuccess(user))
      },
      (model, error) => {
        dispatch(fetchUserFail(error))
      }
    )
  }
}

export function sendMessage(message, roomId, userId) {
  return function(dispatch, getState) {
    dispatch(sendMessagePending())

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
        dispatch(sendMessageSuccess(result))
      },
      (error) => {
        dispatch(sendMessageFail(error))
      }
    );
  }
}

export function signupUser(username, password) {
  return function(dispatch, getState) {
    dispatch(signupUserPending())

    var user = new Parse.User()
    user.set("username", username)
    user.set("password", password)

    return user.signUp().then(
      result => {
        pushEvent("userSignup", { userId: result.id });
        dispatch(loginUserSuccess(result))
        dispatch(fetchUserSuccess(result))
      },
      (error) => {
        dispatch(signupUserFail(error))
        return error;
      }
    )
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

    return Parse.User.logIn(username, password).then(
      result => {
        dispatch(loginUserSuccess(result))
      },
      (error) => {
        dispatch(loginUserFail(error))
        return error
      }
    );

  }
}
