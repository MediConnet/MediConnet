import { ContactPhone, Star, Visibility } from "@mui/icons-material";
import { Box, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { KPICard } from "../components/KPICard";
import { PharmacyReviewItem } from "../components/PharmacyReviewItem";
import { usePharmacyProfile } from "../hooks/usePharmacyProfile";
import { usePharmacyReviews } from "../hooks/usePharmacyReviews";
import { useAuthStore } from "../../../../app/store/auth.store";

export const PharmacyReviewsPage = () => {
  const theme = useTheme();
  const { profile, isLoading: isLoadingProfile } = usePharmacyProfile();
  const { reviews, isLoading: isLoadingReviews } = usePharmacyReviews();
  const authStore = useAuthStore();
  const { user } = authStore;

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userProfile = {
    name: user?.name || "Farmacia",
    roleLabel: "Farmacia",
    initials: getInitials(user?.name || "FA"),
    isActive: true,
  };

  const isLoading = isLoadingProfile || isLoadingReviews;

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile}>
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
    <DashboardLayout role="PROVIDER" userProfile={userProfile}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* SECTION 1: KPIS (Resumen) */}
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Visitas al perfil"
              value={profile?.stats?.profileViews || 0}
              icon={<Visibility sx={{ color: theme.palette.primary.main }} />}
              iconColor={theme.palette.primary.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Clics en contacto"
              value={profile?.stats?.contactClicks || 0}
              icon={<ContactPhone sx={{ color: theme.palette.info.main }} />}
              iconColor={theme.palette.info.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Reseñas"
              value={profile?.stats?.totalReviews || 0}
              icon={<Star sx={{ color: theme.palette.warning.main }} />}
              iconColor={theme.palette.warning.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Rating Promedio"
              value={profile?.stats?.averageRating || 0}
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
              Reseñas de Clientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Valoraciones recibidas sobre tus productos y servicios
            </Typography>
          </Box>

          <Box>
            {reviews.map((review) => (
              <PharmacyReviewItem key={review.id} review={review} />
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
