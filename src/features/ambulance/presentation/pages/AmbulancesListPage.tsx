import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import { AmbulanceCard } from '../components/AmbulanceCard';
import { AmbulanceSearch } from '../components/AmbulanceSearch';
import { useAmbulances } from '../hooks/useAmbulanceService';
import { Footer } from '../../../../shared/components/Footer';

export const AmbulancesListPage = () => {
  const { data: ambulances, isLoading } = useAmbulances();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0fdfa' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: 1, backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LocalShipping sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
            Ambulancias
          </Typography>
        </Box>

        <Typography color="text.secondary" mb={3} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Servicios de emergencia disponibles
        </Typography>

        <AmbulanceSearch />

        <Grid container spacing={3} mt={2}>
          {ambulances?.map(ambulance => (
            <Grid item xs={12} sm={6} md={4} key={ambulance.id}>
              <AmbulanceCard ambulance={ambulance} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

