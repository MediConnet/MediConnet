import { Box, Typography, Button } from '@mui/material';
import { Work } from '@mui/icons-material';

export const ProfessionalStatusCard = () => (
  <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 4 }}>
    <Typography fontWeight={700} mb={2}>
      ¿Eres profesional de salud?
    </Typography>

    <Box sx={{ backgroundColor: '#fef9c3', p: 3, borderRadius: 2 }}>
      <Typography fontWeight={600}>Kevin Ctat</Typography>
      <Typography color="text.secondary">Médico · En Revisión</Typography>
      <Typography mt={1}>
        Tu solicitud está siendo revisada por nuestro equipo.
      </Typography>
    </Box>

    <Button
      fullWidth
      sx={{ mt: 3, background: 'linear-gradient(90deg,#4f46e5,#9333ea)' }}
      variant="contained"
      startIcon={<Work />}
    >
      Solicitar habilitación para ofrecer servicios
    </Button>
  </Box>
);
