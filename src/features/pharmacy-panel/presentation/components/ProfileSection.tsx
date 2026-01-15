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
      <Grid2 container spacing={3}>
        {/* Columna izquierda: Información del Perfil */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              height: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Typography variant="h5" fontWeight={700}>
                Mi Perfil Farmacia
              </Typography>
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
        </Grid2>

        {/* Columna derecha: Vista previa en App */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              height: "100%",
            }}
          >
        <Typography variant="h6" fontWeight={700} mb={4}>
          Vista previa en App
        </Typography>

        <Box display="flex" justifyContent="center">
          {/* Card móvil de farmacia */}
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              overflow: "hidden",
              width: "100%",
              maxWidth: "300px",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "grey.100",
              pb: 2,
            }}
          >
            {/* Imagen (Cover) */}
            <Box
              sx={{
                height: 176,
                width: "100%",
                bgcolor: "grey.200",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profile.logoUrl ? (
                <Box
                  component="img"
                  src={profile.logoUrl}
                  alt={profile.commercialName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    color: "grey.400",
                  }}
                >
                  <Business sx={{ fontSize: 48, opacity: 0.5 }} />
                </Box>
              )}
            </Box>

            {/* Contenido */}
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Nombre */}
              <Typography
                variant="h6"
                fontWeight={900}
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                {profile.commercialName || "Nombre de la Farmacia"}
              </Typography>

              {/* Estado */}
              <Box sx={{ mb: 1 }}>
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
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* Descripción */}
              <Box sx={{ mt: 1, width: "100%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {profile.description || "Descripción de la farmacia..."}
                </Typography>
              </Box>

              {/* Información de Contacto */}
              <Box sx={{ mt: 1, width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Dirección */}
                {profile.address && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {profile.address}
                    </Typography>
                  </Box>
                )}

                {/* Sitio Web */}
                {profile.websiteUrl && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Public sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {profile.websiteUrl}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Botón Ver Farmacia */}
              <Box sx={{ mt: 2, width: "100%" }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    textAlign: "center",
                    fontWeight: 700,
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    width: "100%",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                    cursor: "default",
                  }}
                >
                  <Visibility sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={700}>
                    Ver Farmacia
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center", display: "block", mt: 2 }}
        >
          Así verán tu perfil los usuarios en la app
        </Typography>
          </Paper>
        </Grid2>
      </Grid2>

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

