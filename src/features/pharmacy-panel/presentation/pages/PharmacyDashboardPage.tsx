import {
  Business,
  Description as DescriptionIcon,
  Edit,
  Language,
  Star,
  TouchApp,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Link,
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

const PHARMACY_USER = {
  name: "Fybeca Admin",
  roleLabel: "Administrador de Marca",
  initials: "FA",
  isActive: true,
};

export const PharmacyDashboardPage = () => {
  const theme = useTheme();
  const { profile, isLoading, setProfile } = usePharmacyProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

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
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Panel Corporativo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona la identidad de tu marca para todas las sucursales
            </Typography>
          </Box>
        </Box>

        {/* SECTION 1: KPIS (Métricas Globales de Marca) */}
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

        {/* SECTION 2: CONTENIDO PRINCIPAL */}
        <Grid2 container spacing={4}>
          {/* COLUMNA IZQUIERDA: Identidad Corporativa */}
          <Grid2 size={{ xs: 12, lg: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                height: "100%",
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
                    Identidad de Marca
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Información visible en el listado principal
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

              <Stack spacing={4}>
                {/* Nombre y RUC */}
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Nombre Comercial
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        mt={0.5}
                        color="primary.main"
                      >
                        {profile.commercialName}
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <Business
                        sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          RUC / Razón Social
                        </Typography>
                        <Typography variant="body1" fontWeight={500} mt={0.5}>
                          {profile.ruc || "No registrado"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>
                </Grid2>

                <Divider />

                {/* Slogan */}
                <Box display="flex" gap={2}>
                  <DescriptionIcon sx={{ color: "text.secondary", mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Slogan / Descripción
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      mt={0.5}
                      sx={{
                        fontStyle: profile.description ? "normal" : "italic",
                      }}
                    >
                      {profile.description || "Sin descripción definida."}
                    </Typography>
                  </Box>
                </Box>

                {/* Website */}
                <Box display="flex" gap={2}>
                  <Language sx={{ color: "text.secondary", mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Sitio Web Oficial
                    </Typography>
                    <Box mt={0.5}>
                      {profile.websiteUrl ? (
                        <Link
                          href={
                            profile.websiteUrl.startsWith("http")
                              ? profile.websiteUrl
                              : `https://${profile.websiteUrl}`
                          }
                          target="_blank"
                          rel="noopener"
                          underline="hover"
                          fontWeight={500}
                        >
                          {profile.websiteUrl}
                        </Link>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontStyle="italic"
                        >
                          No configurado
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid2>

          {/* COLUMNA DERECHA: Vista Previa (Brand Card) */}
          <Grid2 size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
                textAlign="center"
              >
                Vista Previa en App
              </Typography>

              {/* CARD ESTILO APP */}
              <Paper
                elevation={2}
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  borderRadius: 3,
                  bgcolor: "white",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "default",
                  border: "1px solid",
                  borderColor: "grey.100",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* LOGO */}
                <Box
                  component="img"
                  src={profile.logoUrl}
                  alt={profile.commercialName}
                  sx={{
                    width: "auto",
                    height: 60,
                    maxWidth: 180,
                    objectFit: "contain",
                    mb: 3,
                  }}
                />

                {/* Fallback si no hay logo */}
                {!profile.logoUrl && (
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color="primary.main"
                    mb={3}
                  >
                    {profile.commercialName || "TU MARCA"}
                  </Typography>
                )}

                <Box
                  sx={{
                    width: "100%",
                    height: 4,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    mt: "auto",
                    opacity: 0.8,
                  }}
                />
              </Paper>

              <Typography
                variant="caption"
                color="text.secondary"
                mt={3}
                textAlign="center"
                maxWidth={300}
              >
                * Así aparecerá tu marca en el directorio principal de farmacias
                de la aplicación móvil.
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>

        {/* MODAL DE EDICIÓN */}
        <EditPharmacyModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={profile}
          onSave={(updatedFields) => {
            const mergedProfile = { ...profile, ...updatedFields };
            setProfile(mergedProfile);
            // Aquí iría la llamada al backend pasando updatedFields o mergedProfile
          }}
        />
      </Box>
    </DashboardLayout>
  );
};
