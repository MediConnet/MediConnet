// NOTE: Layout principal de la aplicación con header y sidebar
// TODO: Agregar navegación completa y menú de usuario

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
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

  const handleServiciosClick = () => {
    if (location.pathname === ROUTES.HOME) {
      // Si ya estamos en home, hacer scroll suave
      const serviciosSection = document.getElementById('servicios');
      if (serviciosSection) {
        serviciosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Si no estamos en home, navegar y luego hacer scroll
      navigate(ROUTES.HOME);
      setTimeout(() => {
        const serviciosSection = document.getElementById('servicios');
        if (serviciosSection) {
          serviciosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleBeneficiosClick = () => {
    if (location.pathname === ROUTES.HOME) {
      // Si ya estamos en home, hacer scroll suave
      const beneficiosSection = document.getElementById('beneficios');
      if (beneficiosSection) {
        beneficiosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Si no estamos en home, navegar y luego hacer scroll
      navigate(ROUTES.HOME);
      setTimeout(() => {
        const beneficiosSection = document.getElementById('beneficios');
        if (beneficiosSection) {
          beneficiosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleContactoClick = () => {
    if (location.pathname === ROUTES.HOME) {
      // Si ya estamos en home, hacer scroll suave
      const contactoSection = document.getElementById('contacto');
      if (contactoSection) {
        contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Si no estamos en home, navegar y luego hacer scroll
      navigate(ROUTES.HOME);
      setTimeout(() => {
        const contactoSection = document.getElementById('contacto');
        if (contactoSection) {
          contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            {/* NOTE: Logo MEDICONES a la izquierda */}
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
                  borderRadius: 1,
                  backgroundColor: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  M
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1f2937',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                MEDICONES
              </Typography>
            </Box>

            {/* NOTE: Navegación centrada (Servicios, Beneficios, Contacto) - siempre visible */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 4,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Button
                onClick={handleServiciosClick}
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
                onClick={handleBeneficiosClick}
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
                Beneficios
              </Button>
              <Button
                onClick={handleContactoClick}
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
                Contacto
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
                // Header público: Iniciar sesión y Registrarse
                <>
                  <Button
                    onClick={() => navigate(ROUTES.LOGIN)}
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
                    Iniciar sesión
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(ROUTES.REGISTER)}
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
                    Registrarse
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

