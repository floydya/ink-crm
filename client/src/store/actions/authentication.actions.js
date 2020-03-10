import { authenticationConstants } from "../constants"

export const loginUser = token => ({
  type: authenticationConstants.LOGIN_USER,
  payload: token
})

export const fetchUser = user => ({
  type: authenticationConstants.FETCH_USER,
  payload: user
})

export const logoutUser = () => ({
  type: authenticationConstants.LOGOUT_USER
})

export const setParlor = (parlor) => ({
  type: authenticationConstants.SET_PARLOR,
  payload: parlor
})

export default { loginUser, fetchUser, logoutUser, setParlor }
