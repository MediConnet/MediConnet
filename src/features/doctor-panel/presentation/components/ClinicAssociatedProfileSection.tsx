import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid2,
  TextField,
  Typography,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Save, LocalHospital } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ClinicAssociatedDoctorProfile } from "../../domain/ClinicAssociatedDoctor.entity";
import { useClinicAssociatedDoctor } from "../hooks/useClinicAssociatedDoctor";
import { updateClinicAssociatedProfileAPI } from "../../infrastructure/clinic-associated.api";

interface ClinicAssociatedProfileSectionProps {
  clinicId: string;
  clinicName: string;
}

const validationSchema = Yup.object({
  specialty: Yup.string().required("La especialidad es requerida"),
  experience: Yup.number().min(0, "La experiencia debe ser un número positivo"),
  bio: Yup.string().max(500, "La descripción debe tener máximo 500 caracteres"),
});

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

export const ClinicAssociatedProfileSection = ({
  clinicId: _clinicId,
  clinicName,
}: ClinicAssociatedProfileSectionProps) => {
  const { profile, loading, clinicInfo: _clinicInfo } = useClinicAssociatedDoctor();
  const [saving, setSaving] = useState(false);
  const [educationItems, setEducationItems] = useState<string[]>([]);
  const [certificationItems, setCertificationItems] = useState<string[]>([]);
  const [newEducation, setNewEducation] = useState("");
  const [newCertification, setNewCertification] = useState("");

  useEffect(() => {
    if (profile) {
      setEducationItems(profile.education || []);
      setCertificationItems(profile.certifications || []);
    }
  }, [profile]);

  const formik = useFormik({
    initialValues: {
      specialty: profile?.specialty || "",
      experience: profile?.experience?.toString() || "0",
      bio: profile?.bio || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!profile) return;
      setSaving(true);
      try {
        const updatedProfile: ClinicAssociatedDoctorProfile = {
          ...profile,
          specialty: values.specialty,
          experience: parseInt(values.experience) || 0,
          bio: values.bio,
          phone: values.phone,
          whatsapp: values.whatsapp,
          education: educationItems,
          certifications: certificationItems,
        };

        await updateClinicAssociatedProfileAPI(updatedProfile);
        alert("Perfil actualizado correctamente");
      } catch (error) {
        console.error("Error actualizando perfil:", error);
        alert("Error al actualizar el perfil");
      } finally {
        setSaving(false);
      }
    },
  });

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setEducationItems([...educationItems, newEducation.trim()]);
      setNewEducation("");
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEducationItems(educationItems.filter((_, i) => i !== index));
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertificationItems([...certificationItems, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setCertificationItems(certificationItems.filter((_, i) => i !== index));
  };

  if (loading || !profile) {
    return <Typography>Cargando perfil...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Mi Perfil Profesional
      </Typography>

      {/* Banner informativo de la clínica */}
      <Alert
        icon={<LocalHospital />}
        severity="info"
        sx={{ mb: 3, bgcolor: "info.light", color: "info.dark" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Atiendes en: {clinicName}
        </Typography>
        <Typography variant="body2">
          {_clinicInfo?.address || profile.clinicInfo?.address || "Dirección no disponible"}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
          La gestión financiera, horarios oficiales y precios son responsabilidad de la clínica.
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid2 container spacing={3}>
              {/* Especialidad */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl
                  fullWidth
                  error={formik.touched.specialty && Boolean(formik.errors.specialty)}
                >
                  <InputLabel id="specialty-label">Especialidad *</InputLabel>
                  <Select
                    labelId="specialty-label"
                    label="Especialidad *"
                    name="specialty"
                    value={formik.values.specialty}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">
                      <em>Selecciona una especialidad</em>
                    </MenuItem>
                    {medicalSpecialties.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.specialty && formik.errors.specialty && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {formik.errors.specialty}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              {/* Años de experiencia */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Años de experiencia"
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  error={formik.touched.experience && Boolean(formik.errors.experience)}
                  helperText={formik.touched.experience && formik.errors.experience}
                  inputProps={{ min: 0 }}
                />
              </Grid2>

              {/* Descripción/Bio */}
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción profesional"
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  error={formik.touched.bio && Boolean(formik.errors.bio)}
                  helperText={
                    (formik.touched.bio && formik.errors.bio) ||
                    `${formik.values.bio.length}/500 caracteres`
                  }
                  inputProps={{ maxLength: 500 }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Educación
                </Typography>
                <Stack spacing={2}>
                  {educationItems.map((edu, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                      }}
                    >
                      <Typography flex={1}>{edu}</Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  ))}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Agregar estudio (ej: Universidad Central - Medicina)"
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEducation();
                        }
                      }}
                    />
                    <Button variant="outlined" onClick={handleAddEducation}>
                      Agregar
                    </Button>
                  </Box>
                </Stack>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Certificaciones
                </Typography>
                <Stack spacing={2}>
                  {certificationItems.map((cert, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                      }}
                    >
                      <Typography flex={1}>{cert}</Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveCertification(index)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  ))}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Agregar certificación"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCertification();
                        }
                      }}
                    />
                    <Button variant="outlined" onClick={handleAddCertification}>
                      Agregar
                    </Button>
                  </Box>
                </Stack>
              </Grid2>

              {/* Contacto (opcional, puede ser diferente a la clínica) */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Teléfono (opcional)"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="WhatsApp (opcional)"
                  name="whatsapp"
                  value={formik.values.whatsapp}
                  onChange={formik.handleChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid2>
            </Grid2>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={saving}
                sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
