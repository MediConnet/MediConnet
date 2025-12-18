import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { LocationOn, AccessTime, Verified, Security, Star } from '@mui/icons-material';
import { HeroSection } from '../components/HeroSection';

export const HomePage = () => {
  // Definición de las características que se mostrarán en la sección "¿Por qué elegirnos?"
  const features = [
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Encuentra servicios cercanos',
      description: 'Localiza médicos, farmacias y laboratorios en tu zona',
    },
    {
      icon: <AccessTime sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Disponible 24/7',
      description: 'Accede a servicios de salud en cualquier momento',
    },
    {
      icon: <Verified sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Profesionales verificados',
      description: 'Todos nuestros proveedores están certificados',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Seguro y confiable',
      description: 'Tu información de salud está protegida',
    },
  ];

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sección Hero */}
      <HeroSection />

      {/* Sección de características (¿Por Qué Elegirnos?) */}
      <Box sx={{ width: '100%', background: 'linear-gradient(180deg, #e0f2fe 0%, #f0fdfa 100%)', py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 2 }}>
            ¿Por Qué Elegirnos?
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, color: 'text.secondary', textAlign: 'center', mb: 6, maxWidth: '600px', mx: 'auto' }}>
            La mejor plataforma para conectar con servicios de salud
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)' } }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: 2, backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                      {feature.icon}
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

      {/* Sección de Servicios Destacados */}
      <Box sx={{ width: '100%', backgroundColor: '#ffffff', py: 6, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, backgroundColor: '#f97316', color: 'white', px: 3, py: 1, borderRadius: 3, mb: 3 }}>
          <Star sx={{ fontSize: 20 }} />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Servicios Destacados
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: 'text.primary', mb: 2 }}>
          Profesionales Premium
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', mb: 4 }}>
          Servicios verificados con la mejor calidad y atención
        </Typography>
        
        {/* Información adicional (como los anuncios que rotan) */}
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          🔄 Los anuncios rotan cada 5 segundos
        </Typography>
      </Box>

      {/* Campo Adicional (antes del footer) */}
      <Box sx={{ width: '100%', backgroundColor: '#f0fdfa', py: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 3 }}>
          Únete a Medify
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          La plataforma que conecta a pacientes y profesionales de la salud
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#06b6d4', color: 'white', '&:hover': { backgroundColor: '#14b8a6' } }}>
          ¡Regístrate ahora!
        </Button>
      </Box>

      {/* Footer (sección de pie de página) */}
      <Box sx={{ width: '100%', backgroundColor: '#1e3a8a', color: 'white', py: 6, px: 2, textAlign: 'center' }}>
        {/* Aquí va el contenido del footer, como derechos de autor y enlaces */}
        <Typography variant="body1" sx={{ mb: 0, fontSize: '0.75rem' }}>
          Conectando salud y bienestar | Medify © 2025
        </Typography>
        {/* Enlaces a políticas y términos */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Typography variant="body2">Política de privacidad</Typography>
          <Typography variant="body2">Términos y condiciones</Typography>
        </Box>
      </Box>
    </Box>
  );
};
