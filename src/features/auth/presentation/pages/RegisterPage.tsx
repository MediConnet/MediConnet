import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  InputAdornment, IconButton, Link, Alert
} from '@mui/material';
import {
  Person, Email, Lock, Visibility, VisibilityOff, ArrowBack
} from '@mui/icons-material';
import { MediConnectLogo } from '../components/MediConnectLogo';
import { ROUTES } from '../../../../app/config/constants';

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Estados LOCALES para la UI
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Manejar cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  // Simular envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validaciones visuales
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Por favor, completa todos los campos.');
      return;
    }
    if (formData.password.length < 6) {
        setFormError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    // Simulación de carga y éxito
    setIsLoading(true);
    
    // Esperamos 1.5 segundos para parecer real
    setTimeout(() => {
        setIsLoading(false);
        alert("¡Registro simulado exitoso! Redirigiendo al login...");
        navigate(ROUTES.LOGIN); // Te devuelve al login
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdfa 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(ROUTES.LOGIN)}
            sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
          >
            Volver al inicio de sesión
          </Button>

          <MediConnectLogo />
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
            Crea tu cuenta
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={4}>
            Regístrate para acceder a los servicios de salud
          </Typography>

          {/* Alerta de Error Local */}
          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#06b6d4',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                '&:hover': {
                  backgroundColor: '#0891b2',
                },
              }}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes una cuenta?{' '}
              <Link component={RouterLink} to={ROUTES.LOGIN} fontWeight={600} underline="hover" sx={{ color: '#06b6d4' }}>
                Inicia sesión
              </Link>
            </Typography>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};