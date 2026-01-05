import { useState } from 'react';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';

interface ReviewFormData {
  rating: number;
  comment?: string;
}

interface ReviewFormProps {
  onSubmit: (review: ReviewFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ReviewForm = ({ onSubmit, onCancel, isLoading = false }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && !isLoading) {
      try {
        await onSubmit({ rating, comment: comment.trim() || undefined });
        setRating(0);
        setComment('');
      } catch (error) {
        console.error('Error al enviar reseña:', error);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        p: 3,
        mb: 3,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
        Tu calificación
      </Typography>
      <Rating
        value={rating}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            setRating(newValue);
          }
        }}
        size="large"
        sx={{ mb: 3 }}
      />

      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
        Comentario (opcional)
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Comparte tu experiencia..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={rating === 0 || isLoading}
          sx={{
            backgroundColor: '#06b6d4',
            color: 'white',
            textTransform: 'none',
            flex: 1,
            '&:hover': {
              backgroundColor: '#0891b2',
            },
            '&:disabled': {
              backgroundColor: '#e5e7eb',
              color: '#9ca3af',
            },
          }}
        >
          {isLoading ? 'Publicando...' : 'Publicar Reseña'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          sx={{
            borderColor: '#d1d5db',
            color: 'text.primary',
            textTransform: 'none',
            flex: 1,
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
          }}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

