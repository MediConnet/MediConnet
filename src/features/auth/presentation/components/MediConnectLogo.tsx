// NOTE: Componente del logo de MediConnect
// TODO: Reemplazar con el logo real cuando esté disponible

import { Box } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

export const MediConnectLogo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      {/* NOTE: Logo cuadrado con esquinas redondeadas y símbolo médico */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2.5,
          background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
        }}
      >
        <LocalHospital
          sx={{
            fontSize: 32,
            color: 'white',
          }}
        />
      </Box>
    </Box>
  );
};




