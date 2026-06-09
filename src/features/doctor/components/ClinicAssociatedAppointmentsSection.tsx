import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useState } from "react";
import type { ClinicAssociatedAppointment } from "../../association/types/ClinicAssociatedDoctor.entity";
import { useClinicAssociatedDoctor } from "../../association/hooks/useClinicAssociatedDoctor";
import { useClinicAssociatedAppointments } from "../../association/hooks/useClinicAssociatedAppointments";
import { ensureArray } from "../../association/api/clinic-associated-list.utils";
import { CreateDiagnosisModal } from "./modals/CreateDiagnosisModal";
import { useFeedbackStore } from "../../../app/store/feedback.store";

export const ClinicAssociatedAppointmentsSection = () => {
  const { clinicInfo } = useClinicAssociatedDoctor({ fetchProfile: false });
  const {
    appointments,
    loading,
    updatingStatus,
    loadAppointments,
    updateStatus,
  } = useClinicAssociatedAppointments(clinicInfo?.id || "");
  const feedback = useFeedbackStore();

  const safeAppointments = ensureArray<ClinicAssociatedAppointment>(appointments);

  const [selectedAppointment, setSelectedAppointment] = useState<ClinicAssociatedAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const handleOpenDetail = (appointment: ClinicAssociatedAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (status: "COMPLETED" | "NO_SHOW") => {
    if (!selectedAppointment) return;
    try {
      await updateStatus(selectedAppointment.id, status);
      feedback.showFeedback('success', 'Estado actualizado', 'El estado de la cita se actualizó correctamente.');
      if (status === "COMPLETED") {
        setIsDetailModalOpen(false);
        setIsDiagnosisModalOpen(true);
      } else {
        setIsDetailModalOpen(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      feedback.showFeedback('error', 'Error', 'No fue posible actualizar el estado de la cita.');
    }
  };

  const filteredAppointments = safeAppointments.filter(
    (apt) => apt.date === selectedDate && apt.status === "CONFIRMED"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "primary";
      case "COMPLETED":
        return "success";
      case "NO_SHOW":
        return "error";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "COMPLETED":
        return "Atendida";
      case "NO_SHOW":
        return "No asistió";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (!clinicInfo) {
    return (
      <Box>
        <Typography>Cargando información de la clínica...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Mis Citas
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Solo puedes ver y gestionar citas confirmadas. La información de pagos y precios es gestionada por la clínica.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            type="date"
            label="Fecha"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </CardContent>
      </Card>

      {loading ? (
        <Typography>Cargando citas...</Typography>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              No hay citas confirmadas para esta fecha
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hora</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.patientPhone || "N/A"}</TableCell>
                  <TableCell>{appointment.reason || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(appointment.status)}
                      color={getStatusColor(appointment.status) as "primary" | "success" | "error" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenDetail(appointment)}
                    >
                      Ver Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalle de la Cita</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Grid2 container spacing={2} sx={{ mt: 1 }}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Paciente
                </Typography>
                <Typography variant="h6">{selectedAppointment.patientName}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha
                </Typography>
                <Typography>{selectedAppointment.date}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Hora
                </Typography>
                <Typography>{selectedAppointment.time}</Typography>
              </Grid2>
              {selectedAppointment.patientPhone && (
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography>{selectedAppointment.patientPhone}</Typography>
                </Grid2>
              )}
              {selectedAppointment.reason && (
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Motivo
                  </Typography>
                  <Typography>{selectedAppointment.reason}</Typography>
                </Grid2>
              )}
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={getStatusLabel(selectedAppointment.status)}
                  color={getStatusColor(selectedAppointment.status) as "primary" | "success" | "error" | "default"}
                  size="small"
                />
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailModalOpen(false)}>Cerrar</Button>
          {selectedAppointment?.status === "CONFIRMED" && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={updatingStatus}
              >
                Marcar como Atendida
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleStatusChange("NO_SHOW")}
                disabled={updatingStatus}
              >
                No asistió
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {selectedAppointment && (
        <CreateDiagnosisModal
          open={isDiagnosisModalOpen}
          onClose={() => {
            setIsDiagnosisModalOpen(false);
            setSelectedAppointment(null);
            loadAppointments();
          }}
          appointment={{
            id: selectedAppointment.id,
            patientId: selectedAppointment.patientId,
            patientName: selectedAppointment.patientName,
            date: selectedAppointment.date,
            time: selectedAppointment.time,
            reason: selectedAppointment.reason || "",
            status: selectedAppointment.status as "CONFIRMED" | "COMPLETED" | "NO_SHOW" | "CANCELLED",
            isPaid: false,
            paymentMethodRaw: "UNKNOWN",
          }}
          onSuccess={() => {
            loadAppointments();
          }}
        />
      )}
    </Box>
  );
};
