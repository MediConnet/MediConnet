import { LocationOn, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { EditContactLocationModal } from "./EditContactLocationModal";

interface LaboratoryContactLocationSectionProps {
  data: LaboratoryDashboard;
  onUpdate: (updatedData: LaboratoryDashboard) => void;
}

export const LaboratoryContactLocationSection = ({
  data,
  onUpdate,
}: LaboratoryContactLocationSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = data.laboratory.whatsapp.replace(/\s+/g, "").replace("+", "");
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const handleLocationClick = () => {
    if (data.laboratory.location) {
      const { latitude, longitude } = data.laboratory.location;
      window.open(
        `https://www.google.com/maps?q=${latitude},${longitude}`,
        "_blank"
      );
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
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Contacto y Ubicación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Información de contacto y ubicación de tu laboratorio
            </Typography>
          </Box>
          <Button
            variant="outlined"
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

        <Grid2 container spacing={3}>
          {/* WhatsApp */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <WhatsApp sx={{ color: "#25D366", fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    WhatsApp
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {data.laboratory.whatsapp || "No configurado"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                disabled={!data.laboratory.whatsapp}
                sx={{
                  bgcolor: "#25D366",
                  "&:hover": { bgcolor: "#20BA5A" },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Abrir WhatsApp
              </Button>
            </Paper>
          </Grid2>

          {/* Dirección */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <LocationOn sx={{ color: "error.main", fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Dirección
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {data.laboratory.location?.address || data.laboratory.address || "No configurado"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<LocationOn />}
                onClick={handleLocationClick}
                disabled={!data.laboratory.location}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Ver en Mapa
              </Button>
            </Paper>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Modal de Edición */}
      <EditContactLocationModal
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

