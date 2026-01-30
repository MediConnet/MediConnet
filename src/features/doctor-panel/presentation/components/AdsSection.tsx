import {
  Add,
  Campaign,
  CheckCircle,
  HourglassEmpty,
  Send,
} from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

// --- RECURSOS COMPARTIDOS ---
import {
  createAdAPI,
  type CreateAdParams,
} from "../../../../shared/api/ads.api";
import { AdsEmptyState } from "../../../../shared/components/AdsEmptyState";
import { CreateAdModal } from "../../../../shared/components/modals/CreateAdModal";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";
import { useAdRequest } from "../../../../shared/hooks/useAdRequest";

export const AdsSection = () => {
  const {
    pendingRequest,
    hasActiveAd,
    hasApprovedRequest,
    activeAd,
    isLoading,
    refetch,
  } = useAdRequest();

  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!activeAd || !activeAd.endDate) return;

    const checkExpiration = () => {
      const now = new Date().getTime();
      const endDate = new Date(activeAd.endDate!).getTime();
      if (endDate < now) refetch();
    };

    const interval = setInterval(checkExpiration, 60000);
    checkExpiration();
    return () => clearInterval(interval);
  }, [activeAd?.endDate, refetch]);

  // --- MANEJADOR DE CREACIÓN (Adaptado a Props del Modal) ---
  const handleRequestPermission = async (adData: {
    label: string;
    discount: string;
    description: string;
    buttonText: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => {
    setIsCreating(true);
    try {
      // Mapeo de datos
      const apiPayload: CreateAdParams = {
        label: adData.label,
        discount: adData.discount,
        description: adData.description,
        buttonText: adData.buttonText,
        imageUrl: adData.imageUrl,
        startDate: adData.startDate,
        endDate: adData.endDate,
      };

      await createAdAPI(apiPayload);
      setIsCreateAdModalOpen(false);
      setFeedback({
        type: "success",
        message:
          "¡Solicitud enviada correctamente! El administrador la revisará pronto.",
      });
      await refetch();
    } catch (error) {
      console.error("Error creating request:", error);
      setFeedback({
        type: "error",
        message: "Hubo un error al enviar la solicitud. Inténtalo de nuevo.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseFeedback = () => setFeedback(null);

  const adsList = activeAd ? [activeAd] : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* HEADER: Siempre visible */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Anuncios Promocionales
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los anuncios que aparecerán en la app móvil
            </p>
          </div>

          {/* BOTÓN: Lógica unificada */}
          <button
            onClick={() => setIsCreateAdModalOpen(true)}
            disabled={!!hasActiveAd || !!pendingRequest || isCreating}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm
              ${
                hasActiveAd || pendingRequest || isCreating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
              }
            `}
          >
            {hasActiveAd || pendingRequest ? (
              <Campaign className="text-sm" />
            ) : hasApprovedRequest ? (
              <Add className="text-sm" />
            ) : (
              <Send className="text-sm" />
            )}

            <span>
              {hasActiveAd
                ? "Anuncio Activo"
                : pendingRequest
                  ? "Solicitud Pendiente"
                  : isCreating
                    ? "Enviando..."
                    : "Crear anuncio"}
            </span>
          </button>
        </div>

        {/* --- ALERTAS DE ESTADO --- */}

        {/* Alerta: Solicitud Pendiente */}
        {pendingRequest && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <HourglassEmpty className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 text-sm">
                Solicitud pendiente de aprobación
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Tu solicitud para crear un anuncio está siendo revisada por el
                administrador.
              </p>
            </div>
          </div>
        )}

        {/* Alerta: Anuncio Activo */}
        {hasActiveAd && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-emerald-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-800 text-sm">
                Tienes un anuncio activo
              </h4>
              <p className="text-sm text-emerald-700 mt-1">
                Ya tienes un anuncio publicado visible para los pacientes.
              </p>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PRINCIPAL (Lista o Empty State) --- */}

        {adsList.length === 0 && !hasActiveAd && !pendingRequest ? (
          <div className="mt-2">
            <AdsEmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {adsList.map((ad) => (
              <div key={ad.id} className="w-full">
                <PromotionalBanner
                  label={ad.label || ad.badge_text || ""}
                  discount={ad.discount || ad.title || ""}
                  description={ad.description || ad.subtitle || ""}
                  buttonText={ad.buttonText || ad.action_text || ""}
                  imageUrl={ad.imageUrl || ad.image_url || undefined}
                  endDate={ad.endDate || ad.end_date || undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateAdModal
        open={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
        onCreateAd={handleRequestPermission}
        submitButtonText="Enviar solicitud"
      />

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!feedback}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback?.type}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
