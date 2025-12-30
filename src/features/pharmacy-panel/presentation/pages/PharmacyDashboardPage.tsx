import {
  AccessTime,
  ContactPhone,
  Edit,
  LocalShipping,
  LocationOn,
  Star,
  Visibility,
  WhatsApp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { EditPharmacyModal } from "../components/EditPharmacyModal";
import { KPICard } from "../components/KPICard";
import { usePharmacyProfile } from "../hooks/usePharmacyProfile";

// Mock del usuario farmacia para el header
const PHARMACY_USER = {
  name: "Fybeca Admin",
  roleLabel: "Farmacia",
  initials: "FA",
  isActive: true,
};

export const PharmacyDashboardPage = () => {
  const theme = useTheme();

  // Hook para gestionar la data del perfil
  const { profile, isLoading, setProfile } = usePharmacyProfile();

  // Estado para el modal de edición
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Estado de carga
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
            height={400}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={PHARMACY_USER}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* HEADER */}
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Panel de Farmacia
          </Typography>
          <Chip
            label="Servicio Activo"
            color="success"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Box>

        {/* SECTION 1: KPIS (Métricas clave) */}
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

        {/* SECTION 2: CONTENIDO PRINCIPAL */}
        <Grid2 container spacing={4}>
          {/* COLUMNA IZQUIERDA: Información del Perfil (Datos de Farmacia) */}
          <Grid2 size={{ xs: 12, lg: 7 }}>
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
                    Información de la Farmacia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Datos visibles para los usuarios
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
                <Box>
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
                </Box>

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Teléfono
                    </Typography>
                    <Typography variant="body1" fontWeight={500} mt={0.5}>
                      {profile.phone}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Servicio a Domicilio
                    </Typography>
                    <Box mt={0.5}>
                      {profile.hasDelivery ? (
                        <Chip
                          icon={<LocalShipping sx={{ fontSize: 16 }} />}
                          label="Disponible"
                          color="success"
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Chip
                          label="No disponible"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Grid2>
                </Grid2>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Dirección
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
                    Horario de Atención
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mt={0.5}
                  >
                    <AccessTime
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <Typography variant="body1" fontWeight={500}>
                      {profile.schedule.daysSummary}:{" "}
                      {profile.schedule.hoursSummary}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid2>

          {/* COLUMNA DERECHA: Vista Previa (Diseño de Tarjeta App) */}
          <Grid2 size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                height: "100%",
                bgcolor: "grey.50",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
                textAlign="center"
              >
                Vista previa en App
              </Typography>

              {/* Simulador de Tarjeta */}
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  maxWidth: 380,
                  mx: "auto",
                  bgcolor: "white",
                }}
              >
                {/* Banner */}
                <Box
                  sx={{
                    height: 160,
                    width: "100%",
                    bgcolor: "grey.200",
                    backgroundImage: `url(${profile.bannerUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <Box p={2.5}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    fontSize="1.1rem"
                    mb={1}
                  >
                    {profile.commercialName}
                  </Typography>

                  {/* Horario */}
                  <Stack direction="row" spacing={1} mb={1} alignItems="center">
                    <AccessTime sx={{ fontSize: 18, color: "success.main" }} />
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.primary"
                    >
                      <span style={{ fontWeight: 600 }}>Horario:</span>{" "}
                      {profile.schedule.daysSummary}{" "}
                      {profile.schedule.hoursSummary}
                    </Typography>
                  </Stack>

                  {/* Dirección */}
                  <Stack
                    direction="row"
                    spacing={1}
                    mb={2}
                    alignItems="flex-start"
                  >
                    <LocationOn
                      sx={{ fontSize: 18, color: "success.main", mt: 0.2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {profile.address}
                    </Typography>
                  </Stack>

                  {/* Banner de Envío a Domicilio */}
                  {profile.hasDelivery && (
                    <Box
                      sx={{
                        py: 1,
                        px: 1.5,
                        bgcolor: "#E8F5E9",
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <LocalShipping
                        sx={{ color: "success.main", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="success.main"
                      >
                        Envío a domicilio disponible
                      </Typography>
                    </Box>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<WhatsApp />}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: "none",
                      fontWeight: 700,
                    }}
                  >
                    Contactar por WhatsApp
                  </Button>
                </Box>

                {/* Footer Tarjeta: Rating */}
                <Box
                  p={2}
                  borderTop="1px solid"
                  borderColor="grey.100"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" fontWeight={600}>
                    Reseñas y Valoraciones
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Star sx={{ fontSize: 20, color: "#FFC107" }} />
                    <Typography variant="body1" fontWeight={700}>
                      {profile.stats.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({profile.stats.totalReviews})
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Paper>
          </Grid2>
        </Grid2>

        {/* MODAL DE EDICIÓN */}
        <EditPharmacyModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={profile}
          onSave={(newData) => {
            setProfile(newData);
            // Aquí iría la llamada a la API para guardar los cambios
          }}
        />
      </Box>
    </DashboardLayout>
  );
};
