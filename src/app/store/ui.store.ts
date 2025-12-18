// TODO: Implementar store de UI con Zustand
// NOTE: Por ahora es una implementación temporal simple

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

// NOTE: Implementación temporal sin Zustand
// TODO: Reemplazar con Zustand cuando se configure
let uiState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  loading: false,
  setTheme: (theme) => {
    uiState.theme = theme;
    localStorage.setItem('ui-theme', theme);
  },
  toggleSidebar: () => {
    uiState.sidebarOpen = !uiState.sidebarOpen;
  },
  setLoading: (loading) => {
    uiState.loading = loading;
  },
};

// NOTE: Cargar tema desde localStorage al iniciar
const savedTheme = localStorage.getItem('ui-theme') as 'light' | 'dark' | null;
if (savedTheme) {
  uiState.theme = savedTheme;
}

// Hook temporal que simula el comportamiento de Zustand
export const useUIStore = () => {
  return uiState;
};





