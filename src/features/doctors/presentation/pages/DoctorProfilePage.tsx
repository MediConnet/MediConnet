// NOTE: Placeholder para la página de perfil público del doctor
// TODO: Implementar la página completa cuando sea necesario

import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const DoctorProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box p={4}>
      <Typography variant="h4">Perfil del Doctor</Typography>
      <Typography>ID: {id}</Typography>
      <Typography>Esta página está en desarrollo.</Typography>
    </Box>
  );
};

