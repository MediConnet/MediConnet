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
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { updateLaboratoryProfileAPI } from "../../infrastructure/laboratories.repository";

interface EditContactLocationModalProps {
  open: boolean;
  onClose: () => void;
  data: LaboratoryDashboard;
  onSave: (updatedData: LaboratoryDashboard) => void;
}

export const EditContactLocationModal = ({
  open,
  onClose,
  data,
  onSave,
}: EditContactLocationModalProps) => {
  const [formData, setFormData] = useState({
    whatsapp: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        whatsapp: data.laboratory.whatsapp || "",
        phone: data.laboratory.phone || "",
        address: data.laboratory.address || "",
        latitude: data.laboratory.location?.latitude?.toString() || "",
        longitude: data.laboratory.location?.longitude?.toString() || "",
        google_maps_url: data.laboratory.google_maps_url || "",
      });
    }
  }, [data, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateLaboratoryProfileAPI({
        whatsapp: formData.whatsapp,
        phone: formData.phone,
        address: formData.address,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        google_maps_url: formData.google_maps_url,
      });
    } catch (e) {
      console.error("Error guardando contacto/ubicación laboratorio:", e);
    }

    const updatedData: LaboratoryDashboard = {
      ...data,
      laboratory: {
        ...data.laboratory,
        whatsapp: formData.whatsapp,
        phone: formData.phone,
        address: formData.address,
        google_maps_url: formData.google_maps_url,
        location:
          formData.latitude && formData.longitude
            ? {
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                address: formData.address,
              }
            : undefined,
      },
    };
    onSave(updatedData);
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

          {/* Teléfono */}
          <TextField
            fullWidth
            label="Teléfono"
            placeholder="(02) 123-4567"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            helperText="Teléfono de contacto (opcional)"
          />

          {/* Dirección */}
          <TextField
            fullWidth
            label="Dirección"
            placeholder="Av. Principal 456, Quito, Ecuador"
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

          {/* Google Maps URL (Opcional) */}
          <TextField
            fullWidth
            label="Link de Google Maps (opcional)"
            placeholder="https://maps.app.goo.gl/..."
            value={formData.google_maps_url}
            onChange={(e) => handleChange("google_maps_url", e.target.value)}
            helperText="Si lo incluyes, se mostrará como enlace en tu perfil"
          />
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

