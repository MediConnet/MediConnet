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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useState } from "react";
import { useClinicAppointments } from "../hooks/useClinicAppointments";
import { useClinicDoctors } from "../hooks/useClinicDoctors";
import type { AppointmentStatus } from "../../domain/appointment.entity";

interface AppointmentsSectionProps {
  clinicId: string;
}

const statusColors: Record<AppointmentStatus, "default" | "primary" | "success" | "error" | "warning"> = {
  scheduled: "default",
  confirmed: "primary",
  attended: "success",
  cancelled: "error",
  no_show: "warning",
};

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  attended: "Atendida",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

export const AppointmentsSection = ({ clinicId }: AppointmentsSectionProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const { appointments, loading } = useClinicAppointments(clinicId, selectedDate, selectedDoctorId || undefined);
  const { doctors } = useClinicDoctors(clinicId);

  if (loading) {
    return <Typography>Cargando citas...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Agenda Centralizada
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          type="date"
          label="Fecha"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Médico</InputLabel>
          <Select
            value={selectedDoctorId}
            label="Filtrar por Médico"
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <MenuItem value="">Todos los médicos</MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hora</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No hay citas para esta fecha</Typography>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.doctorSpecialty}</TableCell>
                  <TableCell>{appointment.reason || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[appointment.status]}
                      color={statusColors[appointment.status]}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
