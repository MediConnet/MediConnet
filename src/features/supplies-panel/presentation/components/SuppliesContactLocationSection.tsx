import { LocationOn, WhatsApp, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";
import { EditContactLocationModal } from "./EditContactLocationModal";

interface SuppliesContactLocationSectionProps {
  data: SupplyDashboard;
  onUpdate: (updatedData: SupplyDashboard) => void;
}

export const SuppliesContactLocationSection = ({
  data,
  onUpdate,
}: SuppliesContactLocationSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = data.supply.whatsapp.replace(/\s+/g, "").replace("+", "");
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const handleLocationClick = () => {
    // Abrir Google Maps con la dirección
    const address = encodeURIComponent(data.supply.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
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
              Contacto y Ubicación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Información de contacto y ubicación de tu negocio
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

        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "#f0fdfa",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <WhatsApp sx={{ color: "#10b981", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    WhatsApp
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {data.supply.whatsapp}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                sx={{
                  bgcolor: "#10b981",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#059669",
                  },
                }}
              >
                Contactar por WhatsApp
              </Button>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "#f0f9ff",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <LocationOn sx={{ color: "#06b6d4", fontSize: 28 }} />
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Dirección
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ wordBreak: "break-word" }}>
                    {data.supply.address}
                  </Typography>
                  {data.supply.google_maps_url && (
                    <Box mt={1}>
                      <Typography
                        component="a"
                        href={data.supply.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{
                          color: "#06b6d4",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                          wordBreak: "break-all",
                          display: "inline-block",
                        }}
                      >
                        Ver en Google Maps →
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<LocationOn />}
                onClick={handleLocationClick}
                sx={{
                  borderColor: "#06b6d4",
                  color: "#06b6d4",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#0891b2",
                    bgcolor: "#f0fdfa",
                  },
                }}
              >
                Ver en Google Maps
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Paper>

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

