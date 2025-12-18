// NOTE: Provider de Material UI Theme
// TODO: Personalizar tema según diseño de marca

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { ReactNode } from 'react';

// NOTE: Tema personalizado de Material UI
// TODO: Ajustar colores según la paleta de MediConnect
const theme = createTheme({
  palette: {
    primary: {
      main: '#14b8a6', // Teal/cyan principal (azul-verde)
      light: '#5eead4',
      dark: '#0d9488',
    },
    secondary: {
      main: '#06b6d4', // Cyan
    },
    background: {
      default: '#f0fdfa',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
});

interface MUIThemeProviderProps {
  children: ReactNode;
}

export const MUIThemeProviderWrapper = ({ children }: MUIThemeProviderProps) => {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

