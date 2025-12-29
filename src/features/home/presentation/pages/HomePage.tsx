import { Box, Typography, Button, Card, CardContent, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LocalHospital, 
  LocalPharmacy, 
  Science, 
  LocalShipping, 
  Inventory,
  ArrowForward,
  CheckCircle,
  People,
  Bolt,
  Phone,
  Email,
  LocationOn,
  BarChart,
  Message,
  Campaign,
  Star,
  Shield
} from '@mui/icons-material';
import { ROUTES } from '../../../../app/config/constants';

export const HomePage = () => {
  const navigate = useNavigate();

  const serviceTypes = [
    {
      id: 'doctor',
      icon: <LocalHospital sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Médico',
      description: 'Consultas médicas, especialistas y atención personalizada',
    },
    {
      id: 'pharmacy',
      icon: <LocalPharmacy sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Farmacia',
      description: 'Venta de medicamentos y productos farmacéuticos',
    },
    {
      id: 'laboratory',
      icon: <Science sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Laboratorio',
      description: 'Análisis clínicos y estudios de laboratorio',
    },
    {
      id: 'ambulance',
      icon: <LocalShipping sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Ambulancia',
      description: 'Servicios de emergencia y transporte médico',
    },
    {
      id: 'supplies',
      icon: <Inventory sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Insumos Médicos',
      description: 'Equipos médicos, suministros y materiales',
    },
  ];

  const features = [
    {
      id: 'visibility',
      icon: <Phone sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Visibilidad en la App',
      description: 'Tu servicio aparecerá en la aplicación móvil donde miles de usuarios buscan atención médica.',
    },
    {
      id: 'dashboard',
      icon: <BarChart sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Panel de Control',
      description: 'Gestiona tu perfil, servicios, tarifas y disponibilidad desde un dashboard intuitivo.',
    },
    {
      id: 'contact',
      icon: <Message sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Contacto Directo',
      description: 'Los pacientes pueden contactarte directamente por WhatsApp para agendar citas.',
    },
    {
      id: 'promotions',
      icon: <Campaign sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Promociones',
      description: 'Crea anuncios y ofertas especiales que aparecerán destacados en la app.',
    },
    {
      id: 'geolocation',
      icon: <LocationOn sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Geolocalización',
      description: 'Los usuarios cercanos a tu ubicación te encontrarán fácilmente en el mapa.',
    },
    {
      id: 'reviews',
      icon: <Star sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Reseñas',
      description: 'Recibe valoraciones de tus pacientes y construye tu reputación profesional.',
    },
  ];

  const benefits = [
    {
      id: 'verification',
      icon: <Shield sx={{ fontSize: 32, color: '#10b981' }} />,
      title: 'Verificación',
      description: 'Servicios validados',
    },
    {
      id: 'users',
      icon: <People sx={{ fontSize: 32, color: '#10b981' }} />,
      title: '+10,000',
      description: 'Usuarios activos',
    },
    {
      id: 'fast',
      icon: <Bolt sx={{ fontSize: 32, color: '#f97316' }} />,
      title: 'Rápido',
      description: 'Registro en minutos',
    },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          textAlign: 'center',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Badge */}
        <Chip
          icon={<CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />}
          label="Plataforma de servicios médicos profesionales"
          sx={{
            mb: 4,
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            fontWeight: 500,
            fontSize: '0.875rem',
            height: '32px',
            '& .MuiChip-icon': {
              color: '#10b981',
            },
          }}
        />

        {/* Main Question */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            fontWeight: 700,
            mb: 3,
            color: '#1f2937',
            lineHeight: 1.2,
          }}
        >
          ¿Eres{' '}
          <Box component="span" sx={{ color: '#06b6d4' }}>
            médico, farmacia, laboratorio o ambulancia
          </Box>
          ?
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            color: '#6b7280',
            mb: 4,
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Publica tu servicio en <strong>MEDICONES</strong> y conecta con miles de pacientes que necesitan atención médica
        </Typography>

        {/* CTA Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate(ROUTES.REGISTER)}
            sx={{
              backgroundColor: '#06b6d4',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#0891b2',
              },
            }}
          >
            Solicitar registro de servicio
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.REGISTER)}
            sx={{
              borderColor: '#06b6d4',
              color: '#06b6d4',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#0891b2',
                backgroundColor: 'rgba(6, 182, 212, 0.04)',
              },
            }}
          >
            Ya tengo cuenta
          </Button>
        </Box>

        {/* Benefits Cards */}
        <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto', mb: 8 }}>
          {benefits.map((benefit) => (
            <Grid item xs={12} sm={4} key={benefit.id}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  borderRadius: 2,
                  height: '100%',
                  border: 'none',
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {benefit.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#1f2937',
                      fontSize: '1.125rem',
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Services Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#f9fafb',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto', textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: '#1f2937',
            }}
          >
            Servicios que puedes{' '}
            <Box component="span" sx={{ color: '#06b6d4' }}>
              registrar
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#6b7280',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Selecciona el tipo de servicio que ofreces y comienza a recibir pacientes
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {serviceTypes.map((service) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={service.id}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: '#1f2937',
                        fontSize: '1.125rem',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        flex: 1,
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate(ROUTES.REGISTER)}
            sx={{
              backgroundColor: '#06b6d4',
              color: 'white',
              px: 6,
              py: 1.5,
              fontSize: '1.125rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#0891b2',
              },
            }}
          >
            Comenzar registro →
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto', textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: '#1f2937',
            }}
          >
            Todo lo que necesitas para{' '}
            <Box component="span" sx={{ color: '#06b6d4' }}>
              crecer
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#6b7280',
              mb: 6,
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            MEDICONES te ofrece las herramientas para gestionar y promocionar tus servicios médicos de forma profesional
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.id}>
                <Card
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: '#1f2937',
                        fontSize: '1.25rem',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        flex: 1,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#1e293b',
          color: 'white',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
                    M
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                  MEDICONES
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#cbd5e1',
                  mb: 3,
                  lineHeight: 1.6,
                  fontSize: '0.9375rem',
                }}
              >
                La plataforma que conecta profesionales de la salud con pacientes que necesitan atención médica de calidad.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 18, color: '#94a3b8' }} />
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    contacto@medicones.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 18, color: '#94a3b8' }} />
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    +1 234 567 890
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 18, color: '#94a3b8' }} />
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Ciudad, País
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Platform Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'white',
                  fontSize: '1.125rem',
                }}
              >
                Plataforma
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['Para Médicos', 'Para Farmacias', 'Para Laboratorios', 'Para Ambulancias'].map(
                  (link) => (
                    <Typography
                      key={link}
                      sx={{
                        color: '#cbd5e1',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'white',
                        },
                      }}
                    >
                      {link}
                    </Typography>
                  )
                )}
              </Box>
            </Grid>

            {/* Legal Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'white',
                  fontSize: '1.125rem',
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['Términos de Servicio', 'Política de Privacidad', 'Aviso Legal'].map((link) => (
                  <Typography
                    key={link}
                    sx={{
                      color: '#cbd5e1',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid #334155',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              © 2025 MEDICONES. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
