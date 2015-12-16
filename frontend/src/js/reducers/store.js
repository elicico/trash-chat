import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { reduxReactRouter } from 'redux-router'
import { createHistory } from 'history'

const createStoreWithMiddlewareAndRouter = compose(
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ createHistory })
)(createStore)

function configureStore(initialState) {
  return createStoreWithMiddlewareAndRouter(rootReducer, initialState)
}

export default configureStore()
