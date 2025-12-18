// NOTE: Provider de tema que aplica el tema seleccionado al documento
// TODO: Agregar soporte para Tailwind dark mode cuando se configure

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useUIStore } from '../store/ui.store';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useUIStore();

  useEffect(() => {
    // NOTE: Aplica la clase 'dark' al elemento raíz para activar el modo oscuro
    // TODO: Configurar Tailwind para usar class strategy en lugar de media
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

