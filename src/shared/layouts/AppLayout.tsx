// NOTE: Layout principal de la aplicación con header y sidebar
// TODO: Agregar navegación completa y menú de usuario

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ArrowForward, Download, Favorite } from '@mui/icons-material';
import { ROUTES } from '../../app/config/constants';
import { useAuthStore } from '../../app/store/auth.store';

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useAuthStore();
  const { user, logout } = authStore;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const scrollToSection = (id: string) => {
    if (location.pathname === ROUTES.HOME) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(ROUTES.HOME);
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* NOTE: Header/Navbar con diseño público o privado según el estado del usuario */}
      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          left: 0,
          right: 0,
          zIndex: 1000, 
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          width: '100%',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 2, sm: 4, md: 6 },
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* NOTE: Logo MediConnect a la izquierda */}
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
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Favorite sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1f2937',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                MediConnect
              </Typography>
            </Box>

            {/* NOTE: Navegación centrada - siempre visible */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 3,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Button
                onClick={() => navigate(ROUTES.HOME)}
                sx={{
                  textTransform: 'none',
                  color: location.pathname === ROUTES.HOME ? '#06b6d4' : '#1f2937',
                  fontSize: '0.9375rem',
                  fontWeight: location.pathname === ROUTES.HOME ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#06b6d4',
                  },
                }}
              >
                Inicio
              </Button>
              <Button
                onClick={() => scrollToSection('como-funciona')}
                sx={{
                  textTransform: 'none',
                  color: '#1f2937',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#06b6d4',
                  },
                }}
              >
                Cómo funciona
              </Button>
              <Button
                onClick={() => scrollToSection('servicios')}
                sx={{
                  textTransform: 'none',
                  color: '#1f2937',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#06b6d4',
                  },
                }}
              >
                Servicios
              </Button>
              <Button
                onClick={() => navigate(ROUTES.REGISTER)}
                sx={{
                  textTransform: 'none',
                  color: '#1f2937',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#06b6d4',
                  },
                }}
              >
                Para profesionales
              </Button>
              <Button
                onClick={() => scrollToSection('destacados')}
                sx={{
                  textTransform: 'none',
                  color: '#1f2937',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#06b6d4',
                  },
                }}
              >
                Destacados
              </Button>
            </Box>

            {/* NOTE: Botones de acción a la derecha */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              {!user ? (
                // Header público: Iniciar Sesión y Descargar App
                <>
                  <Button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                    sx={{
                      textTransform: 'none',
                      color: '#1f2937',
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      px: 2,
                      py: 0.75,
                      border: '1px solid #06b6d4',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(6, 182, 212, 0.04)',
                        borderColor: '#0891b2',
                      },
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download sx={{ fontSize: 18 }} />}
                    onClick={() => navigate(ROUTES.HOME)}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      px: 2.5,
                      py: 0.75,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: '#0891b2',
                      },
                    }}
                  >
                    Descargar App
                  </Button>
                </>
              ) : (
                // Header con usuario: solo Cerrar sesión
                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: 'none',
                    color: '#1f2937',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    px: 2,
                    py: 0.75,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Cerrar sesión
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </header>

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
  );
};

