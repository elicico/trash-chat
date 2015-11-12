import { compose, createStore, applyMiddleware } from 'redux'
import { devTools } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

const createStoreWithMiddlewareAndDevTools = compose(
  applyMiddleware(thunkMiddleware),
  devTools()
)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddlewareAndDevTools(rootReducer, initialState)
}
