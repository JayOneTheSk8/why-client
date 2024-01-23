import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import endpoints from './constants/endpoints';

export const AuthRoutes = (isLoggedIn) => {
  return isLoggedIn ? <Navigate to={endpoints.frontend.root} />  : <Outlet />;
};

export const ProtectedRoutes = (isLoggedIn) => {
  return isLoggedIn ? <Outlet /> : <Navigate to={endpoints.frontend.signIn} />;
};
