import {
  Business,
  CheckCircle,
  Close,
  CloudUpload,
  Description,
  Language,
  Save,
} from "@mui/icons-material";
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

  // Estado simplificado: Solo identidad de marca
  const [formData, setFormData] = useState<Partial<PharmacyProfile>>({
    commercialName: "",
    ruc: "",
    description: "",
    websiteUrl: "",
    logoUrl: "",
  });

  const [hasNewImage, setHasNewImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        commercialName: initialData.commercialName,
        ruc: initialData.ruc || "",
        description: initialData.description || "",
        websiteUrl: initialData.websiteUrl || "",
        logoUrl: initialData.logoUrl || "",
      });
      setHasNewImage(false);
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoUrl: objectUrl }));
      setHasNewImage(true);
    }
  };

  const handleSave = () => {
    // Aquí ya no procesamos horarios ni direcciones.
    // Solo devolvemos la data de la marca.
    onSave(formData as PharmacyProfile);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // Hacemos el modal más angosto, ya no necesitamos tanto espacio
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
          Identidad de la Farmacia
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* --- 1. LOGO DE LA MARCA (Visualización Previa + Carga) --- */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Logotipo / Imagen de Marca
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
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* VISTA PREVIA DE LA IMAGEN */}
              {formData.logoUrl ? (
                <Box
                  component="img"
                  src={formData.logoUrl}
                  alt="Logo Preview"
                  sx={{
                    maxHeight: 120,
                    maxWidth: "100%",
                    objectFit: "contain",
                    mb: 1,
                    borderRadius: 1,
                  }}
                />
              ) : (
                <CloudUpload
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    mb: 1,
                  }}
                />
              )}

              <Typography variant="body2" fontWeight={600} color="primary.main">
                {formData.logoUrl
                  ? "Click para cambiar logo"
                  : "Subir Logo de la Farmacia"}
              </Typography>

              {hasNewImage && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  mt={1}
                  sx={{ color: "success.main" }}
                >
                  <CheckCircle fontSize="small" />
                  <Typography variant="caption" fontWeight={600}>
                    Nueva imagen lista
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* --- 2. DATOS DE IDENTIDAD --- */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre Comercial"
                placeholder="Ej: Farmacias Medicity"
                value={formData.commercialName}
                onChange={(e) => handleChange("commercialName", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="RUC / Razón Social"
                placeholder="Ej: 1790000000001"
                value={formData.ruc}
                onChange={(e) => handleChange("ruc", e.target.value)}
                helperText="Información interna para facturación"
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Slogan o Descripción Corta"
                placeholder="Ej: Cuidamos tu salud las 24 horas"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <Description color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Sitio Web (Opcional)"
                placeholder="www.mifarmacia.com"
                value={formData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
          </Grid2>
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
          disabled={!formData.commercialName}
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
