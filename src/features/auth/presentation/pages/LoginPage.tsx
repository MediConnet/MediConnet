// NOTE: Página de login con Material UI
// TODO: Integrar con backend cuando esté listo
// TODO: Agregar validación de formulario más robusta

import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  CalendarToday,
  Email as EmailIcon,
  Favorite,
  Google as GoogleIcon,
  LocalHospital,
  LocalShipping,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useAuthStore } from '../../../../app/store/auth.store';
import { MediConnectLogo } from '../components/MediConnectLogo';
import { ROUTES } from '../../../../app/config/constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Recuperamos el store mock
  const authStore = useAuthStore();

  // 2. Estados LOCALES para la UI
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulamos llamada (delay de 1 segundo)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && password) {
        // Usamos el método login del mock
        authStore.login(
          {
            id: "1",
            email: email,
            name: "Usuario Prueba",
            role: "patient",
          },
          "mock-token"
        );

        navigate(from, { replace: true });
      } else {
        throw new Error("Faltan datos");
      }
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar autenticación con Google real
    console.log("Google login clicked");
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
        position: 'relative',
        overflow: 'hidden',
        m: 0,
        p: { xs: 1.5, sm: 2, md: 3 },
        boxSizing: 'border-box',
      }}
    >
      {/* NOTE: Patrón de cuadrícula de fondo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: { xs: '30px 30px', sm: '40px 40px' },
        }}
      />

      {/* NOTE: Iconos médicos flotantes animados en el fondo - ocultos en móviles muy pequeños */}
      <LocalHospital
        sx={{
          position: 'absolute',
          top: { xs: '5%', sm: '10%' },
          left: { xs: '5%', sm: '10%' },
          fontSize: { xs: 40, sm: 60, md: 80 },
          color: 'rgba(20, 184, 166, 0.12)',
          animation: 'float 6s ease-in-out infinite',
          display: { xs: 'none', sm: 'block' },
        }}
      />
      <Favorite
        sx={{
          position: 'absolute',
          top: { xs: '8%', sm: '15%' },
          right: { xs: '5%', sm: '10%' },
          fontSize: { xs: 30, sm: 45, md: 60 },
          color: 'rgba(20, 184, 166, 0.12)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
          display: { xs: 'none', sm: 'block' },
        }}
      />
      <LocalShipping
        sx={{
          position: 'absolute',
          bottom: { xs: '10%', sm: '15%' },
          left: { xs: '5%', sm: '8%' },
          fontSize: { xs: 35, sm: 50, md: 70 },
          color: 'rgba(20, 184, 166, 0.12)',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '2s',
          display: { xs: 'none', sm: 'block' },
        }}
      />
      <CalendarToday
        sx={{
          position: 'absolute',
          bottom: { xs: '8%', sm: '10%' },
          right: { xs: '5%', sm: '12%' },
          fontSize: { xs: 32, sm: 48, md: 65 },
          color: 'rgba(20, 184, 166, 0.12)',
          animation: 'float 9s ease-in-out infinite',
          animationDelay: '0.5s',
          display: { xs: 'none', sm: 'block' },
        }}
      />

      <Card
        sx={{
          maxWidth: { xs: '100%', sm: 420, md: 450 },
          width: '100%',
          maxHeight: '95vh',
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: { xs: '0 10px 40px rgba(0, 0, 0, 0.1)', sm: '0 20px 60px rgba(0, 0, 0, 0.1)' },
          position: 'relative',
          zIndex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } } }}>
          {/* NOTE: Logo de MediConnect */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0.75, sm: 1 } }}>
            <MediConnectLogo />
          </Box>

          {/* NOTE: Título de bienvenida */}
          <Typography 
            variant="h5" 
            component="h1" 
            align="center" 
            gutterBottom 
            sx={{ fontWeight: 600, mb: 0.25, color: 'text.primary', fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' } }}
          >
            Bienvenido a
          </Typography>
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              mb: { xs: 0.25, sm: 0.5 },
              fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' }, 
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MediConnect
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: { xs: 1.25, sm: 1.5 }, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}>
            Inicia sesión para continuar
          </Typography>

          {/* NOTE: Botón de Google */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              mb: { xs: 0.75, sm: 1 },
              py: { xs: 0.625, sm: 0.75 },
              borderColor: 'grey.300',
              color: 'text.primary',
              textTransform: 'none',
              borderRadius: 2,
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              '&:hover': {
                borderColor: 'grey.400',
                bgcolor: 'grey.50',
              },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: 14, sm: 16 },
              },
            }}
          >
            Continuar con Google
          </Button>

          {/* NOTE: Separador circular */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: { xs: 0.75, sm: 1 } }}>
            <Box
              sx={{
                width: { xs: 4, sm: 5 },
                height: { xs: 4, sm: 5 },
                borderRadius: '50%',
                bgcolor: 'grey.300',
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* NOTE: Formulario de login */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              margin="dense"
              required
              error={!!error}
              sx={{ mb: 0.75 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'grey.500', fontSize: { xs: 16, sm: 18 } }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.8125rem', sm: '0.875rem' } },
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              margin="dense"
              required
              error={!!error}
              helperText={error}
              sx={{ mb: 0.75 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'grey.500', fontSize: { xs: 16, sm: 18 } }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } } }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.8125rem', sm: '0.875rem' } },
              }}
            />

            {/* NOTE: Recordarme y Olvidé contraseña */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 0.5, sm: 0 }, mt: 0.5, mb: { xs: 1.25, sm: 1.5 } }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}>
                    Recordarme
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              <Link
                component={RouterLink}
                to={ROUTES.FORGOT_PASSWORD}
                underline="hover"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.8125rem' }, 
                  color: 'primary.main',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            {/* NOTE: Botón de login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 0.5,
                mb: { xs: 1.25, sm: 1.5 },
                py: { xs: 0.875, sm: 1 },
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                textTransform: 'none',
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                fontWeight: 600,
                borderRadius: 2,
                color: "white",
                boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
                  boxShadow: "0 6px 16px rgba(20, 184, 166, 0.4)",
                },
                "&:disabled": {
                  background: "grey.300",
                },
              }}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </Box>

          {/* NOTE: Link de registro */}
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: { xs: 1.25, sm: 1.5 }, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}>
            ¿No tienes cuenta?{' '}
            <Link
              component={RouterLink}
              to="/register"
              underline="always"
              sx={{
                color: "#14b8a6",
                fontWeight: 700,
                textDecorationColor: '#14b8a6',
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              }}
            >
              Regístrate gratis
            </Link>
          </Typography>

          {/* NOTE: Botones de categorías */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.625, sm: 0.75 }, justifyContent: 'center', mt: { xs: 0.5, sm: 0 } }}>
            {/* Botón Médicos */}
            <Button
              variant="contained"
              startIcon={<LocalHospital />}
              sx={{
                flex: { xs: 'none', sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                py: { xs: 0.625, sm: 0.75 },
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
                },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: 14, sm: 16 },
                },
              }}
            >
              Médicos
            </Button>

            {/* Botón Citas */}
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              sx={{
                flex: { xs: 'none', sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                py: { xs: 0.625, sm: 0.75 },
                borderColor: '#14b8a6',
                color: '#14b8a6',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                fontWeight: 600,
                bgcolor: "white",
                "&:hover": {
                  borderColor: "#0d9488",
                  bgcolor: "#f0fdfa",
                },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: 14, sm: 16 },
                },
              }}
            >
              Citas
            </Button>

            {/* Botón Ambulancias */}
            <Button
              variant="contained"
              startIcon={<LocalShipping />}
              sx={{
                flex: { xs: 'none', sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                py: { xs: 0.625, sm: 0.75 },
                background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: 14, sm: 16 },
                },
              }}
            >
              Ambulancias
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
