import { Add, ContactPhone, Star, Visibility, CheckCircle, HourglassEmpty, Send, Campaign } from "@mui/icons-material";
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";

// Componentes y Hooks locales
import { AdsEmptyState } from "../components/AdsEmptyState";
import { KPICard } from "../components/KPICard";
import { useAmbulanceAds } from "../hooks/useAmbulanceAds";
import { useAmbulanceProfile } from "../hooks/useAmbulanceProfile";
import { useAdRequest } from "../hooks/useAdRequest";
import { CreateAdModal } from "../components/CreateAdModal";

const AMBULANCE_USER = {
  name: "Ambulancias Vida",
  roleLabel: "Proveedor",
  initials: "AV",
  isActive: true,
};

export const AmbulanceAdsPage = () => {
  const theme = useTheme();
  const { pendingRequest, hasActiveAd, hasApprovedRequest, isLoading: isLoadingAdRequest, createRequest, refetch } = useAdRequest();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const { profile, isLoading: isLoadingProfile } = useAmbulanceProfile();
  const { ads, isLoading: isLoadingAds } = useAmbulanceAds();

  const isLoading = isLoadingProfile || isLoadingAds || isLoadingAdRequest;

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

  const handleCreateAdClick = () => {
    if (hasActiveAd || pendingRequest) {
      return; // Ya tiene anuncio o solicitud pendiente
    }
    setIsCreateAdModalOpen(true);
  };

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
        <Box p={3}>
          <Skeleton
            variant="rectangular"
            height={150}
            sx={{ mb: 3, borderRadius: 3 }}
          />
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* KPIs (Contenido principal subido) */}
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Visitas al perfil"
              value={profile.stats.profileViews}
              icon={<Visibility sx={{ color: theme.palette.primary.main }} />}
              iconColor={theme.palette.primary.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Contactos"
              value={profile.stats.contactClicks}
              icon={<ContactPhone sx={{ color: theme.palette.info.main }} />}
              iconColor={theme.palette.info.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Reseñas"
              value={profile.stats.totalReviews}
              icon={<Star sx={{ color: theme.palette.warning.main }} />}
              iconColor={theme.palette.warning.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Rating"
              value={profile.stats.averageRating}
              icon={<Star sx={{ color: "#FFC107" }} />}
              iconColor="#FFF8E1"
            />
          </Grid2>
        </Grid2>

        {/* SECCIÓN ANUNCIOS */}
        <Box mb={3}>
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
              disabled={hasActiveAd || pendingRequest || isCreating}
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

          {/* Mensajes de estado */}
          {pendingRequest && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HourglassEmpty />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Solicitud pendiente de aprobación
                  </Typography>
                  <Typography variant="caption">
                    Tu solicitud para crear un anuncio está siendo revisada por el administrador. Te notificaremos cuando sea aprobada.
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
                    Ya tienes un anuncio publicado. Si deseas crear otro, debes solicitar permiso nuevamente al administrador.
                  </Typography>
                </Box>
              </Stack>
            </Alert>
          )}


          {ads.length === 0 && !hasActiveAd ? (
            <AdsEmptyState />
          ) : hasActiveAd ? (
            <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="body2" color="text.secondary">
                Tu anuncio activo se mostrará aquí
              </Typography>
            </Box>
          ) : (
            <Typography>Listado de anuncios de ambulancia...</Typography>
          )}
        </Box>

        {/* Modal para crear anuncio */}
        <CreateAdModal
          open={isCreateAdModalOpen}
          onClose={() => setIsCreateAdModalOpen(false)}
          onCreateAd={handleRequestPermission}
          submitButtonText="Enviar solicitud"
        />
      </Box>
    </DashboardLayout>
  );
};
