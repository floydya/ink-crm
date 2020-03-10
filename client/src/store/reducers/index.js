import { combineReducers } from 'redux'
import authenticationReducer from './authentication.reducers'

export default combineReducers({
  auth: authenticationReducer,
})