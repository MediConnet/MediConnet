// NOTE: Sección hero principal de la página de inicio con gradiente y contenido
// TODO: Agregar animaciones si es necesario

import { Box, Typography, Button } from '@mui/material';
import { Favorite, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useHomeContent } from '../hooks/useHome';
import { ROUTES } from '../../../../app/config/constants';

export const HeroSection = () => {
  const navigate = useNavigate();
  const { data: homeContent } = useHomeContent();

  const handleExploreServices = () => {
    // NOTE: Navegar usando la URL del backend o fallback a SEARCH
    const link = homeContent?.hero.ctaLink || ROUTES.SEARCH;
    navigate(link);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '500px', md: '600px' }, // Altura fija en lugar de 100vh
        background: 'linear-gradient(180deg, #06b6d4 0%, #10b981 100%)', // Gradiente azul a verde
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: { xs: 3, md: 6 }, // Responsive padding
      }}
    >
      {/* NOTE: Ícono de corazón centrado */}
      <Box
        sx={{
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Favorite
          sx={{
            fontSize: { xs: 40, md: 60 },
            color: '#e0f2fe', // Color azul claro
          }}
        />
      </Box>

      {/* NOTE: Título principal */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          mb: 2,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        {homeContent?.hero.title || 'Tu Salud es Nuestra Prioridad'}
      </Typography>

      {/* NOTE: Subtítulo descriptivo */}
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: '1rem', md: '1.5rem' },
          color: 'white',
          textAlign: 'center',
          mb: 6,
          maxWidth: '800px',
          px: 2,
          opacity: 0.95,
        }}
      >
        {homeContent?.hero.subtitle || 'Encuentra médicos, farmacias, laboratorios y servicios de salud cerca de ti'}
      </Typography>

      {/* NOTE: Botón de llamada a la acción */}
      <Button
        variant="contained"
        size="large"
        onClick={handleExploreServices}
        endIcon={<ArrowForward />}
        sx={{
          backgroundColor: 'white',
          color: '#06b6d4',
          fontSize: { xs: '1rem', md: '1.25rem' },
          padding: { xs: '12px 24px', md: '16px 32px' },
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: '#f0f9ff',
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {homeContent?.hero.ctaText || 'Explora Nuestros Servicios'}
      </Button>
    </Box>
  );
};

