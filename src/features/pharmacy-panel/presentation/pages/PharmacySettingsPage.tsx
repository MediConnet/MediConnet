import { ContactPhone, Star, Visibility } from "@mui/icons-material";
import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { KPICard } from "../components/KPICard";
import { usePharmacyProfile } from "../hooks/usePharmacyProfile";
import { usePharmacySettings } from "../hooks/usePharmacySettings";

const PHARMACY_USER = {
  name: "Fybeca Admin",
  roleLabel: "Farmacia",
  initials: "FA",
  isActive: true,
};

export const PharmacySettingsPage = () => {
  const theme = useTheme();
  const { profile, isLoading: isLoadingProfile } = usePharmacyProfile();

  const {
    settings,
    isLoading: isLoadingSettings,
    toggleNotification,
  } = usePharmacySettings();

  const isLoading = isLoadingProfile || isLoadingSettings;

  if (isLoading || !profile || !settings) {
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
            height={200}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={PHARMACY_USER}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* SECTION 1: KPIS (Contexto visual) */}
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

        {/* SECTION 2: CONFIGURACIÓN FORM */}
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
          <Box mb={4}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Configuración
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajustes de tu cuenta y notificaciones
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Notificaciones
            </Typography>

            <Stack spacing={0} divider={<Divider sx={{ my: 2 }} />}>
              {/* Opción 1: Nuevas Reseñas */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
              >
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    Nuevas reseñas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recibir notificación cuando llegue una reseña
                  </Typography>
                </Box>
                <Switch
                  checked={settings.notifications.newReviews}
                  onChange={() => toggleNotification("newReviews")}
                  color="primary"
                />
              </Box>

              {/* Opción 2: Contactos */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
              >
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    Contactos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notificar cuando alguien contacte por WhatsApp
                  </Typography>
                </Box>
                <Switch
                  checked={settings.notifications.whatsappContacts}
                  onChange={() => toggleNotification("whatsappContacts")}
                  color="primary"
                />
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
