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
import { AdsEmptyState } from "../components/AdsEmptyState";
import { KPICard } from "../components/KPICard";
import { usePharmacyAds } from "../hooks/usePharmacyAds";
import { usePharmacyProfile } from "../hooks/usePharmacyProfile";
import { useAdRequest } from "../hooks/useAdRequest";
import { CreateAdModal } from "../components/CreateAdModal";

// Mock user
const PHARMACY_USER = {
  name: "Fybeca Admin",
  roleLabel: "Farmacia",
  initials: "FA",
  isActive: true,
};

export const PharmacyAdsPage = () => {
  const theme = useTheme();
  const { pendingRequest, hasActiveAd, hasApprovedRequest, isLoading: isLoadingAdRequest, createRequest, createAd, refetch } = useAdRequest();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);

  // 1. Obtener datos de perfil para KPIs
  const { profile, isLoading: isLoadingProfile } = usePharmacyProfile();
  // 2. Obtener lista de anuncios
  const { ads, isLoading: isLoadingAds } = usePharmacyAds();

  const isLoading = isLoadingProfile || isLoadingAds || isLoadingAdRequest;

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
      setIsCreateAdModalOpen(false);
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAd = async (adData: {
    title: string;
    description: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => {
    try {
      await createAd(adData);
      await refetch();
      setIsCreateAdModalOpen(false);
    } catch (error: any) {
      throw error;
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
      <DashboardLayout role="PROVIDER" userProfile={PHARMACY_USER}>
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
    <DashboardLayout role="PROVIDER" userProfile={PHARMACY_USER}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* SECCIÓN DE KPIS */}
        {/* Eliminamos el Header anterior y subimos los KPIs directamente */}
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
              title="Clics en contacto"
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
              title="Rating Promedio"
              value={profile.stats.averageRating}
              icon={<Star sx={{ color: "#FFC107" }} />}
              iconColor="#FFF8E1"
            />
          </Grid2>
        </Grid2>

        {/* SECCIÓN PRINCIPAL DE ANUNCIOS */}
        <Box mb={3}>
          {/* HEADER DE LA SECCIÓN */}
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


          {/* CONTENIDO PRINCIPAL */}
          {ads.length === 0 && !hasActiveAd && !pendingRequest ? (
            <AdsEmptyState />
          ) : hasActiveAd ? (
            <Box>
              {ads.filter(ad => ad.status === "active").length > 0 ? (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
                  {ads.filter(ad => ad.status === "active").map((ad) => (
                    <Box
                      key={ad.id}
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        boxShadow: 1,
                      }}
                    >
                      {ad.imageUrl && (
                        <Box
                          component="img"
                          src={ad.imageUrl}
                          alt={ad.title}
                          sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {ad.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {ad.description}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {ad.startDate} - {ad.endDate || "Sin fecha fin"}
                          </Typography>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: "success.light",
                              color: "success.contrastText",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Activo
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
                  <Typography variant="body2" color="text.secondary">
                    Tu anuncio activo se mostrará aquí
                  </Typography>
                </Box>
              )}
            </Box>
          ) : pendingRequest ? (
            <AdsEmptyState />
          ) : ads.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
              {ads.map((ad) => (
                <Box
                  key={ad.id}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    boxShadow: 1,
                  }}
                >
                  {ad.imageUrl && (
                    <Box
                      component="img"
                      src={ad.imageUrl}
                      alt={ad.title}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {ad.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {ad.description}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {ad.startDate} - {ad.endDate || "Sin fecha fin"}
                      </Typography>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: ad.status === "active" ? "success.light" : ad.status === "draft" ? "warning.light" : "grey.300",
                          color: ad.status === "active" ? "success.contrastText" : ad.status === "draft" ? "warning.contrastText" : "text.secondary",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {ad.status === "active" ? "Activo" : ad.status === "draft" ? "Borrador" : "Inactivo"}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <AdsEmptyState />
          )}
        </Box>

        {/* Modal para crear anuncio */}
        <CreateAdModal
          open={isCreateAdModalOpen}
          onClose={() => setIsCreateAdModalOpen(false)}
          onCreateAd={hasApprovedRequest ? handleCreateAd : handleRequestPermission}
          submitButtonText={hasApprovedRequest ? "Publicar Anuncio" : "Enviar solicitud"}
        />
      </Box>
    </DashboardLayout>
  );
};
