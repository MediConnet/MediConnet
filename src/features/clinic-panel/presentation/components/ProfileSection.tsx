import { Box, Typography, Button, TextField, Grid2, Card, CardContent, Chip, Avatar, Snackbar, Alert } from "@mui/material";
import { Save, CloudUpload, LocationOn, CameraAlt, LocalHospital } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import type { ClinicProfile } from "../../domain/clinic.entity";
import { useClinicProfile, useUpdateClinicProfile } from "../hooks/useClinicProfile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadClinicLogoAPI } from "../../infrastructure/clinic.api";
import { Map } from "../../../../shared/ui/Map";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import { parseCoordinate } from "../../../../shared/lib/parseCoordinate";

interface ProfileSectionProps {
  clinicId: string;
}

const medicalSpecialties = [
  "Medicina General",
  "Cardiología",
  "Dermatología",
  "Ginecología",
  "Pediatría",
  "Oftalmología",
  "Traumatología",
  "Neurología",
  "Psiquiatría",
  "Urología",
  "Endocrinología",
  "Gastroenterología",
  "Neumología",
  "Otorrinolaringología",
  "Oncología",
  "Reumatología",
  "Nefrología",
  "Cirugía General",
  "Anestesiología",
  "Odontología",
];

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es requerido"),
  address: Yup.string().required("La dirección es requerida"),
  latitude: Yup.string()
    .nullable()
    .test("valid-latitude", "Latitud inválida", (value) => {
      if (!value || value.trim() === "") return true;
      const parsed = parseCoordinate(value);
      return parsed !== null && parsed >= -90 && parsed <= 90;
    }),
  longitude: Yup.string()
    .nullable()
    .test("valid-longitude", "Longitud inválida", (value) => {
      if (!value || value.trim() === "") return true;
      const parsed = parseCoordinate(value);
      return parsed !== null && parsed >= -180 && parsed <= 180;
    }),
  google_maps_url: Yup.string().nullable().url("Debe ser una URL válida"),
  phone: Yup.string().matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos").required("El teléfono es requerido"),
  whatsapp: Yup.string().matches(/^\d{10}$/, "El WhatsApp debe tener 10 dígitos").required("El WhatsApp es requerido"),
  description: Yup.string().min(10, "La descripción debe tener al menos 10 caracteres").required("La descripción es requerida"),
});

