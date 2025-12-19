import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { IconMapper } from '../components/IconMapper';
import { useHomeContent, useFeatures, useFeaturedServices } from '../hooks/useHome';
import { ROUTES } from '../../../../app/config/constants';

export const HomePage = () => {
  const navigate = useNavigate();
  
  // NOTE: Obtener datos del backend usando hooks
  const { data: homeContent, isLoading: isLoadingContent } = useHomeContent();
  const { data: features, isLoading: isLoadingFeatures } = useFeatures();
  const { data: featuredServices, isLoading: isLoadingServices } = useFeaturedServices();

  // NOTE: Mostrar loading mientras se cargan los datos
  if (isLoadingContent || isLoadingFeatures) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleRegister = () => {
    navigate(homeContent?.joinSection.ctaLink || ROUTES.REGISTER);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sección Hero */}
      <HeroSection />

      {/* Sección de características (¿Por Qué Elegirnos?) */}
      {homeContent && features && (
        <Box sx={{ width: '100%', background: 'linear-gradient(180deg, #e0f2fe 0%, #f0fdfa 100%)', py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 } }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 2 }}>
              {homeContent.features.title}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, color: 'text.secondary', textAlign: 'center', mb: 6, maxWidth: '600px', mx: 'auto' }}>
              {homeContent.features.subtitle}
            </Typography>
            <Grid container spacing={3}>
              {features
                .sort((a, b) => a.order - b.order)
                .map((feature) => (
                  <Grid item xs={12} sm={6} md={3} key={feature.id}>
                    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)' } }}>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: 2, backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                          <IconMapper iconName={feature.icon} sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Sección de Servicios Destacados */}
      {homeContent && (
        <Box sx={{ width: '100%', backgroundColor: '#ffffff', py: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, backgroundColor: '#f97316', color: 'white', px: 3, py: 1, borderRadius: 3, mb: 3 }}>
            <Star sx={{ fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Servicios Destacados
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: 'text.primary', mb: 2 }}>
            {homeContent.featuredServices.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', mb: 4 }}>
            {homeContent.featuredServices.subtitle}
          </Typography>
          
          {/* TODO: Mostrar servicios destacados cuando vengan del backend */}
          {isLoadingServices ? (
            <CircularProgress size={24} />
          ) : featuredServices && featuredServices.length > 0 ? (
            <Box sx={{ mt: 4 }}>
              {/* Aquí irían los cards de servicios destacados */}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {featuredServices.length} servicios disponibles
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              🔄 Los anuncios rotan cada {homeContent.featuredServices.rotationInterval || 5} segundos
            </Typography>
          )}
        </Box>
      )}

      {/* Campo Adicional (antes del footer) */}
      {homeContent && (
        <Box sx={{ width: '100%', backgroundColor: '#f0fdfa', py: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 3 }}>
            {homeContent.joinSection.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            {homeContent.joinSection.subtitle}
          </Typography>
          <Button
            variant="contained"
            onClick={handleRegister}
            sx={{ backgroundColor: '#06b6d4', color: 'white', '&:hover': { backgroundColor: '#14b8a6' } }}
          >
            {homeContent.joinSection.ctaText}
          </Button>
        </Box>
      )}

      {/* Footer (sección de pie de página) */}
      {homeContent && (
        <Box sx={{ width: '100%', backgroundColor: '#1e3a8a', color: 'white', py: 6, px: 2, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2, fontSize: '0.75rem' }}>
            {homeContent.footer.copyright}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            {homeContent.footer.links.map((link, index) => (
              <Typography
                key={index}
                variant="body2"
                component="a"
                href={link.url}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
