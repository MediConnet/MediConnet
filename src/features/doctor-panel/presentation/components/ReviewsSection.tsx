import { Star } from "@mui/icons-material";

// Función para obtener fechas recientes
const getRecentDate = (daysAgo: number) => {
  const today = new Date();
  today.setDate(today.getDate() - daysAgo);
  return today.toISOString().split("T")[0];
};

// Mock data para reseñas
const mockReviews = [
  {
    id: "1",
    name: "María García",
    rating: 5,
    comment: "Excelente doctor, muy profesional y atento. Me explicó todo con detalle.",
    date: getRecentDate(2),
  },
  {
    id: "2",
    name: "Juan López",
    rating: 4,
    comment: "Buena atención, un poco de espera pero valió la pena. Muy recomendado.",
    date: getRecentDate(5),
  },
  {
    id: "3",
    name: "Ana Martínez",
    rating: 5,
    comment: "Lo recomiendo ampliamente, muy dedicado y conocedor.",
    date: getRecentDate(8),
  },
  {
    id: "4",
    name: "Carlos Rodríguez",
    rating: 5,
    comment: "Muy satisfecho con la atención. El doctor fue muy claro en el diagnóstico y tratamiento.",
    date: getRecentDate(12),
  },
  {
    id: "5",
    name: "Laura Sánchez",
    rating: 4,
    comment: "Buen servicio, aunque la espera fue un poco larga. Pero la consulta fue muy completa.",
    date: getRecentDate(15),
  },
  {
    id: "6",
    name: "Pedro González",
    rating: 5,
    comment: "Excelente profesional. Muy empático y con gran conocimiento. Definitivamente volveré.",
    date: getRecentDate(18),
  },
  {
    id: "7",
    name: "Sofía Ramírez",
    rating: 5,
    comment: "El mejor doctor que he visitado. Muy profesional y atento a los detalles.",
    date: getRecentDate(22),
  },
  {
    id: "8",
    name: "Roberto Fernández",
    rating: 4,
    comment: "Buena atención médica. El doctor explicó todo muy bien y me sentí en confianza.",
    date: getRecentDate(25),
  },
  {
    id: "9",
    name: "Carmen Torres",
    rating: 5,
    comment: "Muy recomendado. Atención de calidad y muy profesional.",
    date: getRecentDate(30),
  },
];

export const ReviewsSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Reseñas de Pacientes</h3>
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

