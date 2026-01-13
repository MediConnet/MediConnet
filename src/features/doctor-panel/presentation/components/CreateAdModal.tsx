import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreateAd: (adData: {
    title: string;
    description: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
  }) => Promise<void>;
  submitButtonText?: string;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .required("El título es requerido"),
  description: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .required("La descripción es requerida"),
  startDate: Yup.string().required("La fecha de inicio es requerida"),
  endDate: Yup.string().test(
    "endDate-after-startDate",
    "La fecha de fin debe ser posterior a la fecha de inicio",
    function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value) >= new Date(startDate);
    }
  ),
});

export const CreateAdModal = ({ open, onClose, onCreateAd, submitButtonText = "Publicar Anuncio" }: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError("");
      try {
        // Convertir imagen a base64 (aquí simulado)
        let imageUrl: string | undefined;
        if (selectedImage) {
          // En producción, aquí subirías la imagen a un servidor
          imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(selectedImage!);
          });
        }

        await onCreateAd({
          title: values.title,
          description: values.description,
          imageUrl,
          startDate: values.startDate,
          endDate: values.endDate || undefined,
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

          {/* Título */}
          <TextField
            fullWidth
            label="Título del anuncio"
            name="title"
            placeholder="Ej: Descuento especial del 20%"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            required
            sx={{ mb: 3 }}
          />

          {/* Descripción */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción del anuncio"
            name="description"
            placeholder="Describe tu oferta o promoción..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            required
            sx={{ mb: 3 }}
          />

          {/* Imagen */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Imagen del anuncio (opcional)
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
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de inicio"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate}
              required
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
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

