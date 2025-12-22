import { TextField, InputAdornment, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

export const AmbulanceSearch = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Buscar servicio de ambulancia..."
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

