import { Box, Typography, Avatar, Rating } from '@mui/material';
import { Person } from '@mui/icons-material';
import type { Review } from '../../domain/Review.entity';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        p: 3,
        mb: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar
          sx={{
            backgroundColor: '#06b6d4',
            width: 48,
            height: 48,
            flexShrink: 0,
          }}
        >
          <Person sx={{ color: 'white' }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1, textTransform: 'lowercase' }}>
            {review.userName}
          </Typography>
          <Rating
            value={review.rating}
            readOnly
            size="small"
            sx={{
              mb: 1,
              '& .MuiRating-iconFilled': {
                color: '#fbbf24',
              },
              '& .MuiRating-iconEmpty': {
                color: '#e5e7eb',
              },
            }}
          />
          {review.comment && (
            <Typography variant="body2" sx={{ color: 'text.primary', mb: 1, mt: 1 }}>
              {review.comment}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {formatDate(review.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

