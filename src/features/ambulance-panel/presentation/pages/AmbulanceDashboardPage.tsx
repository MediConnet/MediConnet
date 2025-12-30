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
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { KPICard } from "../components/KPICard";
import { useAmbulanceProfile } from "../hooks/useAmbulanceProfile";

// Mock del usuario logueado (Ambulancia)
const AMBULANCE_USER = {
  name: "Ambulancias Vida",
  roleLabel: "Proveedor",
  initials: "AV",
  isActive: true,
};

export const AmbulanceDashboardPage = () => {
  const { profile, isLoading } = useAmbulanceProfile();

  if (isLoading || !profile) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={AMBULANCE_USER}>
        <Box p={3}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={400} />
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
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Panel Profesional
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona tu presencia en la app de Mediciones
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "success.light",
              color: "success.contrastText",
              borderRadius: 10,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Servicio Activo
          </Box>
        </Box>

        {/* SECCIÓN 1: KPIs (Tarjetas Superiores) */}
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Visitas al perfil"
              value={profile.stats.profileViews}
              icon={<Visibility sx={{ color: "#009688" }} />}
              iconColor="#E0F2F1"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Contactos (Leads)"
              value={profile.stats.contactClicks}
              icon={<ContactPhone sx={{ color: "#2196F3" }} />}
              iconColor="#E3F2FD"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Reseñas"
              value={profile.stats.totalReviews}
              icon={<Star sx={{ color: "#FF9800" }} />}
              iconColor="#FFF3E0"
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

        {/* SECCIÓN 2: Contenido Principal (Formulario y Preview) */}
        <Grid2 container spacing={4}>
          {/* COLUMNA IZQUIERDA: Formulario de Edición */}
          <Grid2 size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.100",
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight={700}>
                  Información del Perfil
                </Typography>
                <Button variant="outlined" startIcon={<Edit />} size="small">
                  Editar
                </Button>
              </Box>

              <Stack spacing={3}>
                {/* Fila 1 */}
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Nombre Comercial"
                      defaultValue={profile.commercialName}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Teléfono Emergencia"
                      defaultValue={profile.emergencyPhone}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    />
                  </Grid2>
                </Grid2>

                {/* Fila 2 */}
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="WhatsApp Corporativo"
                      defaultValue={profile.whatsappContact}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Dirección Base"
                      defaultValue={profile.address}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    />
                  </Grid2>
                </Grid2>

                <TextField
                  fullWidth
                  label="Descripción Corta"
                  multiline
                  rows={3}
                  defaultValue={profile.shortDescription}
                  helperText="Este texto aparecerá en la búsqueda de la app"
                  slotProps={{
                    input: { readOnly: true },
                  }}
                />
              </Stack>
            </Paper>
          </Grid2>

          {/* COLUMNA DERECHA: Vista Previa en App */}
          <Grid2 size={{ xs: 12, lg: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Vista previa en App
            </Typography>

            {/* Simulador de Tarjeta de App Móvil */}
            <Paper
              elevation={3}
              sx={{
                p: 0,
                borderRadius: 4,
                overflow: "hidden",
                maxWidth: 320,
                mx: "auto",
                bgcolor: "white",
              }}
            >
              {/* Imagen Banner */}
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
                    ({profile.stats.totalReviews} reseñas)
                  </Typography>
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  {profile.address}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<WhatsApp />}
                  sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                >
                  Contactar
                </Button>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
    </DashboardLayout>
  );
};
