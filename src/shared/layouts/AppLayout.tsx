// NOTE: Layout principal de la aplicación con header y sidebar
// TODO: Agregar navegación completa y menú de usuario

import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../app/store/ui.store';
import { UserMenu } from '../components/UserMenu';

export const AppLayout = () => {
  const uiStore = useUIStore();
  const { sidebarOpen, toggleSidebar } = uiStore;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NOTE: Header con logo y menú hamburguesa */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <h1 className="ml-4 text-xl font-bold">MediConnect</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {/* NOTE: Menú de usuario con logout */}
              <UserMenu />
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* NOTE: Sidebar colapsable */}
        {/* TODO: Agregar navegación del sidebar con links */}
        {sidebarOpen && (
          <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
            <nav className="p-4">
              {/* TODO: Agregar links de navegación */}
            </nav>
          </aside>
        )}

        {/* NOTE: Contenido principal donde se renderizan las páginas */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

