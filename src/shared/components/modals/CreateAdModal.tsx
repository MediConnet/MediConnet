import { Close, CloudUpload, CheckCircle } from "@mui/icons-material";
import {
  Alert,
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
} from "@mui/material";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreateAd: (adData: {
    label: string;
    discount: string;
    description: string;
    buttonText: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => Promise<void>;
  submitButtonText?: string;
}

const validationSchema = Yup.object({
  label: Yup.string()
    .min(2, "El label debe tener al menos 2 caracteres")
    .required("El label es requerido"),
  discount: Yup.string()
    .min(2, "El descuento debe tener al menos 2 caracteres")
    .required("El descuento es requerido"),
  description: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(50, "La descripción es muy larga (máximo 50 caracteres)")
    .required("La descripción es requerida"),
  buttonText: Yup.string()
    .min(2, "El texto del botón debe tener al menos 2 caracteres")
    .required("El texto del botón es requerido"),
  startDate: Yup.string()
    .required("La fecha de inicio es requerida")
    .test(
      "is-today-or-future",
      "La fecha de inicio no puede ser anterior a hoy",
      (value) => {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [year, month, day] = value.split("-").map(Number);
        const inputDate = new Date(year, month - 1, day);
        return inputDate >= today;
      },
    ),
  endDate: Yup.string()
    .nullable()
    .test(
      "endDate-after-startDate",
      "La fecha de fin debe ser posterior a la fecha de inicio",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) >= new Date(startDate);
      },
    ),
});

export const CreateAdModal = ({
  open,
  onClose,
  onCreateAd,
  submitButtonText = "Publicar Anuncio",
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      label: "",
      discount: "",
      description: "",
      buttonText: "",
      imageUrl: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError("");
      try {
        // Prioridad: base64 subido > URL pegada
        const imageUrl = imageBase64 || values.imageUrl?.trim() || undefined;

        // --- LÓGICA DE TIEMPO EXACTO ---
        const now = new Date();

        const combineDateWithCurrentTime = (dateString: string) => {
          const [year, month, day] = dateString.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
          return date.toISOString();
        };

        const finalStartDate = combineDateWithCurrentTime(values.startDate);
        const finalEndDate = values.endDate
          ? combineDateWithCurrentTime(values.endDate)
          : undefined;

        await onCreateAd({
          label: values.label,
          discount: values.discount,
          description: values.description,
          buttonText: values.buttonText,
          imageUrl,
          startDate: finalStartDate,
          endDate: finalEndDate,
        });

        formik.resetForm();
        setImagePreview(null);
        setImageBase64(null);
        onClose();
      } catch (err: any) {
        setError(err.message || "Error al crear el anuncio");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
      // Limpiar el campo URL si se sube archivo
      formik.setFieldValue("imageUrl", "");
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    formik.resetForm();
    setError("");
    setImagePreview(null);
    setImageBase64(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Crear Anuncio Promocional
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa la información de tu anuncio
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Label */}
          <TextField
            fullWidth
            label="Label del anuncio"
            name="label"
            placeholder="Ej: PRIMERA CITA"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.label && Boolean(formik.errors.label)}
            helperText={
              (formik.touched.label && formik.errors.label) ||
              "Texto que aparece en la etiqueta superior del banner"
            }
            required
            sx={{ mb: 3 }}
          />

          {/* Descuento */}
          <TextField
            fullWidth
            label="Descuento"
            name="discount"
            placeholder="Ej: 20% OFF"
            value={formik.values.discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discount && Boolean(formik.errors.discount)}
            helperText={
              (formik.touched.discount && formik.errors.discount) ||
              "Ej: 20% OFF, 50% DESCUENTO, etc."
            }
            required
            sx={{ mb: 3 }}
          />

          {/* Descripción */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción breve"
            name="description"
            placeholder="Ej: En tu primera consulta general con profesionales verificados."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={
              (formik.touched.description && formik.errors.description) ||
              `${formik.values.description.length}/50 caracteres`
            }
            required
            sx={{ mb: 3 }}
          />

          {/* Texto del botón */}
          <TextField
            fullWidth
            label="Texto del botón"
            name="buttonText"
            placeholder="Ej: Canjear Ahora"
            value={formik.values.buttonText}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.buttonText && Boolean(formik.errors.buttonText)
            }
            helperText={
              (formik.touched.buttonText && formik.errors.buttonText) ||
              "Texto que aparece en el botón de acción"
            }
            required
            sx={{ mb: 3 }}
          />

          {/* Imagen del anuncio */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Imagen del anuncio (opcional)
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* Zona de subida */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "2px dashed",
                borderColor: imagePreview ? "success.main" : "grey.300",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: imagePreview ? "success.50" : "grey.50",
                "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
                mb: 1,
              }}
            >
              {imagePreview ? (
                <Stack alignItems="center" spacing={1}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{ maxHeight: 120, borderRadius: 1, objectFit: "cover" }}
                  />
                  <Stack direction="row" alignItems="center" spacing={0.5} color="success.main">
                    <CheckCircle fontSize="small" />
                    <Typography variant="caption" fontWeight={600}>
                      Imagen lista — click para cambiar
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Stack alignItems="center" spacing={0.5}>
                  <CloudUpload sx={{ fontSize: 32, color: "grey.400" }} />
                  <Typography variant="body2" color="text.secondary">
                    Click para subir imagen
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG. Máx 5MB
                  </Typography>
                </Stack>
              )}
            </Box>
            {/* O pegar URL */}
            <TextField
              fullWidth
              size="small"
              label="O pega una URL de imagen"
              name="imageUrl"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formik.values.imageUrl}
              onChange={(e) => {
                formik.handleChange(e);
                if (e.target.value) {
                  setImageBase64(null);
                  setImagePreview(e.target.value);
                } else {
                  setImagePreview(null);
                }
              }}
              disabled={!!imageBase64}
              helperText={imageBase64 ? "Usando imagen subida (borra la imagen para usar URL)" : ""}
            />
          </Box>

          {/* Fechas */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="Fecha de inicio"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.touched.startDate && formik.errors.startDate}
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              type="date"
              label="Fecha de fin (opcional)"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#14b8a6",
              "&:hover": {
                bgcolor: "#0d9488",
              },
            }}
          >
            {isSubmitting ? "Enviando..." : submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
