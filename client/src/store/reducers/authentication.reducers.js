import { authenticationConstants } from "../constants"

export default (state, action) => {
  switch (action.type) {
    case authenticationConstants.LOGIN_USER:
      localStorage.setItem('token', action.payload)
      return { loggedIn: true, token: action.payload }
    case authenticationConstants.FETCH_USER:
      return { ...state, user: action.payload }
    case authenticationConstants.LOGOUT_USER:
      localStorage.removeItem('token')
      return { loggedIn: false, token: null }
    case authenticationConstants.SET_PARLOR:
      localStorage.setItem('parlor', action.payload)
      return { ...state, parlor: action.payload }
    default:
      return state
  }
}