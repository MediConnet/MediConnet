import { ContactPhone, Star, Visibility } from "@mui/icons-material";
import { Box, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { KPICard } from "../components/KPICard";
import { ReviewItem } from "../components/ReviewItem";
import { useAmbulanceProfile } from "../hooks/useAmbulanceProfile";
import { useAmbulanceReviews } from "../hooks/useAmbulanceReviews";

// Mock del usuario logueado
const AMBULANCE_USER = {
  name: "Ambulancias Vida",
  roleLabel: "Proveedor",
  initials: "AV",
  isActive: true,
};

export const AmbulanceReviewsPage = () => {
  const theme = useTheme();
  // 1. Hook del perfil para los KPIs (Visitas, Rating global, etc)
  const { profile, isLoading: isLoadingProfile } = useAmbulanceProfile();
  // 2. Hook de reseñas para la lista
  const { reviews, isLoading: isLoadingReviews } = useAmbulanceReviews();

  const isLoading = isLoadingProfile || isLoadingReviews;

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
        <Box p={3}>
          <Skeleton
            variant="rectangular"
            height={150}
            sx={{ mb: 3, borderRadius: 3 }}
          />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
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
          <Box
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "success.light",
              color: "success.contrastText",
              borderRadius: 10,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Servicio Activo
          </Box>
        </Box>

        {/* SECTION 1: KPIS (Reutilizados para consistencia visual) */}
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

        {/* SECTION 2: LISTA DE RESEÑAS */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            bgcolor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <Box mb={3}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Reseñas de Pacientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Valoraciones recibidas desde la aplicación móvil
            </Typography>
          </Box>

          <Box>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}

            {reviews.length === 0 && (
              <Typography color="text.secondary" align="center" py={4}>
                Aún no tienes reseñas.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
