import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CheckCircle, Cancel, Person } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useClinicAppointments } from "../hooks/useClinicAppointments";
import { getTodayReceptionAppointmentsAPI } from "../../infrastructure/clinic-appointments.api";
import type { ClinicAppointment } from "../../domain/appointment.entity";

interface ReceptionSectionProps {
  clinicId: string;
}

export const ReceptionSection = ({ clinicId }: ReceptionSectionProps) => {
  const today = new Date().toISOString().split("T")[0];
  const { appointments, loading, updateReceptionStatus } = useClinicAppointments(clinicId, today);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [receptionStatus, setReceptionStatus] = useState<"arrived" | "not_arrived" | "attended">("arrived");
  const [notes, setNotes] = useState("");
  
  // Para recepción, usar el endpoint específico si está disponible
  const [receptionAppointments, setReceptionAppointments] = useState<ClinicAppointment[]>([]);
  const [receptionLoading, setReceptionLoading] = useState(true);
  
  useEffect(() => {
    const loadReceptionAppointments = async () => {
      try {
        const data = await getTodayReceptionAppointmentsAPI();
        setReceptionAppointments(data);
      } catch (error) {
        // Si falla, usar las citas normales filtradas por fecha
        console.warn('Error cargando citas de recepción, usando citas normales');
        setReceptionAppointments(appointments.filter((apt) => apt.date === today));
      } finally {
        setReceptionLoading(false);
      }
    };
    loadReceptionAppointments();
  }, [appointments, today]);

  const handleOpenDialog = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (selectedAppointment) {
      try {
        await updateReceptionStatus(selectedAppointment, receptionStatus, notes);
        setDialogOpen(false);
        setSelectedAppointment(null);
        setNotes("");
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }
    }
  };

  const getReceptionStatusColor = (status?: string) => {
    switch (status) {
      case "arrived":
        return "info";
      case "attended":
        return "success";
      case "not_arrived":
        return "error";
      default:
        return "default";
    }
  };

  const getReceptionStatusLabel = (status?: string) => {
    switch (status) {
      case "arrived":
        return "Llegó";
      case "attended":
        return "Atendido";
      case "not_arrived":
        return "No llegó";
      default:
        return "Pendiente";
    }
  };

  if (loading || receptionLoading) {
    return <Typography>Cargando citas del día...</Typography>;
  }

  // Usar citas de recepción si están disponibles, sino usar las citas normales
  const todayAppointments = receptionAppointments.length > 0 
    ? receptionAppointments 
    : appointments.filter((apt) => apt.date === today);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Recepción / Control Diario
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Citas del día: {today}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hora</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Estado de Recepción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todayAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No hay citas para hoy</Typography>
                </TableCell>
              </TableRow>
            ) : (
              todayAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>
                    {appointment.doctorName} - {appointment.doctorSpecialty}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getReceptionStatusLabel(appointment.receptionStatus)}
                      color={getReceptionStatusColor(appointment.receptionStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(appointment.id)}
                      title="Actualizar estado"
                    >
                      <Person />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Actualizar Estado de Recepción</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={receptionStatus}
              label="Estado"
              onChange={(e) => setReceptionStatus(e.target.value as any)}
            >
              <MenuItem value="arrived">Llegó</MenuItem>
              <MenuItem value="not_arrived">No llegó</MenuItem>
              <MenuItem value="attended">Atendido</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: "#14b8a6" }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
