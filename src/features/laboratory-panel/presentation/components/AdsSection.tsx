import { Campaign, CheckCircle, HourglassEmpty, Add } from "@mui/icons-material";
import { useState } from "react";
import { useAdRequest } from "../hooks/useAdRequest";
import { CreateAdModal } from "./CreateAdModal";

export const AdsSection = () => {
  const { pendingRequest, hasActiveAd, hasApprovedRequest, isLoading, createRequest, refetch } = useAdRequest();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  const handleRequestPermission = async (adData: {
    title: string;
    description: string;
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

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Anuncio activo (aquí se mostraría el anuncio)</p>
        </div>
      </div>
    );
  }

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

