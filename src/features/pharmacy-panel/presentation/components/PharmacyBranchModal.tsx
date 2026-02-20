import {
  AccessTime,
  Close,
  CloudUpload,
  Delete,
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
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";

interface Props {
  open: boolean;
  onClose: () => void;
  branchToEdit: PharmacyBranch | null;
  onSave: (branch: PharmacyBranch | Omit<PharmacyBranch, "id">) => void;
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const INITIAL_STATE: any = {
  name: "",
  address: "",
  phone: "",
  whatsapp: "",
  openingHours: "",
  hasHomeDelivery: false,
  isActive: true,
  imageUrl: null,
};

export const PharmacyBranchModal = ({
  open,
  onClose,
  branchToEdit,
  onSave,
}: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>(INITIAL_STATE);

  // Estado específico para la previsualización de la imagen
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Estado local para los selectores de horario
  const [scheduleState, setScheduleState] = useState({
    startDay: "Lun",
    endDay: "Dom",
    startTime: "08:00",
    endTime: "20:00",
  });

  useEffect(() => {
    if (branchToEdit) {
      setFormData(branchToEdit);
      setImagePreview((branchToEdit as any).imageUrl || null);

      try {
        const parts = branchToEdit.openingHours.split(" ");
        if (parts.length >= 6) {
          setScheduleState({
            startDay: parts[0],
            endDay: parts[2],
            startTime: parts[3],
            endTime: parts[5],
          });
        }
      } catch (e) {
        console.warn("Error parseando horario", e);
      }
    } else {
      setFormData(INITIAL_STATE);
      setImagePreview(null);
      setScheduleState({
        startDay: "Lun",
        endDay: "Dom",
        startTime: "08:00",
        endTime: "20:00",
      });
    }
  }, [branchToEdit, open]);

  // --- HANDLERS ---

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (
    field: "phone" | "whatsapp",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      handleChange(field, value);
    }
  };

  const handleScheduleChange = (
    field: keyof typeof scheduleState,
    value: string
  ) => {
    setScheduleState((prev) => ({ ...prev, [field]: value }));
  };

  // Handler para subir imagen
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Crear URL temporal para previsualización
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      // Guardar el archivo o la URL en el formData (según lógica de backend)
      handleChange("imageUrl", objectUrl);
    }
  };

  // Handler para eliminar imagen seleccionada
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    handleChange("imageUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    const finalHours = `${scheduleState.startDay} - ${scheduleState.endDay} ${scheduleState.startTime} - ${scheduleState.endTime}`;
    const dataToSave = {
      ...formData,
      openingHours: finalHours,
      // imageUrl ya está en formData
    };
    onSave(dataToSave);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #eee"
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700 }}>
          {branchToEdit ? "Editar Sucursal" : "Nueva Sucursal"}
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* SECCIÓN DE IMAGEN */}
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
                height: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {imagePreview ? (
                <>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Vista previa"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.9,
                    }}
                  />
                  {/* Botón para eliminar/cambiar */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0,0,0,0.3)",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        startIcon={<CloudUpload />}
                      >
                        Cambiar
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleRemoveImage}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </Box>
                </>
              ) : (
                <>
                  <CloudUpload
                    sx={{
                      fontSize: 40,
                      color: theme.palette.primary.main,
                      mb: 1.5,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary.main"
                  >
                    Click para subir imagen
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG o WEBP (Máx. 5MB)
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Nombre y Dirección */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre de Sucursal"
                placeholder="Ej: Sucursal Centro"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dirección"
                placeholder="Av. Principal y Calle Secundaria"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Teléfonos */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Teléfono Fijo"
                value={formData.phone}
                onChange={(e) => handlePhoneChange("phone", e as any)}
                slotProps={{ input: { inputMode: "numeric" } }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="WhatsApp"
                value={formData.whatsapp}
                onChange={(e) => handlePhoneChange("whatsapp", e as any)}
                slotProps={{ input: { inputMode: "numeric" } }}
              />
            </Grid2>
          </Grid2>

          {/* Configuración de Horario (Inputs Nativos) */}
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

            <Grid2 container spacing={2} mb={2}>
              <Grid2 size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Día Inicio</InputLabel>
                  <Select
                    value={scheduleState.startDay}
                    label="Día Inicio"
                    onChange={(e) =>
                      handleScheduleChange("startDay", e.target.value)
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
                      handleScheduleChange("endDay", e.target.value)
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

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Hora Apertura"
                  type="time"
                  value={scheduleState.startTime}
                  onChange={(e) =>
                    handleScheduleChange("startTime", e.target.value)
                  }
                  slotProps={{ 
                    inputLabel: { shrink: true },
                    htmlInput: { step: 1800 }
                  }}
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
                    handleScheduleChange("endTime", e.target.value)
                  }
                  slotProps={{ 
                    inputLabel: { shrink: true },
                    htmlInput: { step: 1800 }
                  }}
                />
              </Grid2>
            </Grid2>

            <Typography
              variant="caption"
              display="block"
              mt={1}
              color="text.secondary"
              textAlign="center"
            >
              Se guardará como:{" "}
              <strong>
                {scheduleState.startDay} - {scheduleState.endDay}{" "}
                {scheduleState.startTime} - {scheduleState.endTime}
              </strong>
            </Typography>
          </Box>

          {/* Switches */}
          <Box display="flex" gap={4} flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.hasHomeDelivery}
                  onChange={(e) =>
                    handleChange("hasHomeDelivery", e.target.checked)
                  }
                />
              }
              label="Servicio a Domicilio"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  color="success"
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              }
              label="Sucursal Activa"
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
          onClick={handleSubmit}
          startIcon={<Save sx={{ color: "white" }} />}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
          }}
        >
          {branchToEdit ? "Guardar Cambios" : "Crear Sucursal"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
