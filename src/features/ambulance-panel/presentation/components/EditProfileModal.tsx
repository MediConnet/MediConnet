import { Close, CloudUpload, Save } from "@mui/icons-material";
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
import Grid2 from "@mui/material/Grid2"; // Usamos Grid2 como pediste
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

  // Estado local del formulario
  const [formData, setFormData] = useState<AmbulanceProfile | null>(null);
  // Estado para previsualizar la imagen seleccionada localmente
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviewImage(initialData.bannerUrl);
    }
  }, [initialData, open]);

  const handleChange = (field: keyof AmbulanceProfile, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Maneja el clic en la zona de carga para abrir el explorador de archivos
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Maneja la selección del archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && formData) {
      // 1. Crear URL temporal para previsualización inmediata
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // 2. Aquí normalmente subirías el archivo al servidor.
      // Por ahora, simulamos guardando la URL temporal en el form
      setFormData({ ...formData, bannerUrl: objectUrl });
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

            {/* Input oculto nativo */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Zona visual clicable */}
            <Box
              onClick={handleUploadClick}
              sx={{
                border: `2px dashed ${theme.palette.grey[300]}`,
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
                height: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${previewImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              {/* Overlay para que el texto se lea sobre la imagen */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255,255,255,0.7)",
                  opacity: previewImage ? 0.8 : 0,
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 0.9 },
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <CloudUpload />
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                >
                  Click para subir imagen
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SVG, PNG, JPG (Max. 800x400px)
                </Typography>
              </Box>
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
                onChange={(e) => handleChange("emergencyPhone", e.target.value)}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="WhatsApp Corporativo"
                value={formData.whatsappContact}
                onChange={(e) =>
                  handleChange("whatsappContact", e.target.value)
                }
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
          startIcon={<Save />}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
