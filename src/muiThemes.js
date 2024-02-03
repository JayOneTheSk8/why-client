import { createTheme } from '@material-ui/core/styles';

const BLUE = '#1D9BF0';
const FADED_BLUE = 'rgb(29, 155, 240, 0.64)';

const blue = {
  original: BLUE,
  faded: FADED_BLUE,
};

const centerPanel = {
  width: '50vw',
};

export const defaultTheme = createTheme({
  palette: {
    blue,
    primary: {
      main: 'rgb(250, 250, 250)',
      border: '#c9cfd3',
      label: {
        original: '#000000',
        focused: blue.original,
      },
      hover: '#dfdfdf',
      lightHover: 'rgb(0, 0, 0, 0.03)',
      background: '#fafafa',
      text: '#000000',
      navbar: 'rgb(250, 250, 250, 0.6)',
    },
    secondary: {
      main: '#000000',
      border: '#000000',
    },
    disabled: {
      background: '#DCDCDC',
      text: '#a7a7a7',
    },
    passwordGlasses: {
      clear: 'none',
      tinted: '#696969',
      frame: '#000000',
    },
  },
  centerPanel,
  typography: {
    useNextVariants: true,
    fontFamily: 'Helvetica',
  },
});

export const darkTheme = createTheme({
  palette: {
    blue,
    primary: {
      main: 'rgb(0, 0, 0)',
      border: '#2b2b2b',
      label: {
        original: '#959595',
        focused: blue.original,
      },
      background: '#000000',
      text: '#fafafa',
      hover: '#202020',
      lightHover: 'rgb(32, 32, 32, 0.4)',
      navbar: 'rgb(0, 0, 0, 0.6)',
    },
    secondary: {
      main: '#2b2b2b',
      border: '#2b2b2b',
    },
    disabled: {
      background: '#222222',
      text: '#a7a7a7',
    },
    passwordGlasses: {
      clear: 'none',
      tinted: '#ffffff',
      frame: blue.original,
    },
  },
  centerPanel,
  typography: {
    useNextVariants: true,
    fontFamily: 'Helvetica',
  },
});
