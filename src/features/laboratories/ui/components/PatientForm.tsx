import { Box, TextField, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuthStore } from '../../../../app/store/auth.store';

export const PatientForm = () => {
  const authStore = useAuthStore();
  const user = authStore.user;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          Datos del paciente
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Nombre completo *"
        margin="normal"
        required
        defaultValue={user?.name || ''}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Teléfono de contacto *"
        margin="normal"
        required
        type="tel"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Síntomas o motivo de consulta *"
        margin="normal"
        required
        multiline
        rows={3}
        placeholder="Describe tus síntomas o el motivo de la consulta..."
      />
    </Box>
  );
};
