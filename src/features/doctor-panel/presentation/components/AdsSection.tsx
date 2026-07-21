import {
  Add,
  Campaign,
  CheckCircle,
  HourglassEmpty,
  Refresh,
  Send,
} from "@mui/icons-material";
import { Box, Typography, Chip, TextField, Stack } from "@mui/material";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { useState } from "react";

import {
  createAdAPI,
  type CreateAdParams,
} from "../../../../shared/api/ads.api";
import { AdsEmptyState } from "../../../../shared/components/AdsEmptyState";
import { CreateAdModal } from "../../../../shared/components/modals/CreateAdModal";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";
import { useAdRequest } from "../../../../shared/hooks/useAdRequest";
import { useDoctorAds } from "../hooks/useDoctorAds";

const STATUS_TABS = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendientes" },
  { value: "APPROVED", label: "Aprobados" },
  { value: "REJECTED", label: "Rechazados" },
];

const STATUS_LABELS: Record<string, { label: string; color: "success" | "warning" | "error" | "default" }> = {
  APPROVED: { label: "Aprobado", color: "success" },
  PENDING: { label: "Pendiente", color: "warning" },
  REJECTED: { label: "Rechazado", color: "error" },
};

interface Props {
  isAesthetic?: boolean;
}

export const AdsSection = ({ isAesthetic = false }: Props) => {
  const {
    pendingRequest,
    hasActiveAd,
    hasApprovedRequest,
    activeAd,
    isLoading: isRequestLoading,
    refetch: refetchRequest,
  } = useAdRequest();

  const {
    ads,
    loading: adsLoading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    refetch: refetchAds,
  } = useDoctorAds();

  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  const feedback = useFeedbackStore();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const isLoading = isRequestLoading || adsLoading;

  const handleRefresh = () => {
    refetchRequest();
    refetchAds();
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

  const [selectedStatusTab, setSelectedStatusTab] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const rawAdsList = ads.length > 0 ? ads : activeAd ? [activeAd] : [];

  const filteredAds = rawAdsList.filter((ad) => {
    if (selectedStatusTab && ad.status !== selectedStatusTab) {
      return false;
    }
    const dStart = ad.start_date || ad.startDate;
    if (dateFrom && dStart && new Date(dStart) < new Date(dateFrom)) {
      return false;
    }
    const dEnd = ad.end_date || ad.endDate;
    if (dateTo && dEnd && new Date(dEnd) > new Date(dateTo)) {
      return false;
    }
    return true;
  });

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
      feedback.showFeedback('success', 'Solicitud enviada', '¡Solicitud enviada correctamente! El administrador la revisará pronto.');
      await handleRefresh();
    } catch (error) {
      console.error("Error creating request:", error);
      feedback.showFeedback('error', 'Error', 'Hubo un error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };



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
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isAesthetic ? "border-pink-600" : "border-teal-600"}`}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold ${isAesthetic ? "text-[#831843]" : "text-gray-800"}`}>
              {isAesthetic ? "Anuncios y Promociones del Centro Estético" : "Anuncios Promocionales"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los anuncios que aparecerán en la app móvil
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Refresh className="text-sm" />
              <span>Refrescar</span>
            </button>

            <button
              onClick={() => setIsCreateAdModalOpen(true)}
              disabled={!!hasActiveAd || !!pendingRequest || isCreating}
              className={`
                px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm
                ${
                  hasActiveAd || pendingRequest || isCreating
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isAesthetic
                      ? "bg-[#db2777] text-white hover:bg-[#be185d] shadow-sm"
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
        </div>

        {/* BARRA DE FILTROS (ESTADOS Y FECHAS) */}
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {STATUS_TABS.map((tab) => {
              const isSelected = selectedStatusTab === tab.value;
              return (
                <Chip
                  key={tab.value}
                  label={tab.label}
                  onClick={() => setSelectedStatusTab(tab.value)}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? isAesthetic
                        ? "#db2777"
                        : "#0d9488"
                      : "#ffffff",
                    color: isSelected ? "#ffffff" : "#4b5563",
                    border: "1px solid",
                    borderColor: isSelected
                      ? isAesthetic
                        ? "#db2777"
                        : "#0d9488"
                      : "#e5e7eb",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? isAesthetic
                          ? "#be185d"
                          : "#0f766e"
                        : "#f9fafb",
                    },
                  }}
                />
              );
            })}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <TextField
              label="Desde"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={{ width: 170 }}
            />
            <TextField
              label="Hasta"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              sx={{ width: 170 }}
            />
          </Stack>
        </Box>

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

        {filteredAds.length === 0 && !isLoading ? (
          <div className="mt-2">
            <AdsEmptyState />
          </div>
        ) : (
          <Box sx={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={filteredAds}
              columns={columns}
              loading={adsLoading}
              paginationMode="server"
              rowCount={total}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              sx={{ border: "none" }}
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
    </>
  );
};
