import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import ThemedApp from './ThemedApp';

import { AuthProvider } from './authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemedApp />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
