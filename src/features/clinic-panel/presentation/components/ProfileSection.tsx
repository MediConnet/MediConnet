import { Box, Typography, Button, TextField, Grid2, Card, CardContent, Stack, Chip } from "@mui/material";
import { Save, CloudUpload } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useClinicProfile } from "../hooks/useClinicProfile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadClinicLogoAPI } from "../../infrastructure/clinic.api";

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
  phone: Yup.string().matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos").required("El teléfono es requerido"),
  whatsapp: Yup.string().matches(/^\d{10}$/, "El WhatsApp debe tener 10 dígitos").required("El WhatsApp es requerido"),
  description: Yup.string().min(10, "La descripción debe tener al menos 10 caracteres").required("La descripción es requerida"),
});

export const ProfileSection = ({ clinicId }: ProfileSectionProps) => {
  const { profile, loading, updateProfile } = useClinicProfile();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  // Actualizar especialidades cuando el perfil se carga
  useEffect(() => {
    if (profile?.specialties) {
      setSelectedSpecialties(profile.specialties);
    }
  }, [profile]);

  const formik = useFormik({
    initialValues: {
      name: profile?.name || "",
      address: profile?.address || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || "",
      description: profile?.description || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!profile) return;
      await updateProfile({
        ...profile,
        ...values,
        specialties: selectedSpecialties.length > 0 ? selectedSpecialties : profile.specialties,
      });
    },
  });

  if (loading || !profile) {
    return <Typography>Cargando perfil...</Typography>;
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

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    component="label"
                    fullWidth
                  >
                    Subir Logo
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const result = await uploadClinicLogoAPI(file);
                            await updateProfile({ ...profile, logoUrl: result.logoUrl });
                          } catch (error) {
                            console.error("Error subiendo logo:", error);
                            alert("Error al subir el logo");
                          }
                        }
                      }}
                    />
                  </Button>
                  {profile.logoUrl && (
                    <Box
                      component="img"
                      src={profile.logoUrl}
                      alt="Logo"
                      sx={{ width: 100, height: 100, mt: 2, borderRadius: 2 }}
                    />
                  )}
                </Box>
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
    </Box>
  );
};
