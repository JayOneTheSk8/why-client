import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import constants from './constants';
import { darkTheme, defaultTheme } from './muiThemes';

import Root from './Root';

const {
  general: {
    eventTypes: {
      DARK_MODE_EVENT,
    },
  },
} = constants;

const ThemedApp = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handler = (event) => setDarkMode(event.detail.darkMode);

    window.addEventListener(DARK_MODE_EVENT, handler);

    return () => window.removeEventListener(DARK_MODE_EVENT, handler);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : defaultTheme}>
      <CssBaseline />
      <Root />
    </ThemeProvider>
  );
};

export default ThemedApp;
