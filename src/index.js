import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import Root from './Root';

import { AuthProvider } from './authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
