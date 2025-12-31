import { CheckCircle, Close, CloudUpload, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: AmbulanceProfile | null;
  onSave: (data: AmbulanceProfile) => void;
}

export const EditProfileModal = ({
  open,
  onClose,
  initialData,
  onSave,
}: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AmbulanceProfile | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setHasNewImage(false);
    }
  }, [initialData, open]);

  // Manejador genérico para texto
  const handleChange = (field: keyof AmbulanceProfile, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Manejar campos de teléfono (Validación de números y longitud)
  const handlePhoneChange = (
    field: keyof AmbulanceProfile,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Solo permitir números
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Máximo 10 caracteres
    if (value.length > 10) {
      return;
    }

    handleChange(field, value);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
          Editar Información
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
              Imagen de Portada
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
                height: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <CloudUpload sx={{ fontSize: 32 }} />
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
              >
                Click para subir imagen
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                SVG, PNG, JPG (Max. 800x400px)
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

          {/* --- CAMPOS DE TEXTO --- */}
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
                label="Teléfono Emergencia"
                value={formData.emergencyPhone}
                onChange={(e) => handlePhoneChange("emergencyPhone", e as any)}
                placeholder="Ej: 0991234567"
                helperText="Solo números (máx 10)"
                slotProps={{
                  input: { inputMode: "numeric" },
                }}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="WhatsApp Corporativo"
                value={formData.whatsappContact}
                onChange={(e) => handlePhoneChange("whatsappContact", e as any)}
                placeholder="Ej: 0991234567"
                helperText="Solo números (máx 10)"
                slotProps={{
                  input: { inputMode: "numeric" },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dirección Base"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid2>
          </Grid2>

          <TextField
            fullWidth
            label="Descripción Corta"
            multiline
            rows={3}
            value={formData.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            helperText="Máximo 150 caracteres para la vista previa"
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
          startIcon={<Save sx={{ color: "white" }} />}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
