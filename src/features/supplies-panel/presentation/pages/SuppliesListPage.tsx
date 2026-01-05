import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { Inventory } from '@mui/icons-material';
import { SupplyStoreCard } from '../components/SupplyStoreCard';
import { SupplyStoreSearch } from '../components/SupplyStoreSearch';
import { useSupplies } from '../hooks/useSupply';
import { Footer } from '../../../../shared/components/Footer';

export const SuppliesListPage = () => {
  const { data: supplies, isLoading } = useSupplies();

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
          <Inventory sx={{ fontSize: { xs: 32, sm: 40 }, color: '#f97316' }} />
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
            Insumos Médicos
          </Typography>
        </Box>

        <Typography color="text.secondary" mb={3} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Encuentra tiendas de insumos médicos cerca de ti
        </Typography>

        <SupplyStoreSearch />

        <Grid container spacing={3} mt={2}>
          {supplies?.map(supply => (
            <Grid item xs={12} sm={6} md={4} key={supply.id}>
              <SupplyStoreCard supplyStore={supply} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

