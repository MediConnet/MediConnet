import { CheckCircle, Close, CloudUpload, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
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
  const handleChange = (
    field: keyof AmbulanceProfile,
    value: string | number
  ) => {
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

  // Manejar campo numérico de tiempo de llegada
  const handleNumberChange = (
    field: keyof AmbulanceProfile,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Permitir solo números positivos
    if (!/^\d*$/.test(value)) return;

    handleChange(field, Number(value));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && formData) {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, bannerUrl: base64 });
        setHasNewImage(true);
      };
      reader.readAsDataURL(file);
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
                PNG, JPG (mín. 800x180px, proporción 4:1). En la app se muestra como banner de ancho completo. Máx. 5MB.
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
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="WhatsApp Corporativo"
                value={formData.whatsappContact}
                onChange={(e) => handlePhoneChange("whatsappContact", e as any)}
                placeholder="Ej: 0991234567"
                helperText="Solo números"
                slotProps={{
                  input: { inputMode: "numeric" },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tiempo llegada (min)"
                value={formData.arrivalField || ""}
                onChange={(e) => handleNumberChange("arrivalField", e as any)}
                placeholder="Ej: 15"
                helperText="Tiempo estimado en minutos"
                slotProps={{
                  input: { inputMode: "numeric" },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Dirección Base"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Campos de ubicación */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                step="any"
                label="Latitud (opcional)"
                value={formData.latitude?.toString() || ""}
                onChange={(e) => handleChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Ejemplo: -0.180653"
                helperText="Entre -90 y 90"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                step="any"
                label="Longitud (opcional)"
                value={formData.longitude?.toString() || ""}
                onChange={(e) => handleChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Ejemplo: -78.467834"
                helperText="Entre -180 y 180"
              />
            </Grid2>
          </Grid2>

          <TextField
            fullWidth
            type="url"
            label="Link de Google Maps (opcional)"
            value={formData.google_maps_url || ""}
            onChange={(e) => handleChange("google_maps_url", e.target.value || null)}
            placeholder="https://maps.app.goo.gl/..."
            helperText="Pega el link de Google Maps para compartir la ubicación exacta"
          />

          <TextField
            fullWidth
            label="Descripción Corta"
            multiline
            rows={3}
            value={formData.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            helperText="Máximo 150 caracteres para la vista previa"
          />

          {/* Nuevos campos: Tipo de ambulancia, zona de cobertura, disponibilidad */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Ambulancia</InputLabel>
                <Select
                  value={formData.ambulanceType || "basic"}
                  label="Tipo de Ambulancia"
                  onChange={(e) => handleChange("ambulanceType", e.target.value)}
                >
                  <MenuItem value="basic">Básica</MenuItem>
                  <MenuItem value="advanced">Avanzada</MenuItem>
                  <MenuItem value="mobile-icu">UCI Móvil</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Zona de Cobertura"
                value={formData.coverageZone || ""}
                onChange={(e) => handleChange("coverageZone", e.target.value)}
                placeholder="Ej: Quito y alrededores"
                helperText="Describe las zonas donde prestas servicio"
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Disponibilidad</InputLabel>
                <Select
                  value={formData.availability || "24/7"}
                  label="Disponibilidad"
                  onChange={(e) => {
                    const availability = e.target.value as "24/7" | "scheduled";
                    if (formData) {
                      setFormData({
                        ...formData,
                        availability,
                        operatingHours: availability === "scheduled"
                          ? { startTime: "08:00", endTime: "18:00" }
                          : { startTime: "00:00", endTime: "23:59" },
                      });
                    }
                  }}
                >
                  <MenuItem value="24/7">24/7 (Todo el día)</MenuItem>
                  <MenuItem value="scheduled">Por Horario</MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            {formData.availability === "scheduled" && (
              <>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Hora de Inicio"
                    value={formData.operatingHours?.startTime || "08:00"}
                    onChange={(e) => {
                      if (formData) {
                        setFormData({
                          ...formData,
                          operatingHours: {
                            ...formData.operatingHours!,
                            startTime: e.target.value,
                          },
                        });
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      htmlInput: { step: 1800 }
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Hora de Fin"
                    value={formData.operatingHours?.endTime || "18:00"}
                    onChange={(e) => {
                      if (formData) {
                        setFormData({
                          ...formData,
                          operatingHours: {
                            ...formData.operatingHours!,
                            endTime: e.target.value,
                          },
                        });
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      htmlInput: { step: 1800 }
                    }}
                  />
                </Grid2>
              </>
            )}
          </Grid2>

          <FormControlLabel
            control={
              <Switch
                checked={formData.interprovincialTransfers || false}
                onChange={(e) => {
                  if (formData) {
                    setFormData({
                      ...formData,
                      interprovincialTransfers: e.target.checked,
                    });
                  }
                }}
              />
            }
            label="Ofrecer traslados interprovinciales"
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
                  checked={formData.isActive !== false}
                  onChange={(e) => {
                    if (formData) {
                      setFormData({
                        ...formData,
                        isActive: e.target.checked,
                      });
                    }
                  }}
                  color="primary"
                />
              }
              label={
                formData.isActive !== false
                  ? "Servicio Activo (visible en la app)"
                  : "Servicio Inactivo (oculto en la app)"
              }
            />
            <Typography variant="caption" color="text.secondary" mt={1} display="block">
              {formData.isActive !== false
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
