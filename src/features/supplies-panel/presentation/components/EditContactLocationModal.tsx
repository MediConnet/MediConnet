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
} from "@mui/material";
import { useState, useEffect } from "react";
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";

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
  });

  useEffect(() => {
    if (data) {
      setFormData({
        whatsapp: data.supply.whatsapp || "",
        address: data.supply.address || "",
      });
    }
  }, [data, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedData: SupplyDashboard = {
      ...data,
      supply: {
        ...data.supply,
        whatsapp: formData.whatsapp,
        address: formData.address,
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

