import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import type { PharmacyBranch } from '../../domain/PharmacyBranch.entity';

interface BranchCardProps {
  branch: PharmacyBranch;
  onClick: (branch: PharmacyBranch) => void;
}

export const BranchCard = ({ branch, onClick }: BranchCardProps) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={() => onClick(branch)}
    >
      {branch.image && (
        <CardMedia
          component="img"
          height="200"
          image={branch.image}
          alt={branch.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {branch.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 2 }}>
          <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mt: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
            {branch.address}
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#10b981',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#059669',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(branch);
          }}
        >
          Ver farmacia
        </Button>
      </CardContent>
    </Card>
  );
};

