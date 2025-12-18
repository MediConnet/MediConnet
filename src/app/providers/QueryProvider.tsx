// NOTE: Provider de React Query para gestión de estado del servidor
// TODO: Agregar React Query DevTools en desarrollo

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// NOTE: Configuración del cliente de React Query
// - refetchOnWindowFocus: false - No recargar al cambiar de ventana
// - retry: 1 - Reintentar una vez si falla
// - staleTime: 5 minutos - Los datos se consideran frescos por 5 minutos
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

