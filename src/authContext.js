import React, { createContext, useReducer } from 'react';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const initialState = {
  id: null,
  username: null,
  display_name: null,
  email: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        display_name: action.payload.display_name,
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
    dispatch({ type: LOGIN, payload: { ...userData } });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        id: state.id,
        display_name: state.display_name,
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