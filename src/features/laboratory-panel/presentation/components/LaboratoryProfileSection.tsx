import {
  Description,
  Edit,
  PhotoCamera,
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
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const updatedData = {
        ...data,
        laboratory: {
          ...data.laboratory,
          logoUrl: objectUrl,
        },
      };
      onUpdate(updatedData);
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
                  onChange={handleImageChange}
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

