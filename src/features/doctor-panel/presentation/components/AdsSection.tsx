import {
  Add,
  Campaign,
  CheckCircle,
  HourglassEmpty,
} from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import {
  createAdAPI,
  type CreateAdParams,
} from "../../../../shared/api/ads.api";
import { CreateAdModal } from "../../../../shared/components/modals/CreateAdModal";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";
import { useAdRequest } from "../../../../shared/hooks/useAdRequest";

export const AdsSection = () => {
  const { pendingRequest, hasActiveAd, activeAd, isLoading, refetch } =
    useAdRequest();

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

      if (endDate < now) {
        refetch();
      }
    };

    const interval = setInterval(checkExpiration, 60000);
    checkExpiration();

    return () => clearInterval(interval);
  }, [activeAd?.endDate, refetch]);

  // --- NUEVA LÓGICA DE INTEGRACIÓN ---
  const handleRequestPermission = async (adData: CreateAdParams) => {
    setIsCreating(true);
    try {
      await createAdAPI(adData);

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO CONDICIONAL ---

  if (hasActiveAd) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Anuncios Promocionales
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona tu anuncio activo
            </p>
          </div>
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
          >
            <Campaign className="text-sm" />
            <span className="text-sm font-medium">Crear anuncio</span>
          </button>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-teal-700">
            <CheckCircle />
            <span className="font-medium">Tienes un anuncio activo</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ya tienes un anuncio publicado. Si deseas crear otro, debes esperar
            a que este expire o contactar al administrador.
          </p>
        </div>

        {/* Mostrar el banner promocional del anuncio activo */}
        {activeAd && (
          <div className="mt-4">
            <PromotionalBanner
              label={activeAd.label || activeAd.badge_text || ""}
              discount={activeAd.discount || activeAd.title || ""}
              description={activeAd.description || activeAd.subtitle || ""}
              buttonText={activeAd.buttonText || activeAd.action_text || ""}
              imageUrl={activeAd.imageUrl || activeAd.image_url || undefined}
              endDate={activeAd.endDate || activeAd.end_date || undefined}
            />
          </div>
        )}
      </div>
    );
  }

  // Si tiene solicitud pendiente (backend status: PENDING)
  if (pendingRequest) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Anuncios Promocionales
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Solicitud de permiso para crear anuncio
            </p>
          </div>
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
          >
            <Campaign className="text-sm" />
            <span className="text-sm font-medium">Crear anuncio</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <HourglassEmpty className="text-yellow-600 text-4xl" />
          </div>
          <p className="text-lg font-medium text-gray-800 mb-2">
            Solicitud pendiente de aprobación
          </p>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Tu solicitud para crear un anuncio está siendo revisada por el
            administrador. Te notificaremos cuando sea aprobada.
          </p>
        </div>
      </div>
    );
  }

  // Estado inicial: Crear nueva solicitud
  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Anuncios Promocionales
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Crea y solicita permiso para publicar tu anuncio
            </p>
          </div>
          <button
            onClick={() => setIsCreateAdModalOpen(true)}
            disabled={isCreating}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Add className="text-sm" />
            <span className="text-sm font-medium">
              {isCreating ? "Enviando..." : "Crear y solicitar permiso"}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Campaign className="text-gray-400 text-4xl" />
          </div>
          <p className="text-lg font-medium text-gray-800 mb-2">
            Crea tu anuncio promocional
          </p>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Completa el formulario con la información de tu anuncio. Una vez
            enviado, el administrador revisará y aprobará tu solicitud.
          </p>
        </div>
      </div>

      <CreateAdModal
        open={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
        onCreateAd={handleRequestPermission}
        submitButtonText="Enviar solicitud"
      />

      {/* Feedback Visual (Snackbar) */}
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
