import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid2,
  Divider,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Email,
  Phone,
  WhatsApp,
  School,
  WorkspacePremium,
  PictureAsPdf,
  MedicalServices,
  AccessTime,
} from "@mui/icons-material";
import type { ClinicDoctor } from "../../domain/doctor.entity";

interface DoctorProfileViewModalProps {
  open: boolean;
  onClose: () => void;
  doctor: ClinicDoctor | null;
}

export const DoctorProfileViewModal = ({
  open,
  onClose,
  doctor,
}: DoctorProfileViewModalProps) => {
  if (!doctor) return null;

  const handleViewDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = fileName;
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={doctor.profileImageUrl}
            sx={{ width: 60, height: 60, bgcolor: "#14b8a6" }}
          >
            {doctor.name?.charAt(0) || "M"}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {doctor.name || "Sin nombre"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {doctor.specialty || "Sin especialidad"}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Información de Contacto */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <MedicalServices fontSize="small" />
              Información de Contacto
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{doctor.email}</Typography>
                </Box>
              </Grid2>
              {doctor.phone && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{doctor.phone}</Typography>
                  </Box>
                </Grid2>
              )}
              {doctor.whatsapp && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WhatsApp fontSize="small" color="action" />
                    <Typography variant="body2">{doctor.whatsapp}</Typography>
                  </Box>
                </Grid2>
              )}
              {doctor.officeNumber && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Consultorio:
                    </Typography>
                    <Chip label={doctor.officeNumber} size="small" color="primary" />
                  </Box>
                </Grid2>
              )}
            </Grid2>
          </Box>

          <Divider />

          {/* Perfil Profesional */}
          {doctor.professionalProfile && (
            <>
              {/* Biografía */}
              {doctor.professionalProfile.bio && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Descripción Profesional
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.professionalProfile.bio}
                  </Typography>
                </Box>
              )}

              {/* Experiencia */}
              {doctor.professionalProfile.experience !== undefined && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Experiencia
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.professionalProfile.experience} años de experiencia
                  </Typography>
                </Box>
              )}

              <Divider />

              {/* Educación */}
              {doctor.professionalProfile.education &&
                doctor.professionalProfile.education.length > 0 && (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <School fontSize="small" color="action" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Educación
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      {doctor.professionalProfile.education.map((edu, index) => {
                        // Manejar tanto strings como objetos con PDF
                        const eduItem = typeof edu === "string" ? { text: edu } : edu;
                        const hasFile = eduItem.fileUrl && eduItem.fileName;
                        return (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              bgcolor: "grey.50",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {eduItem.text}
                            </Typography>
                            {hasFile && (
                              <Chip
                                icon={<PictureAsPdf />}
                                label={eduItem.fileName}
                                size="small"
                                onClick={() =>
                                  handleViewDocument(eduItem.fileUrl!, eduItem.fileName!)
                                }
                                sx={{ mt: 1, cursor: "pointer" }}
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

              {/* Certificaciones */}
              {doctor.professionalProfile.certifications &&
                doctor.professionalProfile.certifications.length > 0 && (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <WorkspacePremium fontSize="small" color="action" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Certificaciones
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      {doctor.professionalProfile.certifications.map((cert, index) => {
                        // Manejar tanto strings como objetos con PDF
                        const certItem = typeof cert === "string" ? { text: cert } : cert;
                        const hasFile = certItem.fileUrl && certItem.fileName;
                        return (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              bgcolor: "grey.50",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {certItem.text}
                            </Typography>
                            {hasFile && (
                              <Chip
                                icon={<PictureAsPdf />}
                                label={certItem.fileName}
                                size="small"
                                onClick={() =>
                                  handleViewDocument(certItem.fileUrl!, certItem.fileName!)
                                }
                                sx={{ mt: 1, cursor: "pointer" }}
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
            </>
          )}

          {/* Si no hay perfil profesional */}
          {!doctor.professionalProfile && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                El médico aún no ha completado su perfil profesional
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: "#14b8a6" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
