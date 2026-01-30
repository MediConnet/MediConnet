import { Add, Campaign, HourglassEmpty, Send } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";

// Componentes Compartidos
import { AdsEmptyState } from "../../../../shared/components/AdsEmptyState";
import { CreateAdModal } from "../../../../shared/components/modals/CreateAdModal";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";

// Hooks
import type { CreateAdParams } from "../../../../shared/api/ads.api";
import { useAdRequest } from "../../../../shared/hooks/useAdRequest";

// Mock del usuario
const AMBULANCE_USER = {
  name: "Ambulancias Vida",
  roleLabel: "Proveedor",
  initials: "AV",
  isActive: true,
};

export const AmbulanceAdsPage = () => {
  const theme = useTheme();

  const {
    activeAd,
    pendingRequest,
    hasActiveAd,
    hasApprovedRequest,
    isLoading: isLoadingAds,
    createRequest,
  } = useAdRequest();

  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  const isLoading = isLoadingAds;

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

      await createRequest(apiPayload);
      setIsCreateAdModalOpen(false);
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAdClick = () => {
    if (hasActiveAd || pendingRequest) {
      return;
    }
    setIsCreateAdModalOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
        <div className="p-3 max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
            <CircularProgress
              size={50}
              thickness={4}
              sx={{ color: theme.palette.primary.main }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
      {/* Contenedor principal de la página */}
      <div className="p-3 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {/* HEADER DEL CARD */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Anuncios Promocionales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona los anuncios que aparecerán en la app móvil
              </Typography>
            </Box>

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
                    : "Crear y solicitar permiso"}
            </Button>
          </Stack>

          {/* --- MENSAJES DE ESTADO (Alertas) --- */}
          {pendingRequest && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HourglassEmpty />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Solicitud pendiente de aprobación
                  </Typography>
                  <Typography variant="caption">
                    Tu solicitud para crear un anuncio está siendo revisada por
                    el administrador.
                  </Typography>
                </Box>
              </Stack>
            </Alert>
          )}

          {hasActiveAd && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
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

          {/* --- LISTADO DE ANUNCIOS / EMPTY STATE --- */}
          {adsList.length === 0 && !hasActiveAd && !pendingRequest ? (
            <AdsEmptyState />
          ) : (
            <Grid2 container spacing={3}>
              {adsList.map((ad) => (
                <Grid2 size={{ xs: 12, md: 12, lg: 6 }} key={ad.id}>
                  <PromotionalBanner
                    label={ad.label || ad.badge_text || ""}
                    discount={ad.discount || ad.title || ""}
                    description={ad.description || ad.subtitle || ""}
                    buttonText={ad.buttonText || ad.action_text || ""}
                    imageUrl={ad.imageUrl || ad.image_url || undefined}
                    endDate={ad.endDate || ad.end_date || undefined}
                  />
                </Grid2>
              ))}
            </Grid2>
          )}
        </div>
        {/* Fin del Card Blanco */}

        {/* Modal de Creación */}
        <CreateAdModal
          open={isCreateAdModalOpen}
          onClose={() => setIsCreateAdModalOpen(false)}
          onCreateAd={handleRequestPermission}
          submitButtonText="Enviar solicitud"
        />
      </div>
    </DashboardLayout>
  );
};
