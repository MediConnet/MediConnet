// NOTE: Placeholder para la página de lista de doctores por especialidad
// TODO: Implementar la página completa cuando sea necesario

import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const DoctorsListPage = () => {
  const { specialtyName } = useParams<{ specialtyName: string }>();

  return (
    <Box p={4}>
      <Typography variant="h4">Lista de Doctores</Typography>
      <Typography>Especialidad: {specialtyName}</Typography>
      <Typography>Esta página está en desarrollo.</Typography>
    </Box>
  );
};

