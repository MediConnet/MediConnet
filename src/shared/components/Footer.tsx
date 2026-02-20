import { Box, Typography } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useHomeContent } from '../../features/home/presentation/hooks/useHome';

export const Footer = () => {
  const { data: homeContent } = useHomeContent();

  if (!homeContent) return null;

  return (
    <Box sx={{ width: '100%', backgroundColor: '#1e3a8a', color: 'white', py: 6, px: 2, mt: 'auto' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Favorite sx={{ fontSize: 18, color: '#ef4444' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              DOCALINK
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem' }}>
              Conecta tu salud
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem' }}>
          © 2025 DOCALINK. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

