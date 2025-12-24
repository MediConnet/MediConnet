import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { Science } from '@mui/icons-material';
import { LaboratoryCard } from '../components/LaboratoryCard';
import { LaboratorySearch } from '../components/LaboratorySearch';
import { useLaboratories } from '../hooks/useLaboratory';
import { Footer } from '../../../../shared/components/Footer';

export const LaboratoriesPage = () => {
  const { data: laboratories, isLoading } = useLaboratories();

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
          <Science sx={{ fontSize: { xs: 32, sm: 40 }, color: '#8b5cf6' }} />
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
            Laboratorios
          </Typography>
        </Box>

        <Typography color="text.secondary" mb={3} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Encuentra laboratorios clínicos cerca de ti
        </Typography>

        <LaboratorySearch />

        <Grid container spacing={3} mt={2}>
          {laboratories?.map(lab => (
            <Grid item xs={12} sm={6} md={4} key={lab.id}>
              <LaboratoryCard laboratory={lab} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};
