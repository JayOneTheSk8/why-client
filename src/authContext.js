import React, { createContext, useReducer } from 'react';

import constants from './constants';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const {
  util: {
    tokens: {
      CURRENT_USER,
    },
  },
} = constants;

const initialState = {
  id: null,
  username: null,
  displayName: null,
  email: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        displayName: action.payload.display_name,
        email: action.payload.email,
      };
    case LOGOUT:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

const AuthContext = createContext({
  login: () => { },
  logout: () => { },
});

const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    localStorage.setItem(CURRENT_USER, userData.username);
    dispatch({ type: LOGIN, payload: { ...userData } });
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER);
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        id: state.id,
        displayName: state.displayName,
        username: state.username,
        email: state.email,
        login,
        logout,
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };