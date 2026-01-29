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
import { CalendarToday, CheckCircle, Cancel, Person, Phone } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { ClinicAssociatedAppointment } from "../../domain/ClinicAssociatedDoctor.entity";
import {
  getClinicAssociatedAppointmentsAPI,
  updateClinicAppointmentStatusAPI,
} from "../../infrastructure/clinic-associated.api";
import {
  getClinicAssociatedAppointmentsMock,
  saveClinicAssociatedAppointmentsMock,
} from "../../infrastructure/clinic-associated.mock";
import { useClinicAssociatedDoctor } from "../hooks/useClinicAssociatedDoctor";
import { CreateDiagnosisModal } from "./modals/CreateDiagnosisModal";

export const ClinicAssociatedAppointmentsSection = () => {
  const { clinicInfo } = useClinicAssociatedDoctor();
  const [appointments, setAppointments] = useState<ClinicAssociatedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<ClinicAssociatedAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      try {
        const data = await getClinicAssociatedAppointmentsAPI();
        setAppointments(data);
      } catch (error) {
        // Fallback a mocks
        console.warn("Usando mocks para citas");
        const data = await getClinicAssociatedAppointmentsMock();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleOpenDetail = (appointment: ClinicAssociatedAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (status: "COMPLETED" | "NO_SHOW") => {
    if (!selectedAppointment) return;
    setUpdatingStatus(true);
    try {
      try {
        const updated = await updateClinicAppointmentStatusAPI(selectedAppointment.id, status);
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === updated.id ? updated : apt))
        );
        // Actualizar en mocks también
        const updatedAppointments = appointments.map((apt) =>
          apt.id === updated.id ? updated : apt
        );
        await saveClinicAssociatedAppointmentsMock(updatedAppointments);
        
        // Si se marca como atendida, abrir modal de diagnóstico
        if (status === "COMPLETED") {
          setIsDetailModalOpen(false);
          setIsDiagnosisModalOpen(true);
        } else {
          setIsDetailModalOpen(false);
          setSelectedAppointment(null);
        }
      } catch (error) {
        // Fallback a mocks
        console.warn("Usando mocks para actualizar estado");
        const updated = { ...selectedAppointment, status };
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === updated.id ? updated : apt))
        );
        await saveClinicAssociatedAppointmentsMock(
          appointments.map((apt) => (apt.id === updated.id ? updated : apt))
        );
        
        if (status === "COMPLETED") {
          setIsDetailModalOpen(false);
          setIsDiagnosisModalOpen(true);
        } else {
          setIsDetailModalOpen(false);
          setSelectedAppointment(null);
        }
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar el estado de la cita");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredAppointments = appointments.filter(
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
                      color={getStatusColor(appointment.status) as any}
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

      {/* Modal de Detalle */}
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
                  color={getStatusColor(selectedAppointment.status) as any}
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

      {/* Modal de Diagnóstico */}
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
            status: selectedAppointment.status as any,
            isPaid: false, // No se muestra información de pago
            paymentMethodRaw: "UNKNOWN",
          } as any}
          onSuccess={() => {
            loadAppointments();
          }}
        />
      )}
    </Box>
  );
};
