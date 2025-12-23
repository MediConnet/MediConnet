import { Box, Typography, Button } from '@mui/material';
import { Description, Add } from '@mui/icons-material';

export const MedicalHistoryEmpty = () => (
  <Box sx={card}>
    <Description sx={{ fontSize: 64, color: '#cbd5e1' }} />
    <Typography fontWeight={600} mt={2}>
      No hay registros médicos aún
    </Typography>
    <Typography color="text.secondary">
      Agrega tus antecedentes y datos importantes
    </Typography>
    <Button startIcon={<Add />} sx={{ mt: 2 }} variant="contained">
     Agregar Registro
    </Button>
  </Box>
);

const card = {
  backgroundColor: 'white',
  borderRadius: 2,
  p: 6,
  textAlign: 'center',
};
