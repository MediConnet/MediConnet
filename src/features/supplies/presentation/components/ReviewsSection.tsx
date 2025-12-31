import { Star } from "@mui/icons-material";

// Mock data para reseñas - basado en las imágenes proporcionadas
const mockReviews = [
  {
    id: "1",
    name: "Farmacia del Norte",
    rating: 5,
    comment: "Excelentes precios al mayoreo. Entrega puntual.",
    date: "2024-01-16",
  },
  {
    id: "2",
    name: "Clínica Santa Fe",
    rating: 4,
    comment: "Buen surtido de productos. Calidad garantizada.",
    date: "2024-01-11",
  },
];

export const ReviewsSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Reseñas de Clientes</h3>
        <p className="text-sm text-gray-500 mt-1">
          Valoraciones recibidas desde la aplicación móvil
        </p>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-800">{review.name}</p>
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
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

