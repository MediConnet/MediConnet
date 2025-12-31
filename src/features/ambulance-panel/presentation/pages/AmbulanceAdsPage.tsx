import { Add, ContactPhone, Star, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";

// Componentes y Hooks locales
import { AdsEmptyState } from "../components/AdsEmptyState";
import { KPICard } from "../components/KPICard";
import { useAmbulanceAds } from "../hooks/useAmbulanceAds";
import { useAmbulanceProfile } from "../hooks/useAmbulanceProfile";

// Mock user para el layout
const AMBULANCE_USER = {
  name: "Ambulancias Vida",
  roleLabel: "Proveedor",
  initials: "AV",
  isActive: true,
};

export const AmbulanceAdsPage = () => {
  const theme = useTheme();

  // 1. Obtener datos de perfil para KPIs
  const { profile, isLoading: isLoadingProfile } = useAmbulanceProfile();
  // 2. Obtener lista de anuncios
  const { ads, isLoading: isLoadingAds } = useAmbulanceAds();

  const isLoading = isLoadingProfile || isLoadingAds;

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
        {/* HEADER */}
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Panel Profesional
          </Typography>
        </Box>

        {/* KPIs (Reutilizando lógica visual de Farmacia/Dashboard) */}
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
              startIcon={<Add />}
              sx={{
                color: "white",
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
                px: 3,
              }}
              onClick={() => console.log("Crear anuncio ambulancia")}
            >
              Crear anuncio
            </Button>
          </Stack>

          {ads.length === 0 ? (
            <AdsEmptyState />
          ) : (
            <Typography>Listado de anuncios de ambulancia...</Typography>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
};
