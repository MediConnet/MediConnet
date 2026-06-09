import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Block, CheckCircle, Cancel, Schedule, Info } from "@mui/icons-material";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDateBlockRequests } from "../../association/hooks/useDateBlockRequests";
import { useClinicAssociatedDoctor } from "../../association/hooks/useClinicAssociatedDoctor";
import { getClinicAssociatedScheduleAPI } from "../../association/api/clinic-associated.api";
import { ensureArray } from "../../association/api/clinic-associated-list.utils";
import type { DateBlockRequest as DateBlockRequestType } from "../../association/types/ClinicAssociatedDoctor.entity";
import type { ClinicSchedule } from "../../clinic/types/clinic.entity";
import { useFeedbackStore } from "../../../app/store/feedback.store";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";

const DAY_NAMES: Record<string, { es: string }> = {
  monday: { es: "lunes" },
  tuesday: { es: "martes" },
  wednesday: { es: "miércoles" },
  thursday: { es: "jueves" },
  friday: { es: "viernes" },
  saturday: { es: "sábado" },
  sunday: { es: "domingo" },
};

const getDayKey = (date: Date): string => {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][date.getDay()];
};

const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

const isTimeWithin = (time: string, start: string, end: string): boolean => {
  const t = timeToMinutes(time);
  return t >= timeToMinutes(start) && t <= timeToMinutes(end);
};

const validateBlockAgainstSchedule = (
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  schedule: ClinicSchedule,
): string | null => {
  if (!startTime || !endTime) return "Debes seleccionar hora de inicio y fin.";
  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    return "La hora de inicio debe ser anterior a la hora de fin.";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const errors: string[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayKey = getDayKey(d);
    const daySchedule = schedule[dayKey as keyof ClinicSchedule];
    if (!daySchedule || !daySchedule.enabled) {
      errors.push(`La clínica cierra los ${DAY_NAMES[dayKey]?.es || dayKey}.`);
      continue;
    }
    if (!isTimeWithin(startTime, daySchedule.startTime, daySchedule.endTime)) {
      errors.push(
        `El horario de la clínica los ${DAY_NAMES[dayKey]?.es || dayKey} es ${daySchedule.startTime} – ${daySchedule.endTime}.`,
      );
    }
  }

  return errors.length > 0 ? errors.join(" ") : null;
};

export const DateBlockRequest = () => {
  const { clinicInfo } = useClinicAssociatedDoctor({ fetchProfile: false });
  const { requests, loading, submitting, requestBlock } = useDateBlockRequests(
    clinicInfo?.id || ""
  );
  const safeRequests = ensureArray<DateBlockRequestType>(requests);
  const feedback = useFeedbackStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clinicSchedule, setClinicSchedule] = useState<ClinicSchedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCreateDialog = async () => {
    setScheduleLoading(true);
    setError(null);
    setScheduleError(null);
    try {
      const data = await getClinicAssociatedScheduleAPI();
      setClinicSchedule(data.clinicSchedule);
      setIsDialogOpen(true);
    } catch {
      setScheduleError("No fue posible cargar el horario de la clínica. Verifica la conexión.");
    } finally {
      setScheduleLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      startTime: "08:00",
      endTime: "17:00",
      reason: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.string().required("La fecha de inicio es requerida"),
      endDate: Yup.string()
        .required("La fecha de fin es requerida")
        .test("is-after-start", "La fecha de fin debe ser posterior o igual a la fecha de inicio", function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;
          return new Date(value) >= new Date(startDate);
        }),
      startTime: Yup.string().required("La hora de inicio es requerida"),
      endTime: Yup.string().required("La hora de fin es requerida"),
      reason: Yup.string()
        .required("El motivo es requerido")
        .min(10, "El motivo debe tener al menos 10 caracteres")
        .max(200, "El motivo debe tener máximo 200 caracteres"),
    }),
    onSubmit: async (values) => {
      if (!clinicSchedule) {
        feedback.showFeedback("error", "Error", "No hay información del horario de la clínica.");
        return;
      }

      const validationError = validateBlockAgainstSchedule(
        values.startDate,
        values.endDate,
        values.startTime,
        values.endTime,
        clinicSchedule,
      );
      if (validationError) {
        feedback.showFeedback("warning", "Bloqueo no permitido", validationError);
        return;
      }

      try {
        await requestBlock(values.startDate, values.endDate, values.reason);
        formik.resetForm();
        setIsDialogOpen(false);
        feedback.showFeedback("success", "Solicitud enviada", "Solicitud de bloqueo enviada. Espera la aprobación de la clínica.");
      } catch {
        feedback.showFeedback("error", "Error", "No fue posible enviar la solicitud de bloqueo.");
      }
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "warning";
      case "approved": return "success";
      case "rejected": return "error";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Pendiente";
      case "approved": return "Aprobada";
      case "rejected": return "Rechazada";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  if (!clinicInfo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Schedule sx={{ fontSize: 32, color: "#14b8a6" }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Solicitar Bloqueos de Fecha
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Solicita días libres por vacaciones, congresos u otros motivos
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>Reglas para solicitar bloqueos</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Los bloqueos deben estar dentro del horario de atención de la clínica.
          La clínica revisará y aprobará o rechazará tu solicitud.
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateDialog}
          disabled={scheduleLoading}
          sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
        >
          {scheduleLoading ? "Cargando..." : "Nueva Solicitud"}
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner text="Cargando solicitudes..." />
      ) : safeRequests.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Block sx={{ fontSize: 48, color: "#e5e7eb", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                No hay solicitudes de bloqueo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea una nueva solicitud para pedir días libres.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Solicitud</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {safeRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{formatDate(request.startDate)}</TableCell>
                  <TableCell>{formatDate(request.endDate)}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(request.status)}
                      color={getStatusColor(request.status) as any}
                      size="small"
                      icon={
                        request.status === "approved" ? <CheckCircle /> :
                        request.status === "rejected" ? <Cancel /> : <Block />
                      }
                    />
                  </TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Nueva Solicitud de Bloqueo</DialogTitle>
          <DialogContent>
            {scheduleError && (
              <Alert severity="error" sx={{ mb: 2 }}>{scheduleError}</Alert>
            )}
            {clinicSchedule && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Horario clínica: {clinicSchedule.monday.startTime} – {clinicSchedule.monday.endTime} (lunes a viernes)
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Inicio *"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate && formik.errors.startDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
              <TextField
                fullWidth
                type="date"
                label="Fecha de Fin *"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formik.values.startDate || new Date().toISOString().split("T")[0] }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Hora Inicio *"
                  name="startTime"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                  helperText={formik.touched.startTime && formik.errors.startTime}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  type="time"
                  label="Hora Fin *"
                  name="endTime"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                  helperText={formik.touched.endTime && formik.errors.endTime}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Motivo *"
                name="reason"
                value={formik.values.reason}
                onChange={formik.handleChange}
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={
                  (formik.touched.reason && formik.errors.reason) ||
                  `${formik.values.reason.length}/200 caracteres`
                }
                inputProps={{ maxLength: 200 }}
                placeholder="Ej: Vacaciones, Congreso médico, Emergencia familiar..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
            >
              {submitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
