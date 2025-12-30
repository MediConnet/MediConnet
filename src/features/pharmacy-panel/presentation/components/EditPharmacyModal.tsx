import { CheckCircle, Close, CloudUpload, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: PharmacyProfile | null;
  onSave: (data: PharmacyProfile) => void;
}

export const EditPharmacyModal = ({
  open,
  onClose,
  initialData,
  onSave,
}: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PharmacyProfile | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setHasNewImage(false);
    }
  }, [initialData, open]);

  // Helper genérico para inputs de texto
  const handleChange = (
    field: keyof PharmacyProfile,
    value: string | boolean
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Helper específico para los campos anidados de horario
  const handleScheduleChange = (
    field: keyof PharmacyProfile["schedule"],
    value: string
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        schedule: { ...formData.schedule, [field]: value },
      });
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && formData) {
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, bannerUrl: objectUrl });
      setHasNewImage(true);
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #eee"
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700 }}>
          Editar Farmacia
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* --- ZONA DE CARGA DE IMAGEN --- */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Imagen de Portada (Banner)
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Box
              onClick={handleUploadClick}
              sx={{
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                height: 150,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloudUpload
                sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
              >
                Click para subir imagen
              </Typography>
              {hasNewImage && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  mt={1}
                  sx={{ color: "success.main" }}
                >
                  <CheckCircle fontSize="small" />
                  <Typography variant="caption" fontWeight={600}>
                    Nueva imagen seleccionada
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* --- CAMPOS PRINCIPALES --- */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre Comercial"
                value={formData.commercialName}
                onChange={(e) => handleChange("commercialName", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Teléfono de Contacto"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Grid2>
          </Grid2>

          <TextField
            fullWidth
            label="Dirección Completa"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          {/* --- SECCIÓN DE HORARIO Y DELIVERY --- */}
          <Typography variant="h6" fontSize="1rem" fontWeight={700} pt={1}>
            Configuración de Servicio
          </Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Días de Atención"
                placeholder="Ej: Lunes - Viernes"
                value={formData.schedule.daysSummary}
                onChange={(e) =>
                  handleScheduleChange("daysSummary", e.target.value)
                }
                helperText="Resumen de los días que abren"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Horario"
                placeholder="Ej: 08:00 - 20:00"
                value={formData.schedule.hoursSummary}
                onChange={(e) =>
                  handleScheduleChange("hoursSummary", e.target.value)
                }
                helperText="Rango de horas de operación"
              />
            </Grid2>
          </Grid2>

          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.hasDelivery}
                  onChange={(e) =>
                    handleChange("hasDelivery", e.target.checked)
                  }
                />
              }
              label={
                <Typography fontWeight={500}>
                  Habilitar "Envío a domicilio disponible"
                </Typography>
              }
            />
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
          sx={{ borderRadius: 2, px: 3 }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
