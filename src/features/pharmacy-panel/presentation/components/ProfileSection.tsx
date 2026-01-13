import {
  Business,
  Description,
  Edit,
  LocationOn,
  Public,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";
import { EditPharmacyModal } from "./EditPharmacyModal";

interface ProfileSectionProps {
  profile: PharmacyProfile;
  onUpdate: (updatedProfile: PharmacyProfile) => void;
}

export const ProfileSection = ({ profile, onUpdate }: ProfileSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusLabel = (status: PharmacyProfile["status"]) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "suspended":
        return "Suspendido";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: PharmacyProfile["status"]) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Mi Perfil Farmacia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Información visible en el perfil de tu farmacia
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
            Editar Perfil
          </Button>
        </Box>

        <Stack spacing={3}>
          {/* Logo y Nombre Comercial */}
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {profile.logoUrl ? (
                  <Avatar
                    src={profile.logoUrl}
                    alt={profile.commercialName}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 2,
                    }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "primary.light",
                      borderRadius: 2,
                    }}
                    variant="rounded"
                  >
                    <Business sx={{ fontSize: 60 }} />
                  </Avatar>
                )}
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Stack spacing={1}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary.main"
                >
                  {profile.commercialName}
                </Typography>
                <Chip
                  label={getStatusLabel(profile.status)}
                  color={getStatusColor(profile.status)}
                  size="small"
                  icon={
                    profile.status === "published" ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )
                  }
                  sx={{ width: "fit-content" }}
                />
              </Stack>
            </Grid2>
          </Grid2>

          <Divider />

          {/* Descripción */}
          <Box display="flex" gap={2}>
            <Description sx={{ color: "text.secondary", mt: 0.5 }} />
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Descripción Corta
              </Typography>
              <Typography variant="body1" color="text.primary" mt={0.5}>
                {profile.description || "Sin descripción definida."}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Estado del Servicio */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              mb={1}
              display="block"
            >
              Estado del Servicio
            </Typography>
            <Chip
              label={profile.isActive !== false ? "Activo" : "Inactivo"}
              color={profile.isActive !== false ? "success" : "error"}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Divider />

          {/* Dirección */}
          <Box display="flex" gap={2}>
            <LocationOn sx={{ color: "text.secondary", mt: 0.5 }} />
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Dirección
              </Typography>
              <Typography variant="body1" color="text.primary" mt={0.5}>
                {profile.address || "Sin dirección registrada."}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Website */}
          {profile.websiteUrl && (
            <>
              <Box display="flex" gap={2}>
                <Public sx={{ color: "text.secondary", mt: 0.5 }} />
                <Box flex={1}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Sitio Web
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary.main"
                    mt={0.5}
                    component="a"
                    href={
                      profile.websiteUrl.startsWith("http")
                        ? profile.websiteUrl
                        : `https://${profile.websiteUrl}`
                    }
                    target="_blank"
                    rel="noopener"
                    sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                  >
                    {profile.websiteUrl}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </>
          )}
        </Stack>
      </Paper>

      {/* Modal de Edición */}
      <EditPharmacyModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={profile}
        onSave={(updatedFields) => {
          const mergedProfile = { ...profile, ...updatedFields };
          onUpdate(mergedProfile);
        }}
      />
    </Box>
  );
};

