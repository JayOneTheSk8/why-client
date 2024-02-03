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
  util: {
    tokens: {
      DARK_MODE_ACTIVE,
    },
  },
} = constants;

const ThemedApp = () => {
  const [theme, setTheme] = useState(localStorage.getItem(DARK_MODE_ACTIVE) ? darkTheme : defaultTheme);

  useEffect(() => {
    const handler = (event) => {
      // For some reason if this event is sent too many times the theme isn't updated.
      // Unsure why but it works fine after ~3 clicks or so.
      setTheme(event.detail.darkMode ? darkTheme : defaultTheme);

      if (event.detail.darkMode) {
        localStorage.setItem(DARK_MODE_ACTIVE, 'true');
      } else {
        localStorage.removeItem(DARK_MODE_ACTIVE);
      }
    };

    window.addEventListener(DARK_MODE_EVENT, handler);

    return () => window.removeEventListener(DARK_MODE_EVENT, handler);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root />
    </ThemeProvider>
  );
};

export default ThemedApp;
