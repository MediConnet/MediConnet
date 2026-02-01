import { useSearchParams } from "react-router-dom";
import {
  Star,
  TouchApp,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { KPICard } from "../components/KPICard";
import { usePharmacyProfile } from "../hooks/usePharmacyProfile";
import { ProfileSection } from "../components/ProfileSection";
import { ScheduleSection } from "../components/ScheduleSection";
import { ContactLocationSection } from "../components/ContactLocationSection";
import { DashboardContent } from "../components/DashboardContent";
import { useAuthStore } from "../../../../app/store/auth.store";

type TabType = "dashboard" | "profile";

export const PharmacyDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { profile, isLoading, setProfile } = usePharmacyProfile();
  const authStore = useAuthStore();
  const { user } = authStore;

  const currentTab = (searchParams.get("tab") || "dashboard") as TabType;

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
    roleLabel: "Administrador de Marca",
    initials: getInitials(user?.name || "FA"),
    isActive: true,
  };

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile}>
        <Box p={3}>
          <Skeleton
            variant="rectangular"
            height={150}
            sx={{ mb: 3, borderRadius: 3 }}
          />
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={userProfile}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* Cards de Estadísticas - Solo mostrar en la pestaña de dashboard */}
        {currentTab === "dashboard" && (
          <Grid2 container spacing={3} mb={4}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <KPICard
                title="Visitas al Perfil"
                value={profile.stats?.profileViews || 0}
                icon={<Visibility sx={{ color: theme.palette.primary.main }} />}
                iconColor={theme.palette.primary.light + "20"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <KPICard
                title="Interacciones Totales"
                value={profile.stats?.contactClicks || 0}
                icon={<TouchApp sx={{ color: theme.palette.info.main }} />}
                iconColor={theme.palette.info.light + "20"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <KPICard
                title="Total Reseñas"
                value={profile.stats?.totalReviews || 0}
                icon={<Star sx={{ color: theme.palette.warning.main }} />}
                iconColor={theme.palette.warning.light + "20"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <KPICard
                title="Calificación Global"
                value={profile.stats?.averageRating || 0}
                icon={<Star sx={{ color: "#FFC107" }} />}
                iconColor="#FFF8E1"
              />
            </Grid2>
          </Grid2>
        )}

        {/* Contenido según la pestaña activa */}
        <div className={currentTab === "dashboard" ? "" : "mt-6"}>
          {currentTab === "dashboard" && (
            <Box>
              <Box mb={3}>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resumen de tus estadísticas y métricas principales
                </Typography>
              </Box>
              <DashboardContent profile={profile} />
            </Box>
          )}
          {currentTab === "profile" && (
            <Box>
              <Box mb={2}>
                <Typography variant="h3" fontWeight={800} mb={0.5}>
                  Mi Farmacia
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                  Gestiona el perfil, horarios y contacto de tu farmacia
                </Typography>
              </Box>
              <Stack spacing={4}>
                {/* Mi Perfil Farmacia */}
                <ProfileSection
                  profile={profile}
                  onUpdate={(updatedProfile) => {
                    setProfile(updatedProfile);
                  }}
                />

                {/* Horarios de Atención */}
                <ScheduleSection
                  profile={profile}
                  onUpdate={(updatedProfile) => {
                    setProfile(updatedProfile);
                  }}
                />

                {/* Contacto y Ubicación */}
                <ContactLocationSection
                  profile={profile}
                  onUpdate={(updatedProfile) => {
                    setProfile(updatedProfile);
                  }}
                />
              </Stack>
            </Box>
          )}
        </div>
      </Box>
    </DashboardLayout>
  );
};
