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

const ogDarkModeActive = !!localStorage.getItem(DARK_MODE_ACTIVE);

const ThemedApp = () => {
  const [theme, setTheme] = useState(localStorage.getItem(DARK_MODE_ACTIVE) ? darkTheme : defaultTheme);

  useEffect(() => {
    const handler = (event) => {
      // For some reason if this event is sent too many times the theme isn't updated.
      // Unsure why but it works fine after ~3 clicks. so we'll reload when the button is clicked more than once.
      const { darkMode } = event.detail;

      setTheme(darkMode ? darkTheme : defaultTheme);

      if (darkMode) {
        localStorage.setItem(DARK_MODE_ACTIVE, 'true');
      } else {
        localStorage.removeItem(DARK_MODE_ACTIVE);
      }

      darkMode === ogDarkModeActive && window.location.reload();
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
