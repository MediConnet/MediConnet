import {
  AccessTime,
  ContactPhone,
  Edit,
  Star,
  Visibility,
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

  const ambulanceCardColor = "#06b6d4";

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
        {/* SECTION 1: KPIS */}
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

                {/* Tiempo de llegada + Dirección */}
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Tiempo medio de llegada
                    </Typography>
                    <Typography variant="body1" fontWeight={500} mt={0.5}>
                      {profile.arrivalField || 0} min
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
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
                  </Grid2>
                </Grid2>

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

          {/* RIGHT COLUMN: Preview Card */}
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

              {/* Contenedor del Card */}
              <Box display="flex" justifyContent="center">
                {/* --- CARD AMBULANCIA --- */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden w-full max-w-[320px] flex flex-col border border-gray-100 pb-4">
                  {/* Imagen + Badge */}
                  <div className="h-44 w-full bg-gray-200 relative">
                    <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md z-10">
                      Disponible
                    </div>
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#e5e7eb",
                        backgroundImage: `url(${profile.bannerUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                      {profile.commercialName}
                    </h4>

                    {/* Fila Info: Tiempo | Rating */}
                    <div className="flex items-center gap-3 text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <AccessTime sx={{ fontSize: 16 }} />
                        <span className="text-xs">
                          ~{profile.arrivalField || 0} min de llegada
                        </span>
                      </div>
                      <span className="text-xs">•</span>
                      <div className="flex items-center gap-1">
                        <Star sx={{ fontSize: 16, color: "#FFC107" }} />
                        <span className="text-xs font-medium text-gray-600">
                          {profile.stats.averageRating} (
                          {profile.stats.totalReviews})
                        </span>
                      </div>
                    </div>

                    {/* Botón Ver Ambulancia */}
                    <div className="w-full">
                      <div
                        className="text-white text-sm font-bold px-4 py-3 rounded-xl shadow-sm cursor-default flex items-center justify-center gap-2 w-full transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: ambulanceCardColor }}
                      >
                        <Visibility sx={{ fontSize: 20 }} />
                        <span>Ver Ambulancia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                display="block"
                mt={3}
              >
                Así verán tu perfil los pacientes en la app
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>

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
