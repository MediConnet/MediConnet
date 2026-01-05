import { 
  TextField, 
  InputAdornment, 
  Box, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, LocationOn, Category } from '@mui/icons-material';
import { useState } from 'react';

export const SupplyStoreSearch = () => {
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const categories = [
    'Todas las categorías',
    'Equipos médicos',
    'Materiales quirúrgicos',
    'Insumos hospitalarios',
    'Dispositivos médicos',
    'Productos de higiene',
  ];

  const cities = [
    'Quito',
    'Guayaquil',
    'Cuenca',
    'Santo Domingo',
    'Machala',
    'Durán',
    'Manta',
    'Portoviejo',
    'Loja',
    'Ambato',
    'Esmeraldas',
    'Quevedo',
    'Riobamba',
    'Milagro',
    'Ibarra',
    'La Libertad',
    'Babahoyo',
    'Sangolquí',
    'Daule',
    'Latacunga',
  ];

  const handleSearchNearest = () => {
    // TODO: Implementar lógica para buscar la tienda más cercana
    console.log('Buscando la más cercana:', {
      category: modalCategory,
      address,
      city,
    });
    // Aquí se podría llamar a una función que filtre las tiendas por distancia
    setModalOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 1.5 }, mb: 3, alignItems: { xs: 'stretch', sm: 'center' } }}>
        {/* Buscador - más pequeño */}
        <TextField
          placeholder="Buscar tienda..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
            minWidth: { xs: '100%', sm: 200 },
            maxWidth: { xs: '100%', sm: 300 },
          }}
        />

        {/* Selector de Categoría */}
        <FormControl 
          size="small" 
          sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
            minWidth: { xs: '100%', sm: 180 },
            maxWidth: { xs: '100%', sm: 220 },
          }}
        >
          <InputLabel id="category-label">Categoría</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="Categoría"
            onChange={(e) => setCategory(e.target.value)}
            startAdornment={
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <Category sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Botón de Ubicación */}
        <Button
          variant="outlined"
          startIcon={<LocationOn />}
          onClick={() => setModalOpen(true)}
          size="small"
          sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
            minWidth: { xs: '100%', sm: 180 },
            maxWidth: { xs: '100%', sm: 220 },
            textTransform: 'none',
            borderColor: '#14b8a6',
            color: '#14b8a6',
            '&:hover': {
              borderColor: '#0d9488',
              backgroundColor: '#f0fdfa',
            },
          }}
        >
          Ubicación
        </Button>
      </Box>

      {/* Modal de Ubicación */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ color: '#14b8a6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Buscar la más cercana
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            {/* Categoría en el modal */}
            <FormControl fullWidth size="small">
              <InputLabel id="modal-category-label">Categoría que busca</InputLabel>
              <Select
                labelId="modal-category-label"
                value={modalCategory}
                label="Categoría que busca"
                onChange={(e) => setModalCategory(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <Category sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                }
              >
                {categories.filter(cat => cat !== 'Todas las categorías').map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Dirección */}
            <TextField
              fullWidth
              label="Dirección"
              placeholder="Calle y número"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Selector de Ciudad */}
            <FormControl fullWidth size="small">
              <InputLabel id="city-label">Ciudad</InputLabel>
              <Select
                labelId="city-label"
                value={city}
                label="Ciudad"
                onChange={(e) => setCity(e.target.value)}
              >
                {cities.map((cityName) => (
                  <MenuItem key={cityName} value={cityName}>
                    {cityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setModalOpen(false)}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSearchNearest}
            variant="contained"
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              },
            }}
          >
            Buscar la más cercana
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

