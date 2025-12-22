import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import type { Pharmacy } from '../../domain/Pharmacy.entity';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onClick: (pharmacy: Pharmacy) => void;
}

export const PharmacyCard = ({ pharmacy, onClick }: PharmacyCardProps) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={() => onClick(pharmacy)}
    >
      {pharmacy.logo ? (
        <CardMedia
          component="img"
          sx={{
            height: 200,
            objectFit: 'contain',
            p: 3,
            backgroundColor: '#f9fafb',
            aspectRatio: '1/1',
          }}
          image={pharmacy.logo}
          alt={pharmacy.name}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e0f2fe',
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#4b5563', textAlign: 'center' }}>
            {pharmacy.name}
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
          {pharmacy.name}
        </Typography>
        {pharmacy.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.875rem' }}>
            {pharmacy.description}
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 'auto', fontSize: '0.875rem' }}>
          {pharmacy.totalBranches} sucursales
        </Typography>
      </CardContent>
    </Card>
  );
};

