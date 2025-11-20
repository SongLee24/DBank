import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006A60',
    },
    secondary: {
      main: '#516260',
    },
    error: {
      main: '#BA1A1A',
    },
    background: {
      default: '#FBFCF9',
      paper: '#FBFCF9',
    },
    text: {
      primary: '#191C1B',
    },
  },
  typography: {
    fontFamily: 'Roboto, Noto Sans, sans-serif',
    displayLarge: {
      fontWeight: 'bold',
    },
    displayMedium: {
      fontWeight: 'bold',
    },
    labelLarge: {
      fontWeight: 'bold',
    },
    bodyLarge: {
      fontWeight: 'normal',
    },
  },
  spacing: 4,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
  },
});

export default theme;
