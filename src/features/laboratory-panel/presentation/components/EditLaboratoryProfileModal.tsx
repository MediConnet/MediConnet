import { Close, Description, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";

interface EditLaboratoryProfileModalProps {
  open: boolean;
  onClose: () => void;
  data: LaboratoryDashboard;
  onSave: (updatedData: LaboratoryDashboard) => void;
}

export const EditLaboratoryProfileModal = ({
  open,
  onClose,
  data,
  onSave,
}: EditLaboratoryProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.laboratory.name || "",
        description: data.laboratory.description || "",
        isActive: data.laboratory.isActive !== false,
      });
    }
  }, [data, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedData: LaboratoryDashboard = {
      ...data,
      laboratory: {
        ...data.laboratory,
        name: formData.name,
        description: formData.description,
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
          Editar Perfil del Laboratorio
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre del Laboratorio"
            placeholder="Ej: Laboratorio Central"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Descripción"
            placeholder="Ej: Laboratorio clínico profesional con más de 15 años de experiencia"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            multiline
            rows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 1.5 }}>
                  <Description color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Estado del Servicio */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Estado del Servicio
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                formData.isActive
                  ? "Servicio Activo (visible en la app)"
                  : "Servicio Inactivo (oculto en la app)"
              }
            />
            <Typography variant="caption" color="text.secondary" mt={1} display="block">
              {formData.isActive
                ? "Tu servicio está visible y disponible para los usuarios"
                : "Tu servicio está oculto y no aparecerá en la búsqueda"}
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
          disabled={!formData.name.trim()}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Guardar Perfil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

