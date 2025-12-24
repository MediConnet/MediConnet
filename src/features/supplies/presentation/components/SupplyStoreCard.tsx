import { Card, CardContent, CardMedia, Button, Typography, Box, Chip } from '@mui/material';
import { LocationOn, AccessTime, WhatsApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SupplyStore } from '../../domain/SupplyStore.entity';

interface SupplyStoreCardProps {
  supplyStore: SupplyStore;
}

export const SupplyStoreCard = ({ supplyStore }: SupplyStoreCardProps) => {
  const navigate = useNavigate();

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hola, me interesa información sobre ${supplyStore.name}`);
    window.open(`https://wa.me/${supplyStore.phone.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(supplyStore.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleCardClick = () => {
    navigate(`/supplies/${supplyStore.id}`);
  };

  return (
    <Card 
      onClick={handleCardClick}
      sx={{ 
        borderRadius: 3,
        boxShadow: supplyStore.sponsored ? '0 0 0 2px #f97316' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: supplyStore.sponsored ? '0 0 0 2px #f97316, 0 4px 16px rgba(0, 0, 0, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        {supplyStore.sponsored && (
          <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
            <Chip 
              label="Patrocinado" 
              size="small" 
              sx={{ 
                backgroundColor: '#f97316', 
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }} 
            />
          </Box>
        )}
        <CardMedia
          component="img"
          image={supplyStore.image}
          alt={supplyStore.name}
          sx={{ 
            height: 200,
            width: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>

      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={1}>
          {supplyStore.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}>
          <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {supplyStore.address}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {supplyStore.schedule}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsApp}
            sx={{
              flex: 1,
              backgroundColor: '#10b981',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocationOn />}
            onClick={handleLocation}
            sx={{
              flex: 1,
              borderColor: '#06b6d4',
              color: '#06b6d4',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#0891b2',
                backgroundColor: '#f0fdfa',
              },
            }}
          >
            Ubicación
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

