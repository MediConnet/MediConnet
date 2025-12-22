import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePharmacies } from '../hooks/usePharmacy';
import { PharmacyCard } from '../components/PharmacyCard';
import { Footer } from '../../../../shared/components/Footer';
import type { Pharmacy } from '../../domain/Pharmacy.entity';
import { ROUTES } from '../../../../app/config/constants';

export const PharmaciesListPage = () => {
  const navigate = useNavigate();
  const { data: pharmacies, isLoading } = usePharmacies();

  const handlePharmacyClick = (pharmacy: Pharmacy) => {
    navigate(`${ROUTES.PHARMACIES}/${pharmacy.id}`);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4, flex: 1 }}>
        {/* Título */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Farmacias
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: '#10b981',
              mx: 'auto',
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Grid de farmacias */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : pharmacies && pharmacies.length > 0 ? (
          <Grid container spacing={3}>
            {pharmacies.map((pharmacy) => (
              <Grid item xs={12} sm={6} md={4} key={pharmacy.id}>
                <PharmacyCard pharmacy={pharmacy} onClick={handlePharmacyClick} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
            No se encontraron farmacias
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

