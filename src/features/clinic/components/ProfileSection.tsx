import { Box, Typography, Button, TextField, Grid2, Card, CardContent, Chip, Avatar } from "@mui/material";
import { Save, CloudUpload, LocationOn, CameraAlt, LocalHospital } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import type { ClinicProfile } from "../types/clinic.entity";
import { useClinicProfile, useUpdateClinicProfile } from "../hooks/useClinicProfile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadClinicLogoAPI } from "../api/clinic.api";
import { Map } from "../../../shared/ui/Map";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import {
  formatCoordinateForInput,
  parseCoordinate,
} from "../../../shared/lib/parseCoordinate";
import { useSpecialties } from "../../auth/presentation/hooks/useSpecialties";
import { useFeedbackStore } from "../../../app/store/feedback.store";

interface ProfileSectionProps {
  clinicId: string;
}

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
  const { data: specialties = [] } = useSpecialties();
  const feedback = useFeedbackStore();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

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
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        feedback.showFeedback('error', 'Error', 'La imagen es demasiado grande. Por favor, selecciona una imagen menor a 10MB.');
        return;
      }

      if (!file.type.startsWith("image/")) {
        feedback.showFeedback('error', 'Error', 'Por favor, selecciona un archivo de imagen válido.');
        return;
      }

      try {
        const base64String = await compressAndResizeImage(file, 800, 800, 0.8);

        setLogoPreview(base64String);

        await uploadClinicLogoAPI(base64String);
        feedback.showFeedback('success', 'Operación completada', 'La información se guardó correctamente.');
      } catch (error) {
        console.error("Error procesando logo:", error);
        feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
        setLogoPreview(profile?.logoUrl || null);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: profile?.name || "",
      address: profile?.address || "",
      latitude: formatCoordinateForInput(profile?.latitude, "lat") || "",
      longitude: formatCoordinateForInput(profile?.longitude, "lng") || "",
      google_maps_url: profile?.google_maps_url || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || "",
      description: profile?.description || "",
    },
    validationSchema,
    enableReinitialize: !!profile,
    onSubmit: async (values) => {
      if (!profile) return;
      try {
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
      } catch {
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
                  {specialties.map((specialty) => (
                    <Chip
                      key={specialty.id}
                      label={specialty.name}
                      onClick={() => {
                        if (selectedSpecialties.includes(specialty.name)) {
                          setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty.name));
                        } else {
                          setSelectedSpecialties([...selectedSpecialties, specialty.name]);
                        }
                      }}
                      color={selectedSpecialties.includes(specialty.name) ? "primary" : "default"}
                      variant={selectedSpecialties.includes(specialty.name) ? "filled" : "outlined"}
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
    </Box>
  );
};
