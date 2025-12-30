import {
  AccessTime,
  CheckCircle,
  Close,
  CloudUpload,
  Save,
} from "@mui/icons-material";
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
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: PharmacyProfile | null;
  onSave: (data: PharmacyProfile) => void;
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const EditPharmacyModal = ({
  open,
  onClose,
  initialData,
  onSave,
}: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado del formulario principal
  const [formData, setFormData] = useState<PharmacyProfile | null>(null);

  // Estado local para manejar los selectores de horario antes de guardar
  const [scheduleState, setScheduleState] = useState({
    startDay: "Lun",
    endDay: "Vie",
    startTime: "08:00",
    endTime: "20:00",
  });

  const [hasNewImage, setHasNewImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setHasNewImage(false);

      const daysParts = initialData.schedule.daysSummary.split(" - ");
      const hoursParts = initialData.schedule.hoursSummary.split(" - ");

      setScheduleState({
        startDay: daysParts[0] || "Lun",
        endDay: daysParts[1] || "Dom",
        startTime: hoursParts[0] || "08:00",
        endTime: hoursParts[1] || "20:00",
      });
    }
  }, [initialData, open]);

  // --- HANDLERS ---

  const handleChange = (
    field: keyof PharmacyProfile,
    value: string | boolean
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Validador de Teléfonos (WhatsApp y Convencional)
  const handlePhoneChange = (
    field: keyof PharmacyProfile | "whatsappContact",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Solo números y máximo 10 caracteres
    if (/^\d*$/.test(value) && value.length <= 10) {
      if (formData) {
        setFormData({ ...formData, [field]: value } as any);
      }
    }
  };

  // Handler para los selectores de horario
  const handleScheduleSelectChange = (
    field: keyof typeof scheduleState,
    value: string
  ) => {
    setScheduleState((prev) => ({ ...prev, [field]: value }));
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
      // Construimos los strings finales del horario antes de guardar
      const finalDaysSummary = `${scheduleState.startDay} - ${scheduleState.endDay}`;
      const finalHoursSummary = `${scheduleState.startTime} - ${scheduleState.endTime}`;

      const dataToSave = {
        ...formData,
        schedule: {
          daysSummary: finalDaysSummary,
          hoursSummary: finalHoursSummary,
        },
      };

      onSave(dataToSave);
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
          Editar Farmacia
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* --- CARGA DE IMAGEN --- */}
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

          {/* --- DATOS PRINCIPALES --- */}
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
                label="Teléfono Convencional"
                value={formData.phone}
                onChange={(e) => handlePhoneChange("phone", e as any)}
                placeholder="Ej: 022345678"
                slotProps={{
                  input: { inputMode: "numeric" },
                }}
              />
            </Grid2>
          </Grid2>

          {/* --- Teléfono WhatsApp --- */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Número de WhatsApp (Para botón de contacto)"
                value={formData.whatsappContact}
                onChange={(e) =>
                  handlePhoneChange("whatsappContact" as any, e as any)
                }
                placeholder="Ej: 0991234567"
                helperText="Este número se usará para el botón de contacto directo"
                slotProps={{
                  input: { inputMode: "numeric" },
                }}
              />
            </Grid2>
          </Grid2>

          <TextField
            fullWidth
            label="Dirección Completa"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          {/* --- SELECTORES DE HORARIO --- */}
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              mb={2}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <AccessTime fontSize="small" /> Configuración de Horario
            </Typography>

            {/* Días */}
            <Grid2 container spacing={2} mb={2}>
              <Grid2 size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Día Inicio</InputLabel>
                  <Select
                    value={scheduleState.startDay}
                    label="Día Inicio"
                    onChange={(e) =>
                      handleScheduleSelectChange("startDay", e.target.value)
                    }
                  >
                    {DAYS.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Día Fin</InputLabel>
                  <Select
                    value={scheduleState.endDay}
                    label="Día Fin"
                    onChange={(e) =>
                      handleScheduleSelectChange("endDay", e.target.value)
                    }
                  >
                    {DAYS.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>

            {/* Horas */}
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Hora Apertura"
                  type="time"
                  value={scheduleState.startTime}
                  onChange={(e) =>
                    handleScheduleSelectChange("startTime", e.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Hora Cierre"
                  type="time"
                  value={scheduleState.endTime}
                  onChange={(e) =>
                    handleScheduleSelectChange("endTime", e.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
            </Grid2>

            {/* Previsualización */}
            <Typography
              variant="caption"
              display="block"
              mt={1}
              color="text.secondary"
              textAlign="center"
            >
              Se mostrará como:{" "}
              <strong>
                {scheduleState.startDay} - {scheduleState.endDay} |{" "}
                {scheduleState.startTime} - {scheduleState.endTime}
              </strong>
            </Typography>
          </Box>

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
