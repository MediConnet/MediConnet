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
      <header className="w-full shadow-sm " style={{ position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #00bcd4' }}>
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 ">
          <div className="flex justify-between items-center h-12 w-full py-1">
            {/* NOTE: Logo a la izquierda */}
            <Box
              onClick={() => navigate(ROUTES.HOME)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  borderRadius: 1.5,
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Favorite
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    color: '#ef4444',
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 700,
                  color: '#0e7490',
                  display: { xs: 'none', sm: 'block' },
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
                mx: { md: 2, lg: 4 },
              }}
            >
              <NavigationBar />
            </Box>

            {/* NOTE: Acciones del usuario a la derecha (Mis Citas, Perfil y Cerrar sesión) */}
            {user && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: { xs: 0.5, sm: 1.5 },
                  flexShrink: 0,
                }}
              >
                <Button
                  startIcon={<CalendarToday />}
                  onClick={() => navigate(ROUTES.APPOINTMENTS)}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#4b5563',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: 0.5,
                    px: { xs: 0.5, sm: 1 },
                    display: { xs: 'none', sm: 'flex' },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#4b5563',
                      fontSize: { xs: 16, sm: 18 },
                    },
                  }}
                >
                  Mis Citas
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.PROFILE)}
                  size="small"
                  sx={{
                    minWidth: 'auto',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    borderRadius: 1,
                    backgroundColor: '#e0e0e0',
                    color: '#4b5563',
                    padding: 0,
                    '&:hover': {
                      backgroundColor: '#d0d0d0',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#4b5563',
                      fontSize: { xs: 18, sm: 20 },
                    },
                  }}
                >
                  <Person />
                </Button>
                <Button
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#4b5563',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: 0.5,
                    px: { xs: 0.5, sm: 1 },
                    display: { xs: 'none', md: 'block' },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
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

