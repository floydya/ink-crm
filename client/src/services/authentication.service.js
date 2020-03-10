import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback
} from "react";
import pubsub from "sweet-pubsub";
import authenticationReducer from "../store/reducers/authentication.reducers";
import { logoutUser } from "store/actions/authentication.actions";

export const AuthenticationContext = createContext(null);

const token = localStorage.getItem("token");
const parlor = localStorage.getItem("parlor");
const initialState = token
  ? {
      loggedIn: true,
      token,
      user: null,
      parlor: parlor ? parseInt(parlor) : null
    }
  : {};

export default ({ children }) => {
  const [state, dispatch] = useReducer(authenticationReducer, initialState);
  const handleLogout = useCallback(() => {
    dispatch(logoutUser())
  }, []);
  useEffect(() => {
    pubsub.on("logout-user", handleLogout);
    return () => {
      pubsub.off("logout-user", handleLogout);
    };
  }, [handleLogout]);
  return (
    <AuthenticationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
