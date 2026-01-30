import { Close, CloudUpload } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

        // Creamos la fecha de "hoy" reseteando las horas a 00:00:00 para la validación visual
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parseamos el input (YYYY-MM-DD) manualmente
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      label: "",
      discount: "",
      description: "",
      buttonText: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError("");
      try {
        let imageUrl: string | undefined;

        if (selectedImage) {
          imageUrl =
            "https://placehold.co/600x400/0d9488/ffffff?text=Banner+Promocional";
        }

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

        // Limpiar formulario
        formik.resetForm();
        setSelectedImage(null);
        setImagePreview(null);
        onClose();
      } catch (err: any) {
        setError(err.message || "Error al crear el anuncio");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
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

          {/* Imagen de profesionales */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Imagen de profesionales (opcional)
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Imagen que aparecerá en el lado derecho del banner
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />
            {!imagePreview ? (
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: "2px dashed #d1fae5",
                  borderRadius: 3,
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#f8fffd",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#14b8a6",
                    backgroundColor: "#f0fdfa",
                  },
                }}
              >
                <CloudUpload sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Haz clic para subir una imagen
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG o GIF (máx. 5MB)
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <IconButton
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                  size="small"
                >
                  <Close />
                </IconButton>
              </Box>
            )}
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
