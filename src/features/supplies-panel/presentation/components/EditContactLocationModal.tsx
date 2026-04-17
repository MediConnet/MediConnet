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
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";
import { parseCoordinate } from "../../../../shared/lib/parseCoordinate";

interface EditContactLocationModalProps {
  open: boolean;
  onClose: () => void;
  data: SupplyDashboard;
  onSave: (updatedData: SupplyDashboard) => void;
}

export const EditContactLocationModal = ({
  open,
  onClose,
  data,
  onSave,
}: EditContactLocationModalProps) => {
  const [formData, setFormData] = useState({
    whatsapp: "",
    address: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        whatsapp: data.supply.whatsapp || "",
        address: data.supply.address || "",
        latitude: data.supply.latitude?.toString() || "",
        longitude: data.supply.longitude?.toString() || "",
        google_maps_url: data.supply.google_maps_url || "",
      });
    }
  }, [data, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { updateSupplyProfileAPI } = await import("../../infrastructure/supply.api");
      await updateSupplyProfileAPI({
        whatsapp: formData.whatsapp,
        address: formData.address,
        latitude: formData.latitude ? parseCoordinate(formData.latitude) : null,
        longitude: formData.longitude ? parseCoordinate(formData.longitude) : null,
        google_maps_url: formData.google_maps_url || null,
      });
      
      const updatedData: SupplyDashboard = {
        ...data,
        supply: {
          ...data.supply,
          whatsapp: formData.whatsapp,
          address: formData.address,
          latitude: formData.latitude ? parseCoordinate(formData.latitude) : null,
          longitude: formData.longitude ? parseCoordinate(formData.longitude) : null,
          google_maps_url: formData.google_maps_url || null,
        },
      };
      onSave(updatedData);
      onClose();
    } catch (error: any) {
      console.error("Error updating supply contact location:", error);
      alert(error?.message || "No se pudo guardar. Intenta de nuevo.");
    }
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
            placeholder="Ej: 0991234567"
            value={formData.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsApp sx={{ color: "#10b981" }} />
                </InputAdornment>
              ),
            }}
            helperText="Número de WhatsApp para contacto directo"
          />

          {/* Dirección */}
          <TextField
            fullWidth
            label="Dirección"
            placeholder="Ej: Av. 6 de Diciembre N30-12, Quito"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                  <LocationOn sx={{ color: "#06b6d4" }} />
                </InputAdornment>
              ),
            }}
            helperText="Dirección completa de tu negocio"
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
                  placeholder="-0.1807 o 0,23524° S"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Ej: -0.1807 o 0,23524° S"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Longitud"
                  placeholder="-78.4678 o 79,18234° O"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Ej: -78.4678 o 79,18234° O"
                />
              </Grid2>
            </Grid2>
          </Box>

          {/* Google Maps URL */}
          <TextField
            fullWidth
            type="url"
            label="Link de Google Maps (opcional)"
            placeholder="https://maps.app.goo.gl/..."
            value={formData.google_maps_url}
            onChange={(e) => handleChange("google_maps_url", e.target.value)}
            helperText="Pega el link de Google Maps para compartir la ubicación exacta"
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
            bgcolor: "#f97316",
            "&:hover": {
              bgcolor: "#ea580c",
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

