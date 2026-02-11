import { Star, RateReview } from "@mui/icons-material";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useDoctorReviews } from "../hooks/useDoctorReviews";

export const ReviewsSection = () => {
  const { data, isLoading, error } = useDoctorReviews();

  if (isLoading) {
    return (
      <Box className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-center items-center min-h-[200px]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <Alert severity="error">
          Error al cargar las reseñas. Por favor, intenta de nuevo más tarde.
        </Alert>
      </Box>
    );
  }

  const reviews = data?.reviews || [];
  const averageRating = data?.averageRating || 0;
  const totalReviews = data?.totalReviews || 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Reseñas de Pacientes</h3>
        <p className="text-sm text-gray-500 mt-1">
          Valoraciones recibidas desde la aplicación móvil
        </p>
      </div>

      {reviews.length === 0 ? (
        <Box className="text-center py-12">
          <RateReview className="text-gray-300" sx={{ fontSize: 64 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Aún no tienes reseñas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Las reseñas de tus pacientes aparecerán aquí
          </Typography>
        </Box>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-end mb-2">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Star className="text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"}
              </p>
            </div>
          </div>

          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {review.userName || "Usuario"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`text-sm ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(
                    review.createdAt || review.date || Date.now(),
                  ).toLocaleDateString("es-MX")}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

