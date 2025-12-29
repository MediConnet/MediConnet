import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Link,
  Alert,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack } from '@mui/icons-material';
import { useSendResetPassword } from '../hooks/useSendResetPassword';
import { ROUTES } from '../../../../app/config/constants';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const sendResetPassword = useSendResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      const response = await sendResetPassword.mutateAsync({ email });
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Ocurrió un error al enviar el enlace. Por favor intenta nuevamente.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f9ff',
        position: 'relative',
        overflow: 'hidden',
        m: 0,
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
          {/* Link de volver */}
          <Link
            component="button"
            onClick={() => navigate(ROUTES.HOME)}
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 3,
              color: '#64748b',
              fontSize: '0.875rem',
              textTransform: 'none',
              cursor: 'pointer',
              '&:hover': {
                color: '#1e293b',
              },
            }}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
            Volver al inicio de sesión
          </Link>

          {/* Título */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: '#1e293b',
              fontSize: '1.75rem',
            }}
          >
            Restablecer su contraseña
          </Typography>

          {/* Instrucciones */}
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              mb: 3,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
            }}
          >
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </Typography>

          {/* Mensaje de éxito */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Se ha enviado un enlace de restablecimiento a tu correo electrónico. Por favor revisa tu bandeja de entrada.
            </Alert>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              margin="normal"
              required
              disabled={success || sendResetPassword.isPending}
              error={!!error && !success}
              helperText={error && !success ? error : ''}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Botón de envío */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={success || sendResetPassword.isPending}
              sx={{
                py: 1.5,
                backgroundColor: '#1e293b',
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
                '&:hover': {
                  backgroundColor: '#334155',
                  boxShadow: '0 6px 16px rgba(30, 41, 59, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#cbd5e1',
                  color: '#94a3b8',
                },
              }}
            >
              {sendResetPassword.isPending ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

