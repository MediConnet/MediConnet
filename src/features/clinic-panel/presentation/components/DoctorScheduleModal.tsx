import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid2,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Info, Save, Schedule } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDoctorSchedule } from "../hooks/useDoctorSchedule";
import {
  doctorScheduleToApiPayload,
  validateDoctorScheduleAgainstClinic,
} from "../../../doctor-panel/infrastructure/clinic-schedule.utils";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import type { DaySchedule } from "../../../clinic-panel/domain/clinic.entity";
import type { DoctorSchedule } from "../../../clinic-panel/domain/doctor-schedule.entity";

interface DoctorScheduleModalProps {
  open: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
}

const daysOfWeek = [
  { key: "monday" as const, label: "Lunes" },
  { key: "tuesday" as const, label: "Martes" },
  { key: "wednesday" as const, label: "Miércoles" },
  { key: "thursday" as const, label: "Jueves" },
  { key: "friday" as const, label: "Viernes" },
  { key: "saturday" as const, label: "Sábado" },
  { key: "sunday" as const, label: "Domingo" },
];

export const DoctorScheduleModal = ({
  open,
  onClose,
  doctorId,
  doctorName,
}: DoctorScheduleModalProps) => {
  const { schedule, clinicSchedule, loading, error, updateSchedule } =
    useDoctorSchedule(doctorId);
  const [localSchedule, setLocalSchedule] = useState<DoctorSchedule | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const feedback = useFeedbackStore();

  useEffect(() => {
    if (schedule) {
      setLocalSchedule(schedule);
    }
  }, [schedule]);

  const handleDayChange = (
    day: keyof DoctorSchedule & ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"),
    field: keyof DaySchedule | "breakStart" | "breakEnd",
    value: string | boolean,
  ) => {
    if (!localSchedule) return;

    setLocalSchedule({
      ...localSchedule,
      [day]: {
        ...localSchedule[day],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!localSchedule || !clinicSchedule) return;

    const validationMsg = validateDoctorScheduleAgainstClinic(
      localSchedule,
      clinicSchedule,
    );
    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }

    setSaving(true);
    setValidationError(null);

    try {
      const payload = doctorScheduleToApiPayload(localSchedule);
      await updateSchedule(payload as any);
      feedback.showFeedback(
        "success",
        "Horario guardado",
        `El horario de ${doctorName} se actualizó correctamente.`,
      );
      onClose();
    } catch (err: any) {
      setValidationError(
        err?.message || "No fue posible guardar la disponibilidad del médico.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Schedule sx={{ color: "#14b8a6" }} />
        <Typography variant="h6" fontWeight={700} component="span">
          Configurar Horario: {doctorName}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box py={4}>
            <LoadingSpinner text="Cargando horarios..." />
          </Box>
        ) : error && !localSchedule ? (
          <Alert severity="error">
            {error.message || "Error al cargar horarios del médico."}
          </Alert>
        ) : !clinicSchedule || !localSchedule ? (
          <Alert severity="warning">
            No se encontró información de horarios de la clínica.
          </Alert>
        ) : (
          <Box>
            <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
              Los horarios configurados para el médico deben ajustarse al rango
              de apertura general de la clínica.
            </Alert>

            {validationError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setValidationError(null)}>
                {validationError}
              </Alert>
            )}

            <Grid2 container spacing={3}>
              {daysOfWeek.map(({ key, label }) => {
                const clinicDay = clinicSchedule[key];
                const doctorDay = localSchedule[key];
                const clinicClosed = !clinicDay?.enabled;

                return (
                  <Grid2 key={key} size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        opacity: clinicClosed ? 0.6 : 1,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={doctorDay?.enabled ?? false}
                            disabled={clinicClosed}
                            onChange={(e) =>
                              handleDayChange(key, "enabled", e.target.checked)
                            }
                          />
                        }
                        label={
                          <Typography fontWeight={600}>
                            {label}
                            {clinicClosed && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                (clínica cerrada)
                              </Typography>
                            )}
                            {!clinicClosed && clinicDay?.enabled && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                Clínica: {clinicDay.startTime} – {clinicDay.endTime}
                              </Typography>
                            )}
                          </Typography>
                        }
                      />

                      {doctorDay?.enabled && !clinicClosed && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            mt: 1,
                            ml: 4,
                          }}
                        >
                          <TextField
                            label="Inicio"
                            type="time"
                            size="small"
                            value={doctorDay.startTime}
                            onChange={(e) =>
                              handleDayChange(key, "startTime", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            label="Fin"
                            type="time"
                            size="small"
                            value={doctorDay.endTime}
                            onChange={(e) =>
                              handleDayChange(key, "endTime", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            label="Almuerzo inicio"
                            type="time"
                            size="small"
                            value={doctorDay.breakStart ?? ""}
                            onChange={(e) =>
                              handleDayChange(key, "breakStart", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            label="Almuerzo fin"
                            type="time"
                            size="small"
                            value={doctorDay.breakEnd ?? ""}
                            onChange={(e) =>
                              handleDayChange(key, "breakEnd", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid2>
                );
              })}
            </Grid2>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving || loading || !localSchedule}
          sx={{ bgcolor: "#14b8a6", "&:hover": { bgcolor: "#0d9488" } }}
        >
          {saving ? "Guardando..." : "Guardar horario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
