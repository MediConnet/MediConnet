import {
  Add,
  Campaign,
  CheckCircle,
  HourglassEmpty,
  Send,
} from "@mui/icons-material";
import { Alert, Snackbar, Box, Typography, Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

import {
  createAdAPI,
  type CreateAdParams,
} from "../../../../shared/api/ads.api";
import { AdsEmptyState } from "../../../../shared/components/AdsEmptyState";
import { CreateAdModal } from "../../../../shared/components/modals/CreateAdModal";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";
import { useAdRequest } from "../../../../shared/hooks/useAdRequest";

const STATUS_LABELS: Record<string, { label: string; color: "success" | "warning" | "error" | "default" }> = {
  APPROVED: { label: "Aprobado", color: "success" },
  PENDING: { label: "Pendiente", color: "warning" },
  REJECTED: { label: "Rechazado", color: "error" },
};

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

  const adsList = activeAd ? [activeAd] : [];

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

  const columns: GridColDef[] = [
    {
      field: "badge_text",
      headerName: "Título",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <Typography fontWeight={600}>{params.value || params.row.label || "—"}</Typography>,
    },
    {
      field: "title",
      headerName: "Descuento",
      width: 130,
      renderCell: (params) => <Typography color="success.main" fontWeight={600}>{params.value || params.row.discount || "—"}</Typography>,
    },
    {
      field: "subtitle",
      headerName: "Descripción",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 130,
      align: "center",
      renderCell: (params) => {
        const status = params.value as string;
        const config = STATUS_LABELS[status] || { label: status, color: "default" as const };
        return <Chip label={config.label} color={config.color} size="small" />;
      },
    },
    {
      field: "start_date",
      headerName: "Inicio",
      width: 110,
      valueGetter: (_value, row) => {
        const d = row.start_date || row.startDate;
        return d ? new Date(d).toLocaleDateString("es-ES") : "—";
      },
    },
    {
      field: "end_date",
      headerName: "Fin",
      width: 110,
      valueGetter: (_value, row) => {
        const d = row.end_date || row.endDate;
        return d ? new Date(d).toLocaleDateString("es-ES") : "—";
      },
    },
  ];

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Anuncios Promocionales
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los anuncios que aparecerán en la app móvil
            </p>
          </div>

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

        {pendingRequest && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <HourglassEmpty className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 text-sm">
                Solicitud pendiente de aprobación
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Tu solicitud para crear un anuncio está siendo revisada por el administrador.
              </p>
            </div>
          </div>
        )}

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

        {adsList.length === 0 && !isLoading ? (
          <div className="mt-2">
            <AdsEmptyState />
          </div>
        ) : (
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={adsList}
              columns={columns}
              loading={isLoading}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              sx={{ border: "none" }}
              hideFooterPagination
            />
          </Box>
        )}

        {hasActiveAd && adsList[0] && (
          <div className="mt-6">
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, fontSize: "0.95rem" }}>
              Vista previa
            </Typography>
            <div className="max-w-md">
              <PromotionalBanner
                label={adsList[0].label || adsList[0].badge_text || ""}
                discount={adsList[0].discount || adsList[0].title || ""}
                description={adsList[0].description || adsList[0].subtitle || ""}
                buttonText={adsList[0].buttonText || adsList[0].action_text || ""}
                imageUrl={adsList[0].imageUrl || adsList[0].image_url || undefined}
                endDate={adsList[0].endDate || adsList[0].end_date || undefined}
                backgroundColor={adsList[0].bg_color_hex}
                accentColor={adsList[0].accent_color_hex}
              />
            </div>
          </div>
        )}
      </div>

      <CreateAdModal
        open={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
        onCreateAd={handleRequestPermission}
        submitButtonText="Enviar solicitud"
      />

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
