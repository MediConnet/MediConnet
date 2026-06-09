import { Add, Campaign, CheckCircle, Edit, HourglassEmpty, Send } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { useAuthStore } from "../../app/store/auth.store";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AdsEmptyState } from "../components/AdsEmptyState";
import { CreateAdModal } from "../components/modals/CreateAdModal";
import { PromotionalBanner } from "../components/PromotionalBanner";
import type { CreateAdParams } from "../api/ads.api";
import { updateAdAPI } from "../api/ads.api";
import { useAdRequest } from "../hooks/useAdRequest";
import { useMyAds } from "../hooks/useMyAds";
import type { Ad } from "../domain/Ad.entity";

const STATUS_TABS = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendientes" },
  { value: "APPROVED", label: "Aprobados" },
  { value: "REJECTED", label: "Rechazados" },
];

const STATUS_CHIP_COLORS: Record<string, "warning" | "success" | "error" | "default"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

export const ProviderAdsPage = () => {
  const theme = useTheme();
  const authStore = useAuthStore();
  const { user } = authStore;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userProfile = {
    name: user?.name || "Proveedor",
    roleLabel: "Proveedor",
    initials: getInitials(user?.name || "PR"),
    isActive: true,
  };

  const {
    activeAd,
    pendingRequest,
    hasActiveAd,
    hasApprovedRequest,
    isLoading: isLoadingRequest,
    createRequest,
    refetch: refetchRequest,
  } = useAdRequest();

  const { ads, isLoading: isLoadingAds, filters, updateFilters, refetch: refetchAds } = useMyAds();

  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState<Ad | null>(null);
  const [activeStatusTab, setActiveStatusTab] = useState("");

  const isLoading = isLoadingRequest || isLoadingAds;

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
      await createRequest(apiPayload);
      setIsCreateAdModalOpen(false);
      refetchRequest();
      refetchAds();
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAdClick = () => {
    if (hasActiveAd || pendingRequest) return;
    setIsCreateAdModalOpen(true);
  };

  const handleEditAd = (ad: Ad) => {
    setAdToEdit(ad);
  };

  const handleUpdateAd = async (adData: {
    label: string;
    discount: string;
    description: string;
    buttonText: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => {
    if (!adToEdit) return;
    setIsCreating(true);
    try {
      await updateAdAPI(adToEdit.id, adData);
      setAdToEdit(null);
      refetchRequest();
      refetchAds();
    } catch (error) {
      console.error("Error updating ad:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseEditModal = () => {
    setAdToEdit(null);
  };

  const handleStatusFilter = (status: string) => {
    setActiveStatusTab(status);
    updateFilters({ status: status || undefined });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ dateFrom: e.target.value || undefined });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ dateTo: e.target.value || undefined });
  };

  const handleRefresh = () => {
    refetchRequest();
    refetchAds();
  };

  const renderAdCard = (ad: Ad) => (
    <Grid2 size={{ xs: 12, md: 6 }} key={ad.id}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {ad.label || ad.badge_text || "Anuncio"}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => handleEditAd(ad)}
              sx={{ textTransform: "none", borderRadius: 2, minWidth: 0 }}
            >
              {ad.status === "PENDING" ? "Editar" : "Ver"}
            </Button>
            <Chip
              label={STATUS_LABELS[ad.status || ""] || ad.status}
              color={STATUS_CHIP_COLORS[ad.status || ""] || "default"}
              size="small"
            />
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {ad.description || ad.subtitle || "Sin descripción"}
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {ad.start_date && (
            <Typography variant="caption" color="text.disabled">
              Inicio: {new Date(ad.start_date).toLocaleDateString()}
            </Typography>
          )}
          {ad.end_date && (
            <Typography variant="caption" color="text.disabled">
              Fin: {new Date(ad.end_date).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </Box>
    </Grid2>
  );

  const renderFilters = () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {STATUS_TABS.map((tab) => (
          <Chip
            key={tab.value}
            label={tab.label}
            variant={activeStatusTab === tab.value ? "filled" : "outlined"}
            color={activeStatusTab === tab.value ? "primary" : "default"}
            onClick={() => handleStatusFilter(tab.value)}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <TextField
          label="Desde"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filters.dateFrom || ""}
          onChange={handleDateFromChange}
        />
        <TextField
          label="Hasta"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filters.dateTo || ""}
          onChange={handleDateToChange}
        />
      </Stack>
    </Stack>
  );

  if (isLoading) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile}>
        <div className="p-3 max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
            <CircularProgress size={50} thickness={4} sx={{ color: theme.palette.primary.main }} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={userProfile}>
      <div className="p-3 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Anuncios Promocionales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona los anuncios que aparecerán en la app móvil
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Refrescar
              </Button>
              <Button
                variant="contained"
                startIcon={
                  hasActiveAd || pendingRequest ? (
                    <Campaign />
                  ) : hasApprovedRequest ? (
                    <Add />
                  ) : (
                    <Send />
                  )
                }
                disabled={!!hasActiveAd || !!pendingRequest || isCreating}
                sx={{
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none",
                  px: 3,
                  opacity: hasActiveAd || pendingRequest ? 0.6 : 1,
                }}
                onClick={handleCreateAdClick}
              >
                {hasActiveAd
                  ? "Anuncio Activo"
                  : pendingRequest
                    ? "Solicitud Pendiente"
                    : isCreating
                      ? "Enviando..."
                      : hasApprovedRequest
                        ? "Publicar Anuncio"
                        : "Crear y solicitar permiso"}
              </Button>
            </Stack>
          </Stack>

          {pendingRequest && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HourglassEmpty />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Solicitud pendiente de aprobación
                  </Typography>
                  <Typography variant="caption">
                    Tu solicitud para crear un anuncio está siendo revisada por el administrador.
                  </Typography>
                </Box>
              </Stack>
            </Alert>
          )}

          {hasActiveAd && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircle />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Tienes un anuncio activo
                  </Typography>
                  <Typography variant="caption">
                    Ya tienes un anuncio publicado visible para los usuarios.
                  </Typography>
                </Box>
              </Stack>
            </Alert>
          )}

          <Box mb={3}>{renderFilters()}</Box>

          {ads.length === 0 ? (
            <AdsEmptyState />
          ) : (
            <Grid2 container spacing={2}>
              {ads.map(renderAdCard)}
            </Grid2>
          )}
        </div>

        <CreateAdModal
          open={isCreateAdModalOpen}
          onClose={() => setIsCreateAdModalOpen(false)}
          onCreateAd={handleRequestPermission}
          submitButtonText={hasApprovedRequest ? "Publicar Anuncio" : "Enviar solicitud"}
        />

        <CreateAdModal
          key={adToEdit?.id || "edit-ad"}
          open={!!adToEdit}
          onClose={handleCloseEditModal}
          onCreateAd={handleUpdateAd}
          initialData={
            adToEdit
              ? {
                  label: adToEdit.label || adToEdit.badge_text || "",
                  discount: adToEdit.discount || adToEdit.title || "",
                  description: adToEdit.description || adToEdit.subtitle || "",
                  buttonText: adToEdit.buttonText || adToEdit.action_text || "",
                  imageUrl: adToEdit.imageUrl || adToEdit.image_url || "",
                  startDate: adToEdit.startDate
                    ? (typeof adToEdit.startDate === "string"
                        ? adToEdit.startDate
                        : adToEdit.startDate.toISOString().split("T")[0]
                      )
                    : adToEdit.start_date
                      ? new Date(adToEdit.start_date).toISOString().split("T")[0]
                      : "",
                  endDate: adToEdit.endDate
                    ? (typeof adToEdit.endDate === "string"
                        ? adToEdit.endDate
                        : adToEdit.endDate.toISOString().split("T")[0]
                      )
                    : adToEdit.end_date
                      ? new Date(adToEdit.end_date).toISOString().split("T")[0]
                      : "",
                }
              : undefined
          }
          isEditing={adToEdit?.status === "PENDING"}
          readOnly={adToEdit?.status !== "PENDING"}
          submitButtonText="Guardar cambios"
        />
      </div>
    </DashboardLayout>
  );
};
