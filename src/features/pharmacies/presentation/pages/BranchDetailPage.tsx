import { useState, useMemo } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { ArrowBack, Favorite, AccessTime, LocationOn, LocalShipping, Star, WhatsApp } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useBranch, useBranchReviews, useCreateReview } from '../hooks/usePharmacy';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewItem } from '../components/ReviewItem';
import { Footer } from '../../../../shared/components/Footer';

export const BranchDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: branch, isLoading: isLoadingBranch } = useBranch(id || '');
  const { data: reviews = [] } = useBranchReviews(id || '');
  const createReviewMutation = useCreateReview();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Calcular rating promedio
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleCreateReview = async (reviewData: { rating: number; comment?: string }) => {
    if (!id) {
      console.error('No hay ID de sucursal');
      return;
    }
    try {
      await createReviewMutation.mutateAsync({
        branchId: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error al crear reseña:', error);
      alert('Error al publicar la reseña. Por favor, intenta de nuevo.');
    }
  };

  if (isLoadingBranch) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!branch) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Sucursal no encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0fdfa' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4, flex: 1 }}>
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, textTransform: 'none', color: 'text.primary' }}
        >
          Volver
        </Button>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Columna izquierda - Imagen e información principal */}
          <Grid item xs={12} md={8}>
            <Box
              component="img"
              src={branch.image || 'https://via.placeholder.com/800x600/f0fdfa/94a3b8?text=Sin+imagen'}
              alt={branch.name}
              sx={{
                width: '100%',
                height: { xs: 300, md: 500 },
                objectFit: 'cover',
                borderRadius: 2,
                mb: 3,
                display: 'block',
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: { xs: 1, sm: 0 }, mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {branch.name}
              </Typography>
              <Button
                startIcon={<Favorite />}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                Agregar a Favoritos
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Horario: {branch.schedule}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 3 }}>
              <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.5 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {branch.address}
              </Typography>
            </Box>
            {branch.hasDelivery && (
              <Box
                sx={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 3,
                }}
              >
                <LocalShipping sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Envío a domicilio disponible
                </Typography>
              </Box>
            )}

            {/* Card izquierda con información adicional */}
            <Card sx={{ mt: 3, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 2 }}>
                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.5 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {branch.address}
                  </Typography>
                </Box>
                {branch.hasDelivery && (
                  <Box
                    sx={{
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <LocalShipping sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Envío a domicilio disponible
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  fullWidth
                  sx={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    textTransform: 'none',
                    mb: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#059669',
                    },
                  }}
                >
                  Contactar por WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Card de Reseñas y Valoraciones */}
            <Card sx={{ mt: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Reseñas y Valoraciones
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Star sx={{ fontSize: 24, color: '#fbbf24' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {averageRating.toFixed(1)} ({reviews.length})
                  </Typography>
                </Box>
                {!showReviewForm && (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setShowReviewForm(true)}
                    sx={{
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      textTransform: 'none',
                      mb: 2,
                      '&:hover': {
                        backgroundColor: '#0891b2',
                      },
                    }}
                  >
                    Escribir una reseña
                  </Button>
                )}

                {/* Formulario de reseña */}
                {showReviewForm && (
                  <ReviewForm
                    onSubmit={handleCreateReview}
                    onCancel={() => setShowReviewForm(false)}
                    isLoading={createReviewMutation.isPending}
                  />
                )}

                {!showReviewForm && reviews.length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Aún no hay reseñas. ¡Sé el primero en dejar una!
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Card de Comentarios (Reseñas individuales) */}
            {reviews.length > 0 && (
              <Card sx={{ mt: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Comentarios
                  </Typography>
                  <Box>
                    {[...reviews]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((review) => (
                        <ReviewItem key={review.id} review={review} />
                      ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Columna derecha - Información de contacto */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Información de Contacto
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {branch.phone}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Dirección
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {branch.address}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Horario de Atención
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {branch.schedule}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<WhatsApp />}
                  fullWidth
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    backgroundColor: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: '#f0fdfa',
                    },
                  }}
                >
                  WhatsApp
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

