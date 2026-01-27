import {
  Assignment,
  CalendarToday,
  ExpandMore,
  LocalHospital,
  Person,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { Diagnosis } from "../../../doctor-panel/domain/Diagnosis.entity";
import { getDiagnosesByPatientMock } from "../../../doctor-panel/infrastructure/diagnoses.api";

export const MedicalHistorySection = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const authStore = useAuthStore();
  const { user } = authStore;

  useEffect(() => {
    // Obtener diagnósticos del paciente actual
    // En producción, esto se haría con el ID del paciente autenticado
    const patientId = user?.id || "patient-1";
    const patientDiagnoses = getDiagnosesByPatientMock(patientId);
    setDiagnoses(patientDiagnoses);

    // Escuchar actualizaciones
    const handleUpdate = () => {
      const updated = getDiagnosesByPatientMock(patientId);
      setDiagnoses(updated);
    };

    window.addEventListener("diagnosesUpdated", handleUpdate);
    return () => {
      window.removeEventListener("diagnosesUpdated", handleUpdate);
    };
  }, [user]);

  if (diagnoses.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 3,
          }}
        >
          <LocalHospital sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay historial médico disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tus diagnósticos aparecerán aquí después de tus consultas médicas
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <LocalHospital sx={{ fontSize: 32, color: "primary.main" }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Historial Médico
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Diagnósticos y tratamientos de tus consultas médicas
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        {diagnoses
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((diagnosis) => (
            <Card
              key={diagnosis.id}
              elevation={0}
              sx={{ border: "1px solid", borderColor: "grey.200" }}
            >
              <Accordion defaultExpanded={diagnoses.indexOf(diagnosis) === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: "grey.50",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      <Assignment />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {diagnosis.diagnosis}
                      </Typography>
                      <Stack direction="row" spacing={2} mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          <CalendarToday
                            sx={{
                              fontSize: 14,
                              mr: 0.5,
                              verticalAlign: "middle",
                            }}
                          />
                          {new Date(diagnosis.date).toLocaleDateString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Person
                            sx={{
                              fontSize: 14,
                              mr: 0.5,
                              verticalAlign: "middle",
                            }}
                          />
                          {diagnosis.doctorName}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <CardContent>
                    <Stack spacing={3}>
                      {diagnosis.symptoms && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            gutterBottom
                          >
                            Síntomas Presentados
                          </Typography>
                          <Typography variant="body1">
                            {diagnosis.symptoms}
                          </Typography>
                        </Box>
                      )}

                      {diagnosis.treatment && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            gutterBottom
                          >
                            Tratamiento Prescrito
                          </Typography>
                          <Typography variant="body1">
                            {diagnosis.treatment}
                          </Typography>
                        </Box>
                      )}

                      {diagnosis.medications && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            gutterBottom
                          >
                            Medicamentos Recetados
                          </Typography>
                          <Typography variant="body1">
                            {diagnosis.medications}
                          </Typography>
                        </Box>
                      )}

                      {diagnosis.observations && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            gutterBottom
                          >
                            Observaciones
                          </Typography>
                          <Typography variant="body1">
                            {diagnosis.observations}
                          </Typography>
                        </Box>
                      )}

                      {diagnosis.recommendations && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            gutterBottom
                          >
                            Recomendaciones
                          </Typography>
                          <Typography variant="body1">
                            {diagnosis.recommendations}
                          </Typography>
                        </Box>
                      )}

                      {diagnosis.nextAppointment && (
                        <Box>
                          <Chip
                            label={`Próxima cita: ${new Date(diagnosis.nextAppointment).toLocaleDateString("es-ES")}`}
                            color="primary"
                            icon={<CalendarToday />}
                          />
                        </Box>
                      )}

                      <Divider />

                      <Typography variant="caption" color="text.secondary">
                        Diagnóstico creado el{" "}
                        {new Date(diagnosis.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </Typography>
                    </Stack>
                  </CardContent>
                </AccordionDetails>
              </Accordion>
            </Card>
          ))}
      </Stack>
    </Box>
  );
};
