import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UIState {
  // Estado
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;

  // Acciones
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // --- Estado Inicial ---
      theme: 'light',
      sidebarOpen: true, 
      loading: false,

      // --- Acciones ---
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      openSidebar: () => set({ sidebarOpen: true }),
      
      closeSidebar: () => set({ sidebarOpen: false }),
      
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'ui-storage', // Nombre en localStorage
      storage: createJSONStorage(() => localStorage),
      
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);