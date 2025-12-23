import {
  AccessTime,
  ArrowBack,
  AttachMoney,
  CalendarMonth,
  FavoriteBorder,
  Star,
  StarBorder,
  VerifiedUser,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentModal } from "../../../appointments/presentation/components/AppointmentModal";
import { useDoctor } from "../hooks/useDoctor";

export const DoctorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: doctor, isLoading } = useDoctor(id || "");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const doctorImage = doctor ? `https://i.pravatar.cc/300?u=${doctor.id}` : "";

  // --- ESTADOS PARA LA RESEÑA ---
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = () => {
    // Aquí iría la llamada al backend. Por ahora solo simulamos.
    console.log("Enviando reseña:", { rating, comment });

    // Limpiamos y cerramos
    setIsReviewFormOpen(false);
    setRating(0);
    setComment("");
    alert("¡Gracias! Tu reseña se ha enviado (simulación).");
  };

  const handleCancelReview = () => {
    setIsReviewFormOpen(false);
    setRating(0);
    setComment("");
  };

  if (isLoading)
    return <div className="p-10 text-center">Cargando perfil...</div>;
  if (!doctor)
    return <div className="p-10 text-center">Doctor no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#f0fdfa] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium cursor-pointer"
        >
          <ArrowBack className="mr-1" fontSize="small" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- COLUMNA IZQUIERDA (Principal) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta Principal */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Foto */}
                <div className="w-full md:w-48 h-48 flex-shrink-0">
                  <img
                    src={doctorImage}
                    alt={doctor.name}
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                  />
                </div>

                {/* Info Básica */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {doctor.name}
                      </h1>
                      <span className="inline-block px-3 py-1 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-bold rounded-lg border border-[#06B6D4]/20 mb-4">
                        {doctor.specialty}
                      </span>
                    </div>
                    {/* Botón Guardar con cursor-pointer */}
                    <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm border px-3 py-1 rounded-full hover:bg-red-50 cursor-pointer">
                      <FavoriteBorder fontSize="small" />
                      <span className="hidden sm:inline">Guardar</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <VerifiedUser
                        className="text-[#06B6D4]"
                        fontSize="small"
                      />
                      <span>
                        {doctor.experience?.[0] ||
                          "Experiencia no especificada"}
                      </span>
                    </div>
                    {doctor.registrationNumber && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700 w-5 text-center">
                          #
                        </span>
                        <span>Registro: {doctor.registrationNumber}</span>
                      </div>
                    )}
                    {doctor.scheduleText && (
                      <div className="flex items-center gap-2">
                        <AccessTime
                          className="text-gray-400"
                          fontSize="small"
                        />
                        <span>Horario: {doctor.scheduleText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {doctor.bio && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Sobre el doctor
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              )}

              {/* Caja de Tarifas */}
              <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
                    <AttachMoney />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">
                      Tarifa de Consulta
                    </p>
                    <p className="text-green-600 text-xs">
                      Incluye revisión y diagnóstico
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold text-green-700">
                  ${doctor.consultationFee?.toFixed(2) || "0.00"}
                </span>
              </div>

              {/* Botón Agendar (Móvil) */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full mt-6 lg:hidden bg-[#06B6D4] text-white py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarMonth />
                Agendar Cita
              </button>
            </div>

            {/* Sección de Reseñas y Formulario */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Reseñas y Valoraciones
                </h3>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                  <Star className="text-yellow-400" fontSize="small" />
                  <span className="font-bold text-gray-900">
                    {doctor.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({doctor.totalReviews})
                  </span>
                </div>
              </div>

              {!isReviewFormOpen ? (
                <button
                  onClick={() => setIsReviewFormOpen(true)}
                  className="w-full py-2.5 bg-[#06B6D4] text-white font-medium rounded-xl hover:bg-[#0891b2] transition-colors cursor-pointer"
                >
                  Escribir una reseña
                </button>
              ) : (
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 animate-fade-in-down">
                  {/* Selector de Estrellas */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Tu calificación
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          {(hoverRating || rating) >= starValue ? (
                            <Star className="text-yellow-400 text-3xl" />
                          ) : (
                            <StarBorder className="text-gray-300 text-3xl" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input de Texto */}
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Comentario (opcional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comparte tu experiencia..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent outline-none bg-white resize-none"
                    />
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitReview}
                      disabled={rating === 0}
                      className={`flex-1 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer
                        ${
                          rating === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#06B6D4] hover:bg-[#0891b2]"
                        }
                      `}
                    >
                      Publicar Reseña
                    </button>
                    <button
                      onClick={handleCancelReview}
                      className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- COLUMNA DERECHA (Sidebar Sticky) --- */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">
                Información Profesional
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Especialidad
                  </p>
                  <p className="text-gray-900 font-medium">
                    {doctor.specialty}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Experiencia
                  </p>
                  <p className="text-gray-900 font-medium">
                    {doctor.experience?.[0]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Horario de Atención
                  </p>
                  <p className="text-gray-900 font-medium">
                    {doctor.scheduleText}
                  </p>
                </div>
              </div>

              {/* Botón Agendar (Desktop) */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-[#06B6D4] text-white py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 cursor-pointer"
              >
                <CalendarMonth />
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
        {/* Modal de Agendamiento */}
        <AppointmentModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          doctor={doctor}
        />
      </div>
    </div>
  );
};
