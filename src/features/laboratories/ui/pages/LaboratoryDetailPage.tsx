import { Box, Button, Chip, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Favorite, AccessTime, LocationOn, Description, WhatsApp, Star } from '@mui/icons-material';
import { AppointmentModal } from '../components/AppointmentModal';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewItem } from '../components/ReviewItem';
import { useLaboratory, useLaboratoryReviews, useCreateReview } from '../hooks/useLaboratory';
import { Footer } from '../../../../shared/components/Footer';

export const LaboratoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { data: laboratory, isLoading: isLoadingLaboratory } = useLaboratory(id || '');
  const { data: reviews = [] } = useLaboratoryReviews(id || '');
  const createReviewMutation = useCreateReview();

  // Calcular rating promedio
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleCreateReview = async (reviewData: { rating: number; comment?: string }) => {
    if (!id) {
      console.error('No hay ID de laboratorio');
      return;
    }
    try {
      await createReviewMutation.mutateAsync({
        laboratoryId: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error al crear reseña:', error);
      alert('Error al publicar la reseña. Por favor, intenta de nuevo.');
    }
  };

  if (isLoadingLaboratory) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!laboratory) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Laboratorio no encontrado
        </Typography>
      </Box>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hola, me interesa información sobre ${laboratory.name}`);
    window.open(`https://wa.me/${laboratory.phone.replace('+', '')}?text=${message}`, '_blank');
  };

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
              src={laboratory.image}
              alt={laboratory.name}
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
                {laboratory.name}
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
              <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Horario: {laboratory.schedule}
              </Typography>
            </Box>

            {/* Dirección */}
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 3 }}>
              <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.5 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {laboratory.address}
              </Typography>
            </Box>

            {/* Exámenes disponibles */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Description sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Exámenes disponibles:
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {laboratory.exams.map(exam => (
                    <Chip
                      key={exam}
                      label={exam}
                      sx={{
                        borderColor: '#8b5cf6',
                        color: '#8b5cf6',
                        backgroundColor: 'white',
                        fontWeight: 500,
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<AccessTime />}
                fullWidth
                onClick={() => setOpen(true)}
                sx={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#7c3aed',
                  },
                }}
              >
                Agendar Examen
              </Button>
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
            </Box>

            {/* Reseñas */}
            <Card>
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

                {/* Lista de reseñas */}
                {reviews.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {[...reviews]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((review) => (
                        <ReviewItem key={review.id} review={review} />
                      ))}
                  </Box>
                ) : !showReviewForm && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Aún no hay reseñas. ¡Sé el primero en dejar una!
                  </Typography>
                )}
              </CardContent>
            </Card>
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
                    {laboratory.phone}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Dirección
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {laboratory.address}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Horario de Atención
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {laboratory.schedule}
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
      <AppointmentModal open={open} onClose={() => setOpen(false)} laboratory={laboratory} />
    </Box>
  );
};
