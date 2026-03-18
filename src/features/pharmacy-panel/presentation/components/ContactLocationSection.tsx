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
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";
import { EditContactLocationModal } from "./EditContactLocationModal";
import { useUpdatePharmacyProfile } from "../hooks/usePharmacyProfile";

interface ContactLocationSectionProps {
  profile: PharmacyProfile;
  onUpdate: (updatedProfile: PharmacyProfile) => void;
}

export const ContactLocationSection = ({
  profile,
  onUpdate,
}: ContactLocationSectionProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState<string | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdatePharmacyProfile();

  const handleSave = async (updatedFields: Partial<PharmacyProfile>) => {
    try {
      const updated = await updateProfile({ ...profile, ...updatedFields });
      onUpdate(updated);
      setIsEditOpen(false);
      setSnackMsg("Contacto y ubicación guardados correctamente.");
    } catch (err: any) {
      setSnackMsg(err?.message || "Error al guardar.");
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = profile.whatsapp.replace(/\s+/g, "").replace("+", "");
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const handleLocationClick = () => {
    if (profile.location) {
      const { latitude, longitude } = profile.location;
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
              Información de contacto y ubicación de tu farmacia
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
                  {profile.whatsapp || "No configurado"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppClick}
                disabled={!profile.whatsapp}
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

          {/* Ubicación */}
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
                minWidth: 0,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <LocationOn sx={{ color: "error.main", fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Ubicación
                  </Typography>
                </Stack>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  mb={2}
                  sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  {profile.location?.address || profile.address || "No configurado"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<LocationOn />}
                onClick={handleLocationClick}
                disabled={!profile.location}
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
        profile={profile}
        onSave={handleSave}
        isSaving={isPending}
      />
      {snackMsg && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, bgcolor: snackMsg.includes('Error') ? 'error.main' : 'success.main', color: 'white', px: 3, py: 1.5, borderRadius: 2, boxShadow: 3 }}>
          {snackMsg}
          <Button size="small" sx={{ color: 'white', ml: 1 }} onClick={() => setSnackMsg(null)}>✕</Button>
        </Box>
      )}
    </Box>
  );
};

