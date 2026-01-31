// NOTE: Layout principal de la aplicación con header y sidebar
// TODO: Agregar navegación completa y menú de usuario

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { ArrowForward, Download, Favorite, Menu, Close } from '@mui/icons-material';
import { ROUTES } from '../../app/config/constants';
import { useAuthStore } from '../../app/store/auth.store';
import { useState } from 'react';

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useAuthStore();
  const { user, logout } = authStore;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false); // Cerrar menú móvil al hacer clic
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

  const navItems = [
    { label: 'Inicio', action: () => navigate(ROUTES.HOME), isActive: location.pathname === ROUTES.HOME },
    { label: 'Cómo funciona', action: () => scrollToSection('como-funciona'), isActive: false },
    { label: 'Servicios', action: () => scrollToSection('servicios'), isActive: false },
    { label: 'Para profesionales', action: () => navigate(ROUTES.REGISTER), isActive: false },
    { label: 'Destacados', action: () => scrollToSection('destacados'), isActive: false },
  ];

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
            px: { xs: 1.5, sm: 3, md: 4, lg: 6 },
            py: { xs: 1.5, sm: 2 },
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
                gap: { xs: 1, sm: 1.5 },
                cursor: 'pointer',
                flexShrink: 0,
                zIndex: 1001,
              }}
            >
              <Box
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: 1.5,
                  backgroundColor: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Favorite sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 700,
                  color: '#1f2937',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                MediConnect
              </Typography>
            </Box>

            {/* NOTE: Navegación centrada - Desktop */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: { md: 2, lg: 3 },
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                marginRight: { md: 2, lg: 3 }, // ⭐ Separación moderada de los botones
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={item.action}
                  sx={{
                    textTransform: 'none',
                    color: item.isActive ? '#06b6d4' : '#1f2937',
                    fontSize: { md: '0.875rem', lg: '0.9375rem' },
                    fontWeight: item.isActive ? 600 : 400,
                    px: { md: 1, lg: 1.5 },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#06b6d4',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* NOTE: Botón menú hamburguesa - Mobile */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: '#1f2937',
                  zIndex: 1001,
                }}
              >
                <Menu />
              </IconButton>
            )}

            {/* NOTE: Drawer/Menú móvil */}
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                  width: '280px',
                  pt: 8,
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: '#1f2937',
                  }}
                >
                  <Close />
                </IconButton>
                <List>
                  {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton
                        onClick={item.action}
                        sx={{
                          py: 1.5,
                          px: 3,
                          color: item.isActive ? '#06b6d4' : '#1f2937',
                          fontWeight: item.isActive ? 600 : 400,
                          '&:hover': {
                            backgroundColor: 'rgba(6, 182, 212, 0.08)',
                            color: '#06b6d4',
                          },
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>

            {/* NOTE: Botones de acción a la derecha */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
                flexShrink: 0,
                marginLeft: { xs: 'auto', md: 3, lg: 4 }, // ⭐ Separación moderada de la navegación
                zIndex: 1001,
              }}
            >
              {!user ? (
                // Header público: Iniciar Sesión y Descargar App
                <>
                  <Button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    endIcon={<ArrowForward sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                    sx={{
                      textTransform: 'none',
                      color: '#1f2937',
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                      fontWeight: 500,
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.5, sm: 0.75 },
                      border: '1px solid #06b6d4',
                      borderRadius: 1,
                      display: { xs: 'none', sm: 'flex' }, // Ocultar en móvil muy pequeño
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
                    startIcon={<Download sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                    onClick={() => navigate(ROUTES.HOME)}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                      fontWeight: 500,
                      px: { xs: 1.5, sm: 2, md: 2.5 },
                      py: { xs: 0.5, sm: 0.75 },
                      borderRadius: 1,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: '#0891b2',
                      },
                    }}
                  >
                    App
                  </Button>
                </>
              ) : (
                // Header con usuario: solo Cerrar sesión
                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: 'none',
                    color: '#1f2937',
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    fontWeight: 500,
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 0.75 },
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

