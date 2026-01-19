import { Campaign, CheckCircle, HourglassEmpty, Add } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdRequest } from "../hooks/useAdRequest";
import { CreateAdModal } from "./CreateAdModal";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";

export const AdsSection = () => {
  const { pendingRequest, hasActiveAd, hasApprovedRequest, activeAd, isLoading, createRequest, refetch } = useAdRequest();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  // Verificar periódicamente si el anuncio ha expirado
  useEffect(() => {
    if (!activeAd || !activeAd.endDate) return;

    const checkExpiration = () => {
      const now = new Date().getTime();
      const endDate = new Date(activeAd.endDate!).getTime();
      
      if (endDate < now) {
        // El anuncio ha expirado, refrescar datos
        refetch();
      }
    };

    // Verificar cada minuto
    const interval = setInterval(checkExpiration, 60000);
    
    // Verificar inmediatamente
    checkExpiration();

    return () => clearInterval(interval);
  }, [activeAd?.endDate, refetch]);

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
      await createRequest(adData);
      await refetch();
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  // Si tiene anuncio activo, mostrar el anuncio y bloquear crear nuevo
  if (hasActiveAd) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Anuncios Promocionales</h3>
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
            Ya tienes un anuncio publicado. Si deseas crear otro, debes solicitar permiso nuevamente al administrador.
          </p>
        </div>

        {/* Mostrar el banner promocional del anuncio activo */}
        {activeAd && activeAd.label && activeAd.discount && activeAd.buttonText ? (
          <div className="mt-4">
            <PromotionalBanner
              label={activeAd.label || ""}
              discount={activeAd.discount || ""}
              description={activeAd.description || ""}
              buttonText={activeAd.buttonText || ""}
              imageUrl={activeAd.imageUrl}
              endDate={activeAd.endDate}
            />
          </div>
        ) : activeAd ? (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
            <p className="text-sm text-gray-500">
              Anuncio activo (formato antiguo - actualiza tu anuncio para ver el nuevo diseño)
            </p>
            {activeAd.title && (
              <p className="text-base font-medium text-gray-800 mt-2">{activeAd.title}</p>
            )}
            {activeAd.description && (
              <p className="text-sm text-gray-600 mt-1">{activeAd.description}</p>
            )}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
            <p className="text-sm text-gray-500">
              No se pudo cargar el anuncio activo. Por favor, recarga la página.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Si tiene solicitud pendiente
  if (pendingRequest) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Anuncios Promocionales</h3>
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
            Tu solicitud para crear un anuncio está siendo revisada por el administrador. 
            Te notificaremos cuando sea aprobada.
          </p>
        </div>
      </div>
    );
  }

  // Si tiene solicitud aprobada, el anuncio ya debería estar activo
  // Este caso no debería ocurrir si el flujo es correcto, pero lo mantenemos por seguridad
  if (hasApprovedRequest) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Anuncios Promocionales</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tu solicitud fue aprobada
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle />
            <span className="font-medium">Solicitud aprobada</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Tu solicitud ha sido aprobada y tu anuncio está activo.
          </p>
        </div>
      </div>
    );
  }

  // Estado inicial: no tiene solicitud, mostrar botón para solicitar permiso
  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Anuncios Promocionales</h3>
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
            Completa el formulario con la información de tu anuncio. Una vez enviado, 
            el administrador revisará y aprobará tu solicitud.
          </p>
        </div>
      </div>

      <CreateAdModal
        open={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
        onCreateAd={handleRequestPermission}
        submitButtonText="Enviar solicitud"
      />
    </>
  );
};

