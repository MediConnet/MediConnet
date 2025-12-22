import { TextField, InputAdornment, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

export const SupplyStoreSearch = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Buscar tienda de insumos médicos..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: '800px' }}
      />
    </Box>
  );
};

