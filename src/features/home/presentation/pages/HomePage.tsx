import { Box, Typography, Button, Card, CardContent, Grid, Chip, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LocalHospital, 
  LocalPharmacy, 
  Science, 
  LocalShipping, 
  Inventory,
  ArrowForward,
  People,
  Bolt,
  Phone,
  Email,
  LocationOn,
  BarChart,
  Message,
  Campaign,
  Star,
  Shield,
  Smartphone,
} from '@mui/icons-material';
import { ROUTES } from '../../../../app/config/constants';

type ServiceType = 'doctor' | 'pharmacy' | 'lab' | 'ambulance' | 'supplies';

const serviceTypes: ServiceType[] = ['doctor', 'pharmacy', 'lab', 'ambulance', 'supplies'];

const serviceLabels: Record<ServiceType, string> = {
  doctor: 'Médico',
  pharmacy: 'Farmacia',
  lab: 'Laboratorio',
  ambulance: 'Ambulancia',
  supplies: 'Insumos Médicos',
};

const serviceDescriptions: Record<ServiceType, string> = {
  doctor: 'Consultas médicas, especialistas y atención personalizada',
  pharmacy: 'Venta de medicamentos y productos de salud',
  lab: 'Análisis clínicos y estudios de laboratorio',
  ambulance: 'Servicios de emergencia y traslados médicos',
  supplies: 'Equipos médicos, suministros y material sanitario',
};

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  doctor: <LocalHospital sx={{ fontSize: 32 }} />,
  pharmacy: <LocalPharmacy sx={{ fontSize: 32 }} />,
  lab: <Science sx={{ fontSize: 32 }} />,
  ambulance: <LocalShipping sx={{ fontSize: 32 }} />,
  supplies: <Inventory sx={{ fontSize: 32 }} />,
};

const features = [
  {
    icon: <Smartphone sx={{ fontSize: 28 }} />,
    title: 'Visibilidad en la App',
    description: 'Tu servicio aparecerá en la aplicación móvil donde miles de usuarios buscan atención médica.',
  },
  {
    icon: <BarChart sx={{ fontSize: 28 }} />,
    title: 'Panel de Control',
    description: 'Gestiona tu perfil, servicios, tarifas y disponibilidad desde un dashboard intuitivo.',
  },
  {
    icon: <Message sx={{ fontSize: 28 }} />,
    title: 'Contacto Directo',
    description: 'Los pacientes pueden contactarte directamente por WhatsApp para agendar citas.',
  },
  {
    icon: <Campaign sx={{ fontSize: 28 }} />,
    title: 'Promociones',
    description: 'Crea anuncios y ofertas especiales que aparecerán destacados en la app.',
  },
  {
    icon: <LocationOn sx={{ fontSize: 28 }} />,
    title: 'Geolocalización',
    description: 'Los usuarios cercanos a tu ubicación te encontrarán fácilmente en el mapa.',
  },
  {
    icon: <Star sx={{ fontSize: 28 }} />,
    title: 'Reseñas',
    description: 'Recibe valoraciones de tus pacientes y construye tu reputación profesional.',
  },
];

