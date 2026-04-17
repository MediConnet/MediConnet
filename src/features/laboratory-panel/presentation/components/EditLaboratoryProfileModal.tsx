import { Close, Description, PhotoCamera, Save } from "@mui/icons-material";
import {
  Avatar,
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
import { useRef, useState, useEffect } from "react";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { updateLaboratoryProfileAPI } from "../../infrastructure/laboratories.repository";

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
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.laboratory.name || "",
        description: data.laboratory.description || "",
        isPublished:
          data.laboratory.is_published ??
          (data.laboratory.isActive !== false),
      });
      setLogoPreview(null);
    }
  }, [data, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickLogo = () => fileInputRef.current?.click();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateLaboratoryProfileAPI({
        full_name: formData.name,
        description: formData.description,
        is_published: formData.isPublished,
        ...(logoPreview ? { logo_url: logoPreview } : {}),
      });

      const updatedData: LaboratoryDashboard = {
        ...data,
        laboratory: {
          ...data.laboratory,
          name: formData.name,
          description: formData.description,
          is_published: formData.isPublished,
          isActive: formData.isPublished,
          logoUrl: response.logo_url ?? data.laboratory.logoUrl,
        },
      };
      onSave(updatedData);
      onClose();
    } catch (e) {
      console.error("Error guardando perfil de laboratorio:", e);
    } finally {
      setSaving(false);
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
          Editar Perfil del Laboratorio
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Logo */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Logo del Laboratorio
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
              <Avatar
                src={logoPreview || data?.laboratory?.logoUrl || undefined}
                variant="rounded"
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: 2,
                  bgcolor: "grey.100",
                }}
              >
                <PhotoCamera />
              </Avatar>
              <Button variant="outlined" onClick={handlePickLogo}>
                {data?.laboratory?.logoUrl || logoPreview ? "Cambiar logo" : "Subir logo"}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Se recomienda imagen rectangular de al menos 800x180px (proporción 4:1). En la app se muestra como banner de ancho completo. Máx. 5MB. El logo se guarda al presionar "Guardar Perfil".
            </Typography>
          </Box>

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
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                formData.isPublished
                  ? "Servicio Activo (visible en la app)"
                  : "Servicio Inactivo (oculto en la app)"
              }
            />
            <Typography variant="caption" color="text.secondary" mt={1} display="block">
              {formData.isPublished
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
          disabled={!formData.name.trim() || saving}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          {saving ? "Guardando..." : "Guardar Perfil"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

