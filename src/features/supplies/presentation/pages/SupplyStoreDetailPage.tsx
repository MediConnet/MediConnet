import { Box, Button, Chip, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Favorite, AccessTime, LocationOn, Inventory, LocalShipping, WhatsApp, Star } from '@mui/icons-material';
import { useSupply, useSupplyReviews, useCreateReview } from '../hooks/useSupply';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewItem } from '../components/ReviewItem';
import { Footer } from '../../../../shared/components/Footer';

export const SupplyStoreDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { data: supplyStore, isLoading: isLoadingSupply } = useSupply(id || '');
  const { data: reviews = [] } = useSupplyReviews(id || '');
  const createReviewMutation = useCreateReview();

  // Calcular rating promedio
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleCreateReview = async (reviewData: { rating: number; comment?: string }) => {
    if (!id) {
      console.error('No hay ID de tienda');
      return;
    }
    try {
      await createReviewMutation.mutateAsync({
        supplyStoreId: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error al crear reseña:', error);
      alert('Error al publicar la reseña. Por favor, intenta de nuevo.');
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hola, me interesa información sobre ${supplyStore?.name}`);
    window.open(`https://wa.me/${supplyStore?.phone.replace('+', '')}?text=${message}`, '_blank');
  };

  if (isLoadingSupply) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!supplyStore) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Tienda de insumos no encontrada
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

        <Grid container spacing={4}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={8}>
            {/* Imagen */}
            <Box
              component="img"
              src={supplyStore.image}
              alt={supplyStore.name}
              sx={{
                width: '100%',
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
                borderRadius: 2,
                mb: 3,
              }}
            />

            {/* Nombre y favoritos */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {supplyStore.name}
              </Typography>
              <Button
                startIcon={<Favorite />}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                Agregar a Favoritos
              </Button>
            </Box>

            {/* Horario */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccessTime sx={{ fontSize: 20, color: '#f97316' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Horario: {supplyStore.schedule}
              </Typography>
            </Box>

            {/* Dirección */}
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 3 }}>
              <LocationOn sx={{ fontSize: 20, color: '#f97316', mt: 0.5 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {supplyStore.address}
              </Typography>
            </Box>

            {/* Entrega a domicilio */}
            {supplyStore.hasDelivery && (
              <Box
                sx={{
                  backgroundColor: '#fed7aa',
                  color: '#9a3412',
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
                  Entrega a domicilio disponible
                </Typography>
              </Box>
            )}

            {/* Productos disponibles */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Inventory sx={{ fontSize: 20, color: '#f97316' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Productos disponibles:
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {supplyStore.products.map(product => (
                    <Chip
                      key={product}
                      label={product}
                      sx={{
                        borderColor: '#f97316',
                        color: '#f97316',
                        backgroundColor: 'white',
                        fontWeight: 500,
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  fullWidth
                  onClick={handleWhatsApp}
                  sx={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    textTransform: 'none',
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
                    {supplyStore.phone}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Dirección
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {supplyStore.address}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Horario de Atención
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {supplyStore.schedule}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<WhatsApp />}
                  fullWidth
                  onClick={handleWhatsApp}
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

      <Footer />
    </Box>
  );
};

