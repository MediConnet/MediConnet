// NOTE: Layout principal de la aplicación con header y sidebar
// TODO: Agregar navegación completa y menú de usuario

import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { CalendarToday, Person, Favorite } from '@mui/icons-material';
import { useUIStore } from '../../app/store/ui.store';
import { NavigationBar } from '../components/NavigationBar';
import { ROUTES } from '../../app/config/constants';
import { useAuthStore } from '../../app/store/auth.store';

export const AppLayout = () => {
  const navigate = useNavigate();
  const uiStore = useUIStore();
  const authStore = useAuthStore();
  const { sidebarOpen } = uiStore;
  const { user, logout } = authStore;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* NOTE: Header/Navbar completamente blanco con todos los elementos */}
      <header className="bg-white w-full shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-2 lg:px-8">
          <div className="flex justify-between items-center h-12 w-full py-1">
            {/* NOTE: Logo a la izquierda */}
            <Box
              onClick={() => navigate(ROUTES.HOME)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  backgroundColor: '#e0f2fe', // Azul claro
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Favorite
                  sx={{
                    fontSize: 18,
                    color: '#ef4444', // Rojo
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#0e7490', // Azul oscuro/teal
                }}
              >
                Medify
              </Typography>
            </Box>

            {/* NOTE: Navegación principal en el centro (oculta en mobile, visible en desktop) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                mx: 4,
              }}
            >
              <NavigationBar />
            </Box>

            {/* NOTE: Acciones del usuario a la derecha (Mis Citas y Cerrar sesión) */}
            {user && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 2,
                  flexShrink: 0,
                }}
              >
                <Button
                  startIcon={<CalendarToday />}
                  onClick={() => navigate(ROUTES.APPOINTMENTS)}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#4b5563', // Gris oscuro
                    fontSize: '0.875rem',
                    py: 0.5,
                    px: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#4b5563',
                    },
                  }}
                >
                  Mis Citas
                </Button>
                <Button
                  startIcon={<Person />}
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#4b5563', // Gris oscuro
                    fontSize: '0.875rem',
                    py: 0.5,
                    px: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#4b5563',
                    },
                  }}
                >
                  Cerrar sesión
                </Button>
              </Box>
            )}
          </div>
        </div>
      </header>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          width: '100%',
        }}
      >
        {/* NOTE: Sidebar colapsable (solo visible en mobile cuando está abierto) */}
        {sidebarOpen && (
          <aside className="w-64 bg-white shadow-sm md:hidden" style={{ position: 'sticky', top: '48px', height: 'calc(100vh - 48px)', overflowY: 'auto' }}>
            <nav className="p-4">
              {/* NOTE: En mobile, mostrar la navegación en el sidebar */}
              <NavigationBar />
            </nav>
          </aside>
        )}

        {/* NOTE: Contenido principal - sin padding porque cada página lo maneja */}
        <main
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          <Outlet />
        </main>
      </Box>
    </Box>
  );
};

