import { Close, Description, PhotoCamera, Save, CloudUpload } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";
import { updateLaboratoryProfileAPI } from "../../infrastructure/laboratories.repository";
import { useFeedbackStore } from "../../../../app/store/feedback.store";

interface EditLaboratoryProfileModalProps {
  open: boolean;
  onClose: () => void;
  data: LaboratoryDashboard;
  onSave: (updatedData: LaboratoryDashboard) => void;
}

export const EditLaboratoryProfileModal = ({
  open,
  onClose,
  data,
  onSave,
}: EditLaboratoryProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const feedback = useFeedbackStore();

  useEffect(() => {
    if (data && open) {
      setFormData({
        name: data.laboratory.name || "",
        description: data.laboratory.description || "",
        isPublished:
          data.laboratory.is_published ??
          (data.laboratory.isActive !== false),
      });
      setLogoPreview(data.laboratory.logoUrl || null);
      setBannerPreview(data.laboratory.imageUrl || null);
      setPreviewImages(data.laboratory.previewImages || []);
    }
  }, [data, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickLogo = () => fileInputRef.current?.click();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePickBanner = () => bannerInputRef.current?.click();
  
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setBannerPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePickGallery = () => galleryInputRef.current?.click();
  
  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setPreviewImages((prev) => {
            if (prev.length >= 6) {
              alert("Puedes subir un máximo de 6 imágenes de vista previa");
              return prev;
            }
            return [...prev, base64];
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteGalleryImage = (indexToDelete: number) => {
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateLaboratoryProfileAPI({
        full_name: formData.name,
        description: formData.description,
        is_published: formData.isPublished,
        logo_url: logoPreview,
        imageUrl: bannerPreview,
        preview_images: previewImages,
      });

      feedback.showFeedback('success', 'Perfil actualizado', 'La información del laboratorio se ha guardado correctamente.');

      const updatedData: LaboratoryDashboard = {
        ...data,
        laboratory: {
          ...data.laboratory,
          name: formData.name,
          description: formData.description,
          is_published: formData.isPublished,
          isActive: formData.isPublished,
          logoUrl: response.logo_url ?? logoPreview,
          imageUrl: response.imageUrl ?? bannerPreview,
          previewImages: response.preview_images ?? previewImages,
        },
      };
      onSave(updatedData);
      onClose();
    } catch (e) {
      console.error("Error guardando perfil de laboratorio:", e);
      feedback.showFeedback('error', 'Error', 'No se pudo guardar la información del laboratorio.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
          Editar Perfil del Laboratorio
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Logo del Laboratorio
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
              <Avatar
                src={logoPreview || data?.laboratory?.logoUrl || undefined}
                variant="rounded"
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: 2,
                  bgcolor: "grey.100",
                }}
              >
                <PhotoCamera />
              </Avatar>
              <Button variant="outlined" onClick={handlePickLogo}>
                {data?.laboratory?.logoUrl || logoPreview ? "Cambiar logo" : "Subir logo"}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Logotipo cuadrado (mín. 500x500px). Se muestra en tarjeta en la app. Máx. 5MB.
            </Typography>
          </Box>

          {/* Banner */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Banner de Portada / Imagen Superior
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                style={{ display: "none" }}
                onChange={handleBannerChange}
              />
              {bannerPreview ? (
                <Box
                  component="img"
                  src={bannerPreview}
                  alt="Banner preview"
                  sx={{
                    width: 180,
                    height: 96,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 180,
                    height: 96,
                    borderRadius: 2,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <PhotoCamera />
                </Box>
              )}
              <Button variant="outlined" onClick={handlePickBanner}>
                {bannerPreview ? "Cambiar banner" : "Subir banner"}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Se recomienda imagen de 800x180px. Máx. 5MB. En la app se muestra como banner de ancho completo.
            </Typography>
          </Box>

          {/* Gallery */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Galería de Imágenes (Máx. 6)
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={galleryInputRef}
                style={{ display: "none" }}
                onChange={handleGalleryChange}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                {previewImages.map((imgUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "grey.200",
                      position: "relative",
                      "&:hover .delete-btn": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={imgUrl}
                      alt={`Gallery preview ${index}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      className="delete-btn"
                      size="small"
                      onClick={() => handleDeleteGalleryImage(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        color: "error.main",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        "&:hover": {
                          bgcolor: "white",
                        },
                      }}
                    >
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
                {previewImages.length < 6 && (
                  <Box
                    onClick={handlePickGallery}
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 2,
                      border: "2px dashed",
                      borderColor: "grey.300",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: "grey.50",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "grey.100",
                      },
                    }}
                  >
                    <CloudUpload sx={{ color: "grey.400", mb: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Añadir
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Nombre del Laboratorio"
            placeholder="Ej: Laboratorio Central"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Descripción"
            placeholder="Ej: Laboratorio clínico profesional con más de 15 años de experiencia"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            multiline
            rows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 1.5 }}>
                  <Description color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

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
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                formData.isPublished
                  ? "Servicio Activo (visible en la app)"
                  : "Servicio Inactivo (oculto en la app)"
              }
            />
            <Typography variant="caption" color="text.secondary" mt={1} display="block">
              {formData.isPublished
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
          startIcon={<Save />}
          disabled={!formData.name.trim() || saving}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          {saving ? "Guardando..." : "Guardar Perfil"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
