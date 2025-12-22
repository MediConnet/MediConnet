import { TextField, InputAdornment, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

export const LaboratorySearch = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Buscar laboratorio por nombre o ubicación..."
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

