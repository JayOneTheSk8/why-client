import { createTheme } from '@material-ui/core/styles';

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: 'rgb(0, 0, 0)',
      border: '#c9cfd3',
      background: '#fafafa',
      text: 'rgb(0, 0, 0)',
      hover: '#dfdfdf',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Helvetica',
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: 'rgb(255, 255, 255)',
      border: '#c9cfd3',
      background: 'rgb(0, 0, 0)',
      text: '#fafafa',
      hover: '#dfdfdf',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Helvetica',
  },
});
