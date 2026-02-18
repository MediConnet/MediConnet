import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Send, Email } from '@mui/icons-material';
import { env } from '../../app/config/env';

interface SendEmailFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SendEmailForm: React.FC<SendEmailFormProps> = ({
  onSuccess,
  onError,
}) => {
  // Estado para los campos del formulario
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Enviar los datos al backend usando Axios
      const response = await axios.post(`${env.API_URL}/send-email`, {
        from,
        to,
        subject,
        htmlContent,
      });

      // Si el correo se envía exitosamente
      const successMessage = 'Correo enviado exitosamente!';
      setMessage({ type: 'success', text: successMessage });
      
      // Limpiar el formulario
      setFrom('');
      setTo('');
      setSubject('');
      setHtmlContent('');
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      // Si ocurre un error
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error al enviar el correo. Por favor, intenta nuevamente.';
      setMessage({ type: 'error', text: errorMessage });
      
      // Llamar callback de error si existe
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <Box mb={3}>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Email sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>
            Formulario de Envío de Correo
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Completa los campos para enviar un correo electrónico
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Remitente */}
          <TextField
            label="Remitente (From)"
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            fullWidth
            placeholder="ejemplo@correo.com"
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          {/* Destinatario */}
          <TextField
            label="Destinatario (To)"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            fullWidth
            placeholder="destinatario@correo.com"
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          {/* Asunto */}
          <TextField
            label="Asunto (Subject)"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            fullWidth
            placeholder="Asunto del correo"
          />

          {/* Contenido HTML */}
          <TextField
            label="Contenido HTML"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            required
            fullWidth
            multiline
            rows={8}
            placeholder="<h1>Título</h1><p>Contenido del correo en HTML...</p>"
            helperText="Ingresa el contenido del correo en formato HTML"
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              },
            }}
          />

          {/* Mensaje de éxito o error */}
          {message && (
            <Alert 
              severity={message.type} 
              onClose={() => setMessage(null)}
              sx={{ mt: 1 }}
            >
              {message.text}
            </Alert>
          )}

          {/* Botón de envío */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            disabled={loading}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Correo'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default SendEmailForm;
