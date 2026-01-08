import {
  ContactPhone,
  Edit,
  Star,
  Visibility,
  WhatsApp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";
import { EditProfileModal } from "../components/EditProfileModal";
import { KPICard } from "../components/KPICard";
import { useAmbulanceProfile } from "../hooks/useAmbulanceProfile";

const AMBULANCE_USER = {
  name: "Ambulancias Vida",
  roleLabel: "Proveedor",
  initials: "AV",
  isActive: true,
};

export const AmbulanceDashboardPage = () => {
  const theme = useTheme();
  const { profile: fetchedProfile, isLoading } = useAmbulanceProfile();
  const [profile, setProfile] = useState<AmbulanceProfile | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (fetchedProfile) {
      setProfile(fetchedProfile);
    }
  }, [fetchedProfile]);

  const handleSaveChanges = (updatedProfile: AmbulanceProfile) => {
    setProfile(updatedProfile);
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
            height={400}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* SECTION 1: KPIS (Subidos) */}
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

        {/* SECTION 2: MAIN CONTENT */}
        <Grid2 container spacing={4}>
          {/* LEFT COLUMN: Profile Info */}
          <Grid2 size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Información del Perfil
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestiona los datos visibles en la app
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditOpen(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Editar
                </Button>
              </Box>

              <Stack spacing={3}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Nombre Comercial
                    </Typography>
                    <Typography variant="body1" fontWeight={500} mt={0.5}>
                      {profile.commercialName}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Teléfono Emergencia
                    </Typography>
                    <Typography variant="body1" fontWeight={500} mt={0.5}>
                      {profile.emergencyPhone}
                    </Typography>
                  </Grid2>
                </Grid2>

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Email de contacto
                    </Typography>
                    <Typography variant="body1" fontWeight={500} mt={0.5}>
                      ambulancia@medicones.com
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      WhatsApp
                    </Typography>
                    <Typography variant="body1" fontWeight={500} mt={0.5}>
                      {profile.whatsappContact}
                    </Typography>
                  </Grid2>
                </Grid2>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Dirección Base
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mt={0.5}>
                    {profile.address}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Descripción
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={0.5}
                    sx={{ lineHeight: 1.6 }}
                  >
                    {profile.shortDescription}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>

          {/* RIGHT COLUMN: Preview */}
          <Grid2 size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={3}>
                Vista previa en App
              </Typography>

              {/* Phone Card Simulator */}
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "grey.300",
                  borderRadius: 4,
                  p: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    maxWidth: 320,
                    mx: "auto",
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      width: "100%",
                      bgcolor: "grey.200",
                      backgroundImage: `url(${profile.bannerUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <Box p={2}>
                    <Typography variant="h6" fontWeight={700} fontSize="1rem">
                      {profile.commercialName}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      mt={0.5}
                    >
                      <Star sx={{ fontSize: 16, color: "#FFC107" }} />
                      <Typography variant="caption" fontWeight={600}>
                        {profile.stats.averageRating}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({profile.stats.totalReviews})
                      </Typography>
                    </Stack>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      📍 {profile.address}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="primary.main"
                      fontWeight={600}
                      display="block"
                      mt={1}
                    >
                      📞 {profile.emergencyPhone}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<WhatsApp />}
                      size="small"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      Contactar
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        {/* MODAL */}
        <EditProfileModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={profile}
          onSave={handleSaveChanges}
        />
      </Box>
    </DashboardLayout>
  );
};