export const HomePage = () => {
  const navigate = useNavigate();

  const handleServiceTypeClick = (type: ServiceType) => {
    navigate(`${ROUTES.REGISTER}?tipo=${type}`);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '80vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
        }}
      >
        {/* Background Effects */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: { xs: '300px', md: '600px' },
            height: { xs: '300px', md: '600px' },
            background: 'rgba(6, 182, 212, 0.05)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            transform: 'translate(33%, -50%)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: { xs: '250px', md: '400px' },
            height: { xs: '250px', md: '400px' },
            background: 'rgba(6, 182, 212, 0.05)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            transform: 'translate(-33%, 50%)',
            zIndex: 0,
          }}
        />

        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '20%', md: '25%' },
            left: { xs: '10%', md: '20%' },
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: 2,
            transform: 'rotate(12deg)',
            display: { xs: 'none', lg: 'block' },
            zIndex: 1,
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) rotate(12deg)' },
              '50%': { transform: 'translateY(-20px) rotate(12deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '30%', md: '40%' },
            right: { xs: '15%', md: '32%' },
            width: { xs: 50, md: 64 },
            height: { xs: 50, md: 64 },
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '50%',
            display: { xs: 'none', lg: 'block' },
            zIndex: 1,
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: { xs: '10%', md: '20%' },
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 },
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 1.5,
            transform: 'rotate(-12deg)',
            display: { xs: 'none', lg: 'block' },
            zIndex: 1,
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />

        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <Chip
            icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }} />}
            label="Plataforma de servicios médicos profesionales"
            sx={{
              mb: 4,
              backgroundColor: 'rgba(236, 253, 245, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              color: '#065f46',
              fontWeight: 500,
              fontSize: '0.875rem',
              height: '36px',
              px: 2,
              animation: 'fadeIn 0.8s ease-in',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(-10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          />

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
              fontWeight: 700,
              mb: 3,
              color: '#1f2937',
              lineHeight: 1.2,
              animation: 'slideUp 0.8s ease-out',
              '@keyframes slideUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            ¿Eres{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              médico, farmacia, laboratorio
            </Box>
            {' '}o{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ambulancia
            </Box>
            ?
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.5rem' },
              color: '#6b7280',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              animation: 'slideUp 0.8s ease-out 0.2s both',
            }}
          >
            Publica tu servicio en <strong style={{ color: '#1f2937' }}>MEDICONES</strong> y conecta con miles de pacientes que necesitan atención médica
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mb: 8,
              animation: 'slideUp 0.8s ease-out 0.4s both',
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForward sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'translateX(4px)' } }} />}
              onClick={() => navigate(ROUTES.REGISTER)}
              sx={{
                backgroundColor: '#06b6d4',
                color: 'white',
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#0891b2',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              Solicitar registro de servicio
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.LOGIN)}
              sx={{
                borderColor: '#06b6d4',
                color: '#06b6d4',
                px: 5,
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

          {/* Trust Indicators */}
          <Grid
            container
            spacing={3}
            sx={{
              maxWidth: '900px',
              mx: 'auto',
              animation: 'fadeIn 0.8s ease-out 0.6s both',
            }}
          >
            {[
              {
                icon: <Shield sx={{ fontSize: 24, color: '#06b6d4' }} />,
                title: 'Verificación',
                description: 'Servicios validados',
                bgColor: 'rgba(6, 182, 212, 0.1)',
              },
              {
                icon: <People sx={{ fontSize: 24, color: '#22c55e' }} />,
                title: '+10,000',
                description: 'Usuarios activos',
                bgColor: 'rgba(34, 197, 94, 0.1)',
              },
              {
                icon: <Bolt sx={{ fontSize: 24, color: '#f97316' }} />,
                title: 'Rápido',
                description: 'Registro en minutos',
                bgColor: 'rgba(249, 115, 22, 0.1)',
              },
            ].map((benefit, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: benefit.bgColor,
                      flexShrink: 0,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Service Types Section */}
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
            Servicios que puedes{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
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

          <Grid
            container
            spacing={3}
            sx={{
              mb: 6,
              '& > .MuiGrid-item': {
                animation: 'slideUp 0.6s ease-out',
                '@keyframes slideUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              },
            }}
          >
            {serviceTypes.map((type, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2.4}
                key={type}
                sx={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <Card
                  onClick={() => handleServiceTypeClick(type)}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    background: '#f8fffd',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: 6,
                      borderColor: '#06b6d4',
                      '& .service-icon': {
                        backgroundColor: '#06b6d4',
                        color: 'white',
                        transform: 'scale(1.1)',
                      },
                },
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      className="service-icon"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        mx: 'auto',
                        mb: 3,
                        color: '#06b6d4',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {serviceIcons[type]}
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
                      {serviceLabels[type]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        flex: 1,
                        lineHeight: 1.5,
                      }}
                    >
                      {serviceDescriptions[type]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            endIcon={<ArrowForward sx={{ transition: 'transform 0.3s' }} />}
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
                '& .MuiSvgIcon-root': {
                  transform: 'translateX(4px)',
                },
              },
            }}
          >
            Comenzar registro
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        id="beneficios"
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: 'rgba(236, 253, 245, 0.3)',
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
            Todo lo que necesitas para{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
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
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Card
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: `${index * 0.1}s`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        mx: 'auto',
                        mb: 3,
                        color: '#06b6d4',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: '#1f2937',
                        fontSize: '1.125rem',
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
        id="contacto"
        sx={{
          width: '100%',
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          backgroundColor: '#1f2937',
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 3,
                  maxWidth: '400px',
                  lineHeight: 1.6,
                  fontSize: '0.9375rem',
                }}
              >
                La plataforma que conecta profesionales de la salud con pacientes que necesitan atención médica de calidad.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Email sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: '0.875rem' }}>contacto@medicones.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Phone sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: '0.875rem' }}>+593 23 456 456</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <LocationOn sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: '0.875rem' }}>Ciudad, País</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Platform Links */}
            <Grid item xs={12} sm={6} md={3}>
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
                {['Para Médicos', 'Para Farmacias', 'Para Laboratorios', 'Para Ambulancias', 'Para Insumos Médicos'].map((link) => (
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

            {/* Legal Links */}
            <Grid item xs={12} sm={6} md={3}>
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
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} MEDICONES. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
