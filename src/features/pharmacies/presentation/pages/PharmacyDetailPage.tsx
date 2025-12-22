import { Box, Typography, Grid, Button, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Search, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePharmacy, usePharmacyBranches } from '../hooks/usePharmacy';
import { BranchCard } from '../components/BranchCard';
import { Footer } from '../../../../shared/components/Footer';
import type { PharmacyBranch } from '../../domain/PharmacyBranch.entity';
import { ROUTES } from '../../../../app/config/constants';

export const PharmacyDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: pharmacy, isLoading: isLoadingPharmacy } = usePharmacy(id || '');
  const { data: branches, isLoading: isLoadingBranches } = usePharmacyBranches(id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBranchClick = (branch: PharmacyBranch) => {
    navigate(`/pharmacy-branch/${branch.id}`);
  };

  const filteredBranches = branches?.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoadingPharmacy) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pharmacy) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Farmacia no encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4, flex: 1 }}>
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.PHARMACIES)}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Volver
        </Button>

        {/* Logo de la farmacia */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {pharmacy.logo ? (
            <Box
              component="img"
              src={pharmacy.logo}
              alt={pharmacy.name}
              sx={{
                maxWidth: '300px',
                maxHeight: '150px',
                objectFit: 'contain',
                mb: 2,
              }}
            />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {pharmacy.name}
            </Typography>
          )}
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {pharmacy.name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            {pharmacy.totalBranches} sucursales
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

        {/* Barra de búsqueda */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Buscar sucursal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'white',
              },
            }}
          />
        </Box>

        {/* Grid de sucursales */}
        {isLoadingBranches ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredBranches.length > 0 ? (
          <Grid container spacing={3}>
            {filteredBranches.map((branch) => (
              <Grid item xs={12} sm={6} md={4} key={branch.id}>
                <BranchCard branch={branch} onClick={handleBranchClick} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
            No se encontraron sucursales
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

