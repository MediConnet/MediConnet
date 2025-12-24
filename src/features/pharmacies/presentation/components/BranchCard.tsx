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
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={() => onClick(branch)}
    >
      {/* Imagen - altura más pequeña */}
      <Box sx={{ overflow: 'hidden', borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 150, flexShrink: 0 }}>
        {branch.image ? (
          <CardMedia
            component="img"
            image={branch.image}
            alt={branch.name}
            sx={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e0f2fe',
            }}
          >
            <LocationOn sx={{ fontSize: 36, color: '#94a3b8' }} />
          </Box>
        )}
      </Box>
      
      {/* Contenido - más compacto */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 1, 
            fontSize: '0.9375rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {branch.name}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'start', 
            gap: 0.75, 
            mb: 1.5,
            flexGrow: 1,
          }}
        >
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary', 
              flex: 1,
              fontSize: '0.8125rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
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
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 600,
            flexShrink: 0,
            mt: 'auto',
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

