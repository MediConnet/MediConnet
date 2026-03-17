import {
  Description,
  Edit,
  PhotoCamera,
  LocationOn,
  AccessTime,
  CloudUpload,
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
import { useState, useRef } from "react";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { EditLaboratoryProfileModal } from "./EditLaboratoryProfileModal";

interface LaboratoryProfileSectionProps {
  data: LaboratoryDashboard;
  onUpdate: (updatedData: LaboratoryDashboard) => void;
}

export const LaboratoryProfileSection = ({
  data,
  onUpdate,
}: LaboratoryProfileSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    // The real upload happens inside "Editar Perfil".
    setIsEditOpen(true);
  };

  // Colores del tema para laboratorio (morado)
  const themeColor = "#9333ea"; // Morado vibrante
  const bgCardColor = "#f3e8ff"; // Fondo lila suave

  // Función para generar el texto del horario
  const getScheduleText = () => {
    if (!data.laboratory.workSchedule || data.laboratory.workSchedule.length === 0) {
      return data.laboratory.schedule || "Horario no definido";
    }

    const activeDays = data.laboratory.workSchedule.filter((s) => s.isOpen);
    if (activeDays.length === 0) return "Cerrado temporalmente";

    const dayMap: Record<string, string> = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom",
    };

    const startDay = dayMap[activeDays[0].day];
    const endDay = dayMap[activeDays[activeDays.length - 1].day];
    const startTime = activeDays[0].startTime;
    const endTime = activeDays[0].endTime;

    if (activeDays.length === 1) {
      return `${startDay} ${startTime}-${endTime}`;
    }

    return `${startDay}-${endDay} ${startTime}-${endTime}`;
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
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Mi Perfil del Laboratorio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Información visible en el perfil de tu laboratorio
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
          {/* Logo y Nombre */}
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={() => {}}
                />
                {data.laboratory.logoUrl ? (
                  <Avatar
                    src={data.laboratory.logoUrl}
                    alt={data.laboratory.name}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                    variant="rounded"
                    onClick={handleImageClick}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "primary.light",
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                    variant="rounded"
                    onClick={handleImageClick}
                  >
                    <PhotoCamera sx={{ fontSize: 40 }} />
                  </Avatar>
                )}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
                mt={1}
                sx={{ cursor: "pointer" }}
                onClick={handleImageClick}
              >
                Click para cambiar logo
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Stack spacing={1}>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {data.laboratory.name}
                </Typography>
              </Stack>
            </Grid2>
          </Grid2>

          {/* Descripción */}
          <Box display="flex" gap={2}>
            <Description sx={{ color: "text.secondary", mt: 0.5 }} />
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Descripción
              </Typography>
              <Typography variant="body1" color="text.primary" mt={0.5}>
                {data.laboratory.description || "Sin descripción definida."}
              </Typography>
            </Box>
          </Box>

          {/* Estado del Servicio */}
          <Divider />
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
              label={data.laboratory.isActive !== false ? "Activo" : "Inactivo"}
              color={data.laboratory.isActive !== false ? "success" : "error"}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Stack>
      </Paper>
        </Grid2>

        {/* Columna derecha: Vista previa en App */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          {/* Sección de carga de imagen */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Imagen de Perfil
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={() => {}}
            />
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "grey.100",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                {data.laboratory.logoUrl ? (
                  <Box
                    component="img"
                    src={data.laboratory.logoUrl}
                    alt={data.laboratory.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <PhotoCamera sx={{ color: "grey.400" }} />
                )}
              </Box>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => setIsEditOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {data.laboratory.logoUrl ? "Cambiar foto" : "Subir foto"}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Se recomienda una imagen rectangular para el banner.
            </Typography>
          </Paper>

          {/* Vista previa en App */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={3}>
              Vista previa en App
            </Typography>

            <Box display="flex" justifyContent="center">
              {/* Card móvil de laboratorio */}
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "grey.100",
                }}
              >
                {/* Imagen Superior */}
                <Box
                  sx={{
                    height: 176,
                    width: "100%",
                    bgcolor: "grey.200",
                    position: "relative",
                  }}
                >
                  {data.laboratory.logoUrl ? (
                    <Box
                      component="img"
                      src={data.laboratory.logoUrl}
                      alt={data.laboratory.name}
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
                      <PhotoCamera sx={{ fontSize: 40, opacity: 0.5 }} />
                    </Box>
                  )}
                </Box>

                {/* Contenido (Fondo Lila Suave) */}
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    bgcolor: bgCardColor,
                  }}
                >
                  {/* Nombre */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "grey.900",
                      lineHeight: 1.2,
                    }}
                  >
                    {data.laboratory.name}
                  </Typography>

                  {/* Info: Dirección */}
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <LocationOn
                      sx={{ fontSize: 18, color: "grey.600", mt: 0.5, flexShrink: 0 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "grey.600", lineHeight: 1.4 }}
                    >
                      {data.laboratory.address || "Dirección"}
                    </Typography>
                  </Box>

                  {/* Info: Horario */}
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <AccessTime
                      sx={{ fontSize: 18, color: "grey.600", mt: 0.5, flexShrink: 0 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "grey.600", lineHeight: 1.4 }}
                    >
                      {getScheduleText()}
                    </Typography>
                  </Box>

                  {/* Botón Ver Información */}
                  <Box mt={1} width="100%">
                    <Box
                      sx={{
                        bgcolor: themeColor,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        px: 2,
                        py: 1.25,
                        borderRadius: 2,
                        textAlign: "center",
                        cursor: "default",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      Ver información
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
              mt={2}
            >
              Así verán tu perfil los pacientes en la app
            </Typography>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Modal de Edición */}
      <EditLaboratoryProfileModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        data={data}
        onSave={(updatedData) => {
          onUpdate(updatedData);
        }}
      />
    </Box>
  );
};

