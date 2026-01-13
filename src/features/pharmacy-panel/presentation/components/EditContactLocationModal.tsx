import { Close, LocationOn, Save, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";

interface EditContactLocationModalProps {
  open: boolean;
  onClose: () => void;
  profile: PharmacyProfile;
  onSave: (updatedFields: Partial<PharmacyProfile>) => void;
}

export const EditContactLocationModal = ({
  open,
  onClose,
  profile,
  onSave,
}: EditContactLocationModalProps) => {
  const [formData, setFormData] = useState({
    whatsapp: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        whatsapp: profile.whatsapp || "",
        address: profile.address || "",
        latitude: profile.location?.latitude?.toString() || "",
        longitude: profile.location?.longitude?.toString() || "",
      });
    }
  }, [profile, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedFields: Partial<PharmacyProfile> = {
      whatsapp: formData.whatsapp,
      address: formData.address,
      location:
        formData.latitude && formData.longitude
          ? {
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude),
              address: formData.address,
            }
          : undefined,
    };
    onSave(updatedFields);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #eee"
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700 }}>
          Editar Contacto y Ubicación
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* WhatsApp */}
          <TextField
            fullWidth
            label="WhatsApp"
            placeholder="+593 99 123 4567"
            value={formData.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsApp color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            helperText="Número de WhatsApp para contacto directo"
          />

          {/* Dirección */}
          <TextField
            fullWidth
            label="Dirección"
            placeholder="Av. Amazonas N25 y Colón, Quito, Ecuador"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            multiline
            rows={2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 1.5 }}>
                  <LocationOn color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Coordenadas (Opcional) */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Coordenadas (Opcional)
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Latitud"
                  placeholder="-0.1807"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Longitud"
                  placeholder="-78.4678"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
            </Grid2>
            <Typography variant="caption" color="text.secondary" mt={1}>
              Las coordenadas se utilizan para mostrar la ubicación en el mapa
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

