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
  IconButton,
  Chip,
} from "@mui/material";
import { Save, LocalHospital, AttachFile, Delete, PictureAsPdf } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
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
  const [educationItems, setEducationItems] = useState<Array<{ text: string; fileUrl?: string; fileName?: string }>>([]);
  const [certificationItems, setCertificationItems] = useState<Array<{ text: string; fileUrl?: string; fileName?: string }>>([]);
  const [newEducation, setNewEducation] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const educationFileInputRef = useRef<HTMLInputElement>(null);
  const certificationFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      // Convertir arrays de strings a objetos con text y fileUrl
      const education = (profile.education || []).map(edu => 
        typeof edu === 'string' ? { text: edu } : edu
      );
      const certifications = (profile.certifications || []).map(cert => 
        typeof cert === 'string' ? { text: cert } : cert
      );
      setEducationItems(education);
      setCertificationItems(certifications);
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
      setEducationItems([...educationItems, { text: newEducation.trim() }]);
      setNewEducation("");
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEducationItems(educationItems.filter((_, i) => i !== index));
  };

  const handleEducationFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      // Agregar automáticamente con el nombre del archivo como texto
      try {
        const base64 = await fileToBase64(file);
        const fileName = file.name;
        const text = newEducation.trim() || fileName.replace('.pdf', '');
        
        setEducationItems([...educationItems, { text, fileUrl: base64, fileName }]);
        setNewEducation("");
        
        // Limpiar el input file
        if (educationFileInputRef.current) {
          educationFileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error al procesar archivo:', error);
        alert('Error al procesar el archivo PDF');
      }
    }
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertificationItems([...certificationItems, { text: newCertification.trim() }]);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setCertificationItems(certificationItems.filter((_, i) => i !== index));
  };

  const handleCertificationFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      // Agregar automáticamente con el nombre del archivo como texto
      try {
        const base64 = await fileToBase64(file);
        const fileName = file.name;
        const text = newCertification.trim() || fileName.replace('.pdf', '');
        
        setCertificationItems([...certificationItems, { text, fileUrl: base64, fileName }]);
        setNewCertification("");
        
        // Limpiar el input file
        if (certificationFileInputRef.current) {
          certificationFileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error al procesar archivo:', error);
        alert('Error al procesar el archivo PDF');
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleViewDocument = (fileUrl: string, fileName: string) => {
    // Abrir el PDF en una nueva pestaña
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = fileName;
    link.click();
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
                        p: 2,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                      }}
                    >
                      <Box flex={1}>
                        <Typography fontWeight={500}>{edu.text}</Typography>
                        {edu.fileName && (
                          <Chip
                            icon={<PictureAsPdf />}
                            label={edu.fileName}
                            size="small"
                            onClick={() => handleViewDocument(edu.fileUrl!, edu.fileName!)}
                            sx={{ mt: 1, cursor: 'pointer' }}
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <Delete />
                      </IconButton>
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
                    <input
                      ref={educationFileInputRef}
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={handleEducationFileSelect}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AttachFile />}
                      onClick={() => educationFileInputRef.current?.click()}
                      sx={{ 
                        minWidth: '140px',
                        backgroundColor: "#14b8a6", 
                        "&:hover": { backgroundColor: "#0d9488" } 
                      }}
                    >
                      Adjuntar PDF
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
                        p: 2,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                      }}
                    >
                      <Box flex={1}>
                        <Typography fontWeight={500}>{cert.text}</Typography>
                        {cert.fileName && (
                          <Chip
                            icon={<PictureAsPdf />}
                            label={cert.fileName}
                            size="small"
                            onClick={() => handleViewDocument(cert.fileUrl!, cert.fileName!)}
                            sx={{ mt: 1, cursor: 'pointer' }}
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveCertification(index)}
                      >
                        <Delete />
                      </IconButton>
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
                    <input
                      ref={certificationFileInputRef}
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={handleCertificationFileSelect}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AttachFile />}
                      onClick={() => certificationFileInputRef.current?.click()}
                      sx={{ 
                        minWidth: '140px',
                        backgroundColor: "#14b8a6", 
                        "&:hover": { backgroundColor: "#0d9488" } 
                      }}
                    >
                      Adjuntar PDF
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
