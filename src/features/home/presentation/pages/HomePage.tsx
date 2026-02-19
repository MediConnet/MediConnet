import { Box, Typography, Button, Card, CardContent, Grid, Chip, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LocalHospital, 
  LocalPharmacy, 
  Science, 
  LocalShipping, 
  Inventory,
  Download,
  PersonAdd,
  Search,
  CalendarToday,
  CheckCircle,
  LocationOn,
  AccessTime,
  Star,
  Phone,
  Email,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Favorite,
  VerifiedUser,
  Lock,
  Description,
  Shield,
} from '@mui/icons-material';
import { ROUTES } from '../../../../app/config/constants';

// App Store Icon Component (Apple Logo)
const AppStoreIcon = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', width: 20, height: 20 }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  </Box>
);

// Google Play Icon Component
const GooglePlayIcon = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', width: 20, height: 20 }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L16.67,15.47L14.54,13.34L18.23,12L14.54,10.66L16.67,8.53L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
    </svg>
  </Box>
);

export const HomePage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 'auto', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 6, md: 12 },
          px: { xs: 3, md: 6 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Left Side - Text Content */}
          <Box sx={{ flex: 1, zIndex: 2 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 700,
                mb: 3,
                color: '#1f2937',
                lineHeight: 1.2,
              }}
            >
              Una app que conecta personas con servicios de salud de forma{' '}
              <Box component="span" sx={{ color: '#06b6d4' }}>
                rápida, segura y sencilla
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: '#6b7280',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Encuentra médicos independientes y servicios de salud cercanos, agenda citas o contacta directamente desde tu celular.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 4,
              }}
            >
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => navigate(ROUTES.HOME)}
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
                Descargar la App
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonAdd />}
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
                Publicar mi servicio
              </Button>
            </Box>
          </Box>

          {/* Right Side - Image */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?w=1080&q=80"
              alt="Healthcare professional"
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: 3,
                objectFit: 'cover',
              }}
            />
            {/* Overlay Card */}
            <Card
              sx={{
                position: 'absolute',
                top: { xs: 16, md: 24 },
                right: { xs: 16, md: 24 },
                backgroundColor: 'white',
                borderRadius: 2,
                p: 2,
                boxShadow: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>
                Profesionales verificados
              </Typography>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* How It Works Section */}
      <Box
        id="como-funciona"
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#f9fafb',
          scrollMarginTop: '80px',
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
            ¿Cómo funciona?
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
            Conectamos personas con servicios de salud de manera simple y efectiva
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column - For Users */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: '#e0f2fe',
                  borderRadius: 3,
                  border: '2px solid #06b6d4',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    mb: 4,
                    color: '#1f2937',
                    textAlign: 'center',
                  }}
                >
                  Para usuarios
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    {
                      icon: <Download sx={{ fontSize: 32, color: '#06b6d4' }} />,
                      title: 'Descarga la app',
                      description: 'Disponible en Google Play y App Store',
                    },
                    {
                      icon: <Search sx={{ fontSize: 32, color: '#06b6d4' }} />,
                      title: 'Busca un médico o servicio',
                      description: 'Encuentra profesionales cerca de ti',
                    },
                    {
                      icon: <CalendarToday sx={{ fontSize: 32, color: '#06b6d4' }} />,
                      title: 'Agenda o contacta',
                      description: 'Reserva citas médicas o contacta directamente',
                    },
                  ].map((step, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, mb: 0.5, color: '#1f2937' }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Right Column - For Professionals */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: '#dcfce7',
                  borderRadius: 3,
                  border: '2px solid #22c55e',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    mb: 4,
                    color: '#1f2937',
                    textAlign: 'center',
                  }}
                >
                  Para profesionales y servicios
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    {
                      icon: <PersonAdd sx={{ fontSize: 32, color: '#22c55e' }} />,
                      title: 'Regístrate en la web',
                      description: 'Completa tu perfil profesional',
                    },
                    {
                      icon: <Description sx={{ fontSize: 32, color: '#22c55e' }} />,
                      title: 'Publica tu perfil',
                      description: 'Configura horarios y servicios',
                    },
                    {
                      icon: <CheckCircle sx={{ fontSize: 32, color: '#22c55e' }} />,
                      title: 'Conecta con usuarios',
                      description: 'Recibe solicitudes desde la app',
                    },
                  ].map((step, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, mb: 0.5, color: '#1f2937' }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Services Section */}
      <Box
        id="servicios"
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#ffffff',
          scrollMarginTop: '80px',
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
            Servicios disponibles
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
            Explora las categorías de servicios de salud que conectamos
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: <LocalHospital sx={{ fontSize: 40 }} />,
                title: 'Médicos independientes',
                description: 'Agenda citas y pagos desde la app',
                color: '#06b6d4',
                borderColor: '#06b6d4',
              },
              {
                icon: <LocalHospital sx={{ fontSize: 40 }} />,
                title: 'Clínicas',
                description: 'Administra médicos, agenda centralizada y recepción',
                color: '#14b8a6',
                borderColor: '#14b8a6',
              },
              {
                icon: <LocalPharmacy sx={{ fontSize: 40 }} />,
                title: 'Farmacias',
                description: 'Directorio informativo con contacto y ubicación',
                color: '#22c55e',
                borderColor: '#22c55e',
              },
              {
                icon: <Science sx={{ fontSize: 40 }} />,
                title: 'Laboratorios',
                description: 'Servicios de exámenes y contacto directo',
                color: '#a855f7',
                borderColor: '#a855f7',
              },
              {
                icon: <LocalShipping sx={{ fontSize: 40 }} />,
                title: 'Ambulancias',
                description: 'Servicios de emergencia y cobertura',
                color: '#ef4444',
                borderColor: '#ef4444',
              },
              {
                icon: <Inventory sx={{ fontSize: 40 }} />,
                title: 'Insumos médicos y tiendas',
                description: 'Productos y servicios informativos',
                color: '#f97316',
                borderColor: '#f97316',
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                    border: `2px solid ${service.borderColor}`,
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: `${service.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: service.color,
                    }}
                  >
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
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {service.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 6,
              p: 3,
              backgroundColor: '#e0f2fe',
              borderRadius: 2,
              maxWidth: '800px',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: '1.5rem' }}>💡</Typography>
            </Box>
            <Typography sx={{ color: '#1f2937', fontSize: '0.9375rem' }}>
              Nota: Algunos servicios permiten agendar citas médicas desde la app
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Featured Services Section */}
      <Box
        id="destacados"
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#f9fafb',
          scrollMarginTop: '80px',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Chip
            label="Destacados"
            sx={{
              backgroundColor: '#fbbf24',
              color: 'white',
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: '#1f2937',
            }}
          >
            Servicios destacados de la semana
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#6b7280',
              mb: 6,
            }}
          >
            Servicios de salud verificados y recomendados
          </Typography>

          <Grid container spacing={3}>
            {[
            {
              image: 'https://images.unsplash.com/photo-1767449441925-737379bc2c4d?w=1080&q=80',
              title: 'Centro Médico Integral',
              category: 'Clínica General',
              location: 'Ciudad Central',
              hours: '24/7',
              rating: 4.8,
            },
            {
              image: 'https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=1080&q=80',
              title: 'Farmacia Salud Plus',
              category: 'Farmacia',
              location: 'Zona Norte',
              hours: 'L-S: 8am-10pm',
              rating: 4.9,
            },
            {
              image: 'https://images.unsplash.com/photo-1614308456595-a59d48697ea8?w=1080&q=80',
              title: 'Laboratorio Clínico Moderna',
              category: 'Laboratorio',
              location: 'Zona Este',
              hours: 'L-V: 7am-5pm',
              rating: 4.7,
            },
            ].map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Chip
                    label="Destacado"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 2,
                      backgroundColor: '#fbbf24',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Box
                    component="img"
                    src={service.image}
                    alt={service.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250?text=Imagen+no+disponible';
                    }}
                    sx={{
                      width: '100%',
                      height: { xs: 200, md: 250 },
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
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
                        color: '#06b6d4',
                        mb: 2,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      {service.category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {service.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 18, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {service.hours}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
                        <Typography variant="body2" sx={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: 500 }}>
                          {service.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="body2"
            sx={{
              mt: 4,
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontStyle: 'italic',
            }}
          >
            * Los servicios destacados aparecen de forma rotativa y están sujetos a disponibilidad
          </Typography>
        </Box>
      </Box>

      {/* App Download Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#1e3a8a',
          color: 'white',
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                color: 'white',
              }}
            >
              Toda la experiencia completa está en nuestra app móvil
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Descarga la app y accede a todos los servicios de salud en la palma de tu mano
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {[
                { icon: <CalendarToday />, title: 'Agenda citas médicas', subtitle: 'Reserva en tiempo real' },
                { icon: <CheckCircle />, title: 'Elige forma de pago', subtitle: 'Online o presencial' },
                { icon: <LocationOn />, title: 'Encuentra servicios cercanos', subtitle: 'Ubicación en tiempo real' },
                { icon: <AccessTime />, title: 'Horarios actualizados', subtitle: 'Disponibilidad inmediata' },
              ].map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ color: '#06b6d4', mt: 0.5 }}>{feature.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, mb: 0.5, color: 'white' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {feature.subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography sx={{ mb: 2, color: 'white', fontWeight: 500 }}>
                Descarga ahora:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<AppStoreIcon />}
                  sx={{             
                    backgroundColor: 'black',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#1f2937' },
                  }}
                >
                  App Store
                </Button>
                <Button
                  variant="contained"
                  startIcon={<GooglePlayIcon />}
                  sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#f3f4f6' },
                  }}
                >
                  Google Play
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src="/imagenApp.png"
              alt="App móvil MediConnet"
              sx={{
                width: { xs: '100%', sm: '80%', md: '100%' },
                maxWidth: { xs: '300px', md: '500px' },
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Trust and Security Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto', textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Shield sx={{ fontSize: 40, color: '#22c55e' }} />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: '#1f2937',
            }}
          >
            Confianza y seguridad
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
            Todos los perfiles pasan por un proceso de revisión y aprobación para garantizar información real y confiable
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <Shield sx={{ fontSize: 32, color: '#22c55e' }} />,
                title: 'Verificación rigurosa',
                description: 'Todos los perfiles son revisados antes de publicarse',
              },
              {
                icon: <VerifiedUser sx={{ fontSize: 32, color: '#22c55e' }} />,
                title: 'Información verificada',
                description: 'Garantizamos datos reales y actualizados',
              },
              {
                icon: <Lock sx={{ fontSize: 32, color: '#22c55e' }} />,
                title: 'Seguridad',
                description: 'Tus datos están protegidos y encriptados',
              },
              {
                icon: <Description sx={{ fontSize: 32, color: '#22c55e' }} />,
                title: 'Proceso de aprobación',
                description: 'Cada solicitud es evaluada por nuestro equipo',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#1f2937',
                      fontSize: '1rem',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {item.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        id="contacto"
        sx={{
          width: '100%',
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#1e3a8a',
          color: 'white',
          scrollMarginTop: '80px',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid container spacing={4}>
            {/* Brand */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  component="img"
                  src="/docalink-logo.png"
                  alt="DOCALINK"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    objectFit: 'contain',
                  }}
                />
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                  DOCALINK
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 3,
                  maxWidth: '400px',
                  lineHeight: 1.6,
                  fontSize: '0.9375rem',
                }}
              >
                Un puente inteligente entre personas y servicios de salud
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                Enlaces rápidos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['Inicio', 'Cómo funciona', 'Servicios', 'Para profesionales'].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link === 'Inicio') navigate(ROUTES.HOME);
                      else if (link === 'Cómo funciona') scrollToSection('como-funciona');
                      else if (link === 'Servicios') scrollToSection('servicios');
                      else if (link === 'Para profesionales') navigate(ROUTES.REGISTER);
                    }}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Legal */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['Términos y condiciones', 'Política de privacidad', 'Política de cookies', 'Aviso legal'].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                Contacto
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Email sx={{ fontSize: 18 }} />
                  <Link
                    href="mailto:contacto@saludconnect.com"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' },
                    }}
                  >
                    contacto@saludconnect.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Phone sx={{ fontSize: 18 }} />
                  <Link
                    href="tel:+593991234567"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' },
                    }}
                  >
                    +593 99 123 4567
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <LocationOn sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: '0.875rem' }}>Quito, Ecuador</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
              © 2026 DOCALINK. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                <Facebook />
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                <Twitter />
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                <Instagram />
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                <LinkedIn />
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
