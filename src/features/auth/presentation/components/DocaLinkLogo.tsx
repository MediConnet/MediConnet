// NOTE: Componente del logo de DOCALINK
// Logo oficial de la aplicación

import { Box } from '@mui/material';

export const DocaLinkLogo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      {/* NOTE: Logo oficial de DOCALINK */}
      <Box
        component="img"
        src="/docalink-logo.png"
        alt="DOCALINK - Conecta tu salud"
        sx={{
          width: { xs: 48, sm: 56, md: 64 },
          height: { xs: 48, sm: 56, md: 64 },
          borderRadius: 2.5,
          objectFit: 'contain',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
        }}
      />
    </Box>
  );
};
