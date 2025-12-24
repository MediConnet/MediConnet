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
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0fdfa' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4, flex: 1 }}>
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.PHARMACIES)}
          sx={{ 
            mb: 3, 
            textTransform: 'none',
            color: '#06b6d4',
            '&:hover': {
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
            },
          }}
        >
          Volver
        </Button>

        {/* Logo y información de la farmacia */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {pharmacy.logo ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={pharmacy.logo}
                alt={pharmacy.name}
                sx={{
                  maxWidth: { xs: '200px', sm: '250px', md: '300px' },
                  maxHeight: { xs: '120px', sm: '140px', md: '150px' },
                  objectFit: 'contain',
                  backgroundColor: 'white',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 200, sm: 250, md: 300 },
                height: { xs: 120, sm: 140, md: 150 },
                backgroundColor: 'white',
                borderRadius: 2,
                mb: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {pharmacy.name}
              </Typography>
            </Box>
          )}
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1e293b', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
            {pharmacy.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 2, fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
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
        <Box sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Buscar sucursal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#06b6d4',
                },
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
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={branch.id}
                sx={{ 
                  display: 'flex',
                }}
              >
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

