// NOTE: Entry point de la aplicación
// Zustand maneja Auth y UI state.
// MUIThemeProviderWrapper maneja estilos (MUI + Tailwind).
// QueryProvider maneja caché de servidor.

import { MUIThemeProviderWrapper } from "./providers/MUIThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "./router/AppRouter";

export const App = () => {
  return (
    <MUIThemeProviderWrapper>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </MUIThemeProviderWrapper>
  );
};
