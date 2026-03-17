// NOTE: Entry point de la aplicación
// Zustand maneja Auth y UI state.
// MUIThemeProviderWrapper maneja estilos (MUI + Tailwind).
// QueryProvider maneja caché de servidor.

import { MUIThemeProviderWrapper } from "./providers/MUIThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { RealtimeProvider } from "./providers/RealtimeProvider";
import { AppRouter } from "./router/AppRouter";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";
import { useGlobalLoading } from "../shared/hooks/useGlobalLoading";

const AppContent = () => {
  const { isLoading } = useGlobalLoading();

  return (
    <>
      <AppRouter />
      {isLoading && <LoadingSpinner />}
    </>
  );
};

export const App = () => {
  return (
    <MUIThemeProviderWrapper>
      <QueryProvider>
        <RealtimeProvider>
          <AppContent />
        </RealtimeProvider>
      </QueryProvider>
    </MUIThemeProviderWrapper>
  );
};
