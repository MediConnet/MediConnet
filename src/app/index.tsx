// NOTE: Entry point de la aplicación
// Orden de providers: MUI Theme -> Query -> Auth -> Theme -> Router

import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { MUIThemeProviderWrapper } from './providers/MUIThemeProvider';
import { AppRouter } from './router/AppRouter';

export const App = () => {
  return (
    <MUIThemeProviderWrapper>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppRouter />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </MUIThemeProviderWrapper>
  );
};

