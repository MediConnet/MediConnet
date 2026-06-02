// NOTE: Entry point de la aplicación
// Zustand maneja Auth y UI state.
// MUIThemeProviderWrapper maneja estilos (MUI + Tailwind).
// QueryProvider maneja caché de servidor.

import { MUIThemeProviderWrapper } from "./providers/MUIThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { RealtimeProvider } from "./providers/RealtimeProvider";
import { AppRouter } from "./router/AppRouter";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { useGlobalLoading } from "../shared/hooks/useGlobalLoading";
import { GlobalFeedback } from "../shared/components/modals/FeedbackModal";

const AppContent = () => {
  const { isLoading } = useGlobalLoading();

  return (
    <>
      <AppRouter />
      {isLoading && <LoadingSpinner />}
      <GlobalFeedback />
    </>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <MUIThemeProviderWrapper>
        <QueryProvider>
          <RealtimeProvider>
            <AppContent />
          </RealtimeProvider>
        </QueryProvider>
      </MUIThemeProviderWrapper>
    </ErrorBoundary>
  );
};