export const ProfileSection = ({ clinicId: _clinicId }: ProfileSectionProps) => {
  const { profile, loading } = useClinicProfile();
  const { mutateAsync: updateProfile } = useUpdateClinicProfile();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para el Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Actualizar especialidades cuando el perfil se carga
  useEffect(() => {
    if (profile?.specialties) {
      setSelectedSpecialties(profile.specialties);
    }
    if (profile?.logoUrl) {
      setLogoPreview(profile.logoUrl);
    }
  }, [profile]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  // ⭐ Función para comprimir y redimensionar imagen
  const compressAndResizeImage = (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calcular nuevas dimensiones manteniendo la proporción
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // Crear canvas para redimensionar
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"));
            return;
          }

          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a Base64 con compresión
          const base64String = canvas.toDataURL("image/jpeg", quality);
          resolve(base64String);
        };
        img.onerror = () => reject(new Error("Error al cargar la imagen"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 10MB antes de comprimir)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setSnackbar({
          open: true,
          message: "La imagen es demasiado grande. Por favor, selecciona una imagen menor a 10MB.",
          severity: 'error'
        });
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Por favor, selecciona un archivo de imagen válido.",
          severity: 'error'
        });
        return;
      }

      try {
        // ⭐ Comprimir y redimensionar antes de convertir a Base64
        // Máximo 800x800px, calidad 80%
        const base64String = await compressAndResizeImage(file, 800, 800, 0.8);

        // Mostrar preview inmediatamente
        setLogoPreview(base64String);

        // Usar el endpoint dedicado para logo — evita problemas con el schema Zod del perfil
        await uploadClinicLogoAPI(base64String);
        setSnackbar({ open: true, message: "Logo actualizado correctamente.", severity: 'success' });
      } catch (error) {
        console.error("Error procesando logo:", error);
        setSnackbar({
          open: true,
          message: "Error al procesar el logo. Por favor, intenta con otra imagen.",
          severity: 'error'
        });
        setLogoPreview(profile?.logoUrl || null);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: profile?.name || "",
      address: profile?.address || "",
      latitude: profile?.latitude?.toString() || "",
      longitude: profile?.longitude?.toString() || "",
      google_maps_url: profile?.google_maps_url || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || "",
      description: profile?.description || "",
    },
    validationSchema,
    enableReinitialize: !!profile, // Solo reinicializar cuando profile esté disponible
    onSubmit: async (values) => {
      if (!profile) return;
      try {
        // Solo enviar los campos que este formulario maneja — sin logo (tiene su propio endpoint)
        const payload: Partial<ClinicProfile> = {
          name: values.name,
          address: values.address,
          phone: values.phone,
          whatsapp: values.whatsapp,
          description: values.description,
          specialties: selectedSpecialties.length > 0 ? selectedSpecialties : (profile.specialties || []),
          latitude: values.latitude && values.latitude !== "" ? (parseCoordinate(values.latitude) ?? undefined) : undefined,
          longitude: values.longitude && values.longitude !== "" ? (parseCoordinate(values.longitude) ?? undefined) : undefined,
          google_maps_url: values.google_maps_url || null,
        };
        await updateProfile(payload);
        setSnackbar({ open: true, message: "Perfil actualizado correctamente.", severity: 'success' });
      } catch (error: any) {
        console.error("Error al guardar perfil:", error);
        setSnackbar({ open: true, message: error?.message || "Error al guardar el perfil.", severity: 'error' });
      }
    },
  });

  if (loading || !profile) {
    return <LoadingSpinner text="Cargando perfil..." />;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Perfil de la Clínica
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid2 container spacing={3}>
              {/* Logo en círculo */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      "&:hover .overlay": {
                        opacity: 1,
                      },
                    }}
                    onClick={handleLogoClick}
                  >
                    <Avatar
                      src={logoPreview || undefined}
                      sx={{
                        width: { xs: 120, sm: 150, md: 180 },
                        height: { xs: 120, sm: 150, md: 180 },
                        bgcolor: "#e0f2f1",
                        border: "3px solid #14b8a6",
                      }}
                    >
                      {!logoPreview && <LocalHospital sx={{ fontSize: { xs: 60, sm: 75, md: 90 }, color: "#14b8a6" }} />}
                    </Avatar>
                    {/* Overlay con icono de cámara */}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "50%",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        cursor: "pointer",
                      }}
                    >
                      <CameraAlt sx={{ fontSize: { xs: 30, sm: 40, md: 40 }, color: "white" }} />
                    </Box>
                  </Box>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={handleLogoClick}
                    sx={{
                      textTransform: "none",
                      borderColor: "#14b8a6",
                      color: "#14b8a6",
                      "&:hover": {
                        borderColor: "#0d9488",
                        backgroundColor: "rgba(20, 184, 166, 0.04)",
                      },
                    }}
                  >
                    {logoPreview ? "Cambiar Logo" : "Subir Logo"}
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Logo cuadrado (mín. 500x500px) o banner rectangular (mín. 800x180px). En la app se muestra como banner de ancho completo. Máx. 10MB.
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre de la Clínica *"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Especialidades que ofrece la clínica
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {medicalSpecialties.map((specialty) => (
                    <Chip
                      key={specialty}
                      label={specialty}
                      onClick={() => {
                        if (selectedSpecialties.includes(specialty)) {
                          setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
                        } else {
                          setSelectedSpecialties([...selectedSpecialties, specialty]);
                        }
                      }}
                      color={selectedSpecialties.includes(specialty) ? "primary" : "default"}
                      variant={selectedSpecialties.includes(specialty) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Dirección *"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="text"
                  label="Latitud (opcional)"
                  name="latitude"
                  value={formik.values.latitude}
                  onChange={formik.handleChange}
                  error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                  helperText={(formik.touched.latitude && formik.errors.latitude) || "Ejemplo: -0.180653"}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="text"
                  label="Longitud (opcional)"
                  name="longitude"
                  value={formik.values.longitude}
                  onChange={formik.handleChange}
                  error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                  helperText={(formik.touched.longitude && formik.errors.longitude) || "Ejemplo: -78.467834"}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="url"
                  label="Link de Google Maps (opcional)"
                  name="google_maps_url"
                  value={formik.values.google_maps_url}
                  onChange={formik.handleChange}
                  error={formik.touched.google_maps_url && Boolean(formik.errors.google_maps_url)}
                  helperText={(formik.touched.google_maps_url && formik.errors.google_maps_url) || "Ejemplo: https://maps.app.goo.gl/..."}
                  placeholder="https://maps.app.goo.gl/..."
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Teléfono *"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="WhatsApp *"
                  name="whatsapp"
                  value={formik.values.whatsapp}
                  onChange={formik.handleChange}
                  error={formik.touched.whatsapp && Boolean(formik.errors.whatsapp)}
                  helperText={formik.touched.whatsapp && formik.errors.whatsapp}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción *"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid2>
            </Grid2>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
              >
                Guardar Cambios
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Mapa de Ubicación */}
      {profile?.latitude && profile?.longitude && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ color: "error.main", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ubicación en el Mapa
              </Typography>
            </Box>
            <Map
              latitude={profile?.latitude || 0}
              longitude={profile?.longitude || 0}
              address={profile?.address || ""}
              height={400}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Ingresa las coordenadas (latitud y longitud) para mostrar la ubicación en el mapa.
              Puedes obtenerlas desde Google Maps haciendo clic derecho en cualquier ubicación.
            </Typography>
            {profile?.google_maps_url && (
              <Box sx={{ mt: 2, minWidth: 0 }}>
                <Typography
                  component="a"
                  href={profile.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{
                    color: "#14b8a6",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                    display: "inline-block",
                    maxWidth: "100%",
                  }}
                >
                  Ver en Google Maps →
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
