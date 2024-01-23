import React from 'react';
import { amber, blue } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      light: blue[100],
      main: blue[400],
      dark: blue[600]
    },
    secondary: {
      light: amber[200],
      main: amber[500],
      dark: amber[800]
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Helvetica',
  },
});

const withMuiTheme = (Component) => {
  const withRoot = (props) => {
    return (
      <ThemeProvider theme={{ ...theme }}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  };

  return withRoot;
};

export default withMuiTheme;