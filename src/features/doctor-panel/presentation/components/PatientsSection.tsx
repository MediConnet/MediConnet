import { Person, Phone, Email } from "@mui/icons-material";
import {
  Box,
  Chip,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import { useState, useEffect } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { getPatientsMock } from "../../infrastructure/patients.mock";
import type { Patient } from "../../domain/Patient.entity";

export const PatientsSection = () => {
  const [patients, setPatients] = useState<Patient[]>(getPatientsMock());
  const [searchText, setSearchText] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Actualizar pacientes cuando cambien las citas en localStorage
  useEffect(() => {
    const updatePatients = () => {
      setPatients(getPatientsMock());
    };

    // Escuchar el evento personalizado de actualización de citas
    const handleAppointmentsUpdate = () => {
      updatePatients();
    };

    // Escuchar cambios en localStorage (para cambios desde otras pestañas)
    const handleStorageChange = () => {
      updatePatients();
    };

    window.addEventListener("appointments-updated", handleAppointmentsUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("appointments-updated", handleAppointmentsUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
    patient.phone.includes(searchText) ||
    patient.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleRow = (patientId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "no-show":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Atendida";
      case "cancelled":
        return "Cancelada";
      case "no-show":
        return "No asistió";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pacientes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Base automática de pacientes generada por citas
          </p>
        </div>
      </div>

      {/* Buscador */}
      <TextField
        fullWidth
        placeholder="Buscar por nombre, teléfono o email..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />

      {/* Tabla de pacientes */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600 }}>Paciente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Total Citas
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Última Cita
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No se encontraron pacientes
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => {
                const isExpanded = expandedRows.has(patient.id);
                const lastAppointment = patient.appointments[patient.appointments.length - 1];

                return (
                  <>
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person sx={{ color: "#14b8a6" }} />
                          <Typography fontWeight={600}>{patient.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Phone sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="body2">{patient.phone}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Email sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {patient.email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={patient.appointments.length}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {lastAppointment ? (
                          <Stack spacing={0.5} alignItems="center">
                            <Typography variant="body2">
                              {new Date(lastAppointment.date).toLocaleDateString("es-ES")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lastAppointment.time}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(patient.id)}
                        >
                          {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={5}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                              Historial de Citas
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Hora</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Motivo</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }} align="center">
                                    Estado
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }} align="center">
                                    Pago
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {patient.appointments.map((appointment) => (
                                  <TableRow key={appointment.id}>
                                    <TableCell>
                                      {new Date(appointment.date).toLocaleDateString("es-ES")}
                                    </TableCell>
                                    <TableCell>{appointment.time}</TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        label={getStatusLabel(appointment.status)}
                                        color={getStatusColor(appointment.status) as any}
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Stack spacing={0.5} alignItems="center">
                                        <Chip
                                          label={appointment.paymentMethod === "card" ? "Tarjeta" : "Efectivo"}
                                          size="small"
                                          variant="outlined"
                                        />
                                        {appointment.amount && (
                                          <Typography variant="caption" color="text.secondary">
                                            ${appointment.amount}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumen */}
      <Box mt={3} p={2} bgcolor="#f0fdfa" borderRadius={2}>
        <Typography variant="body2" color="text.secondary">
          Total de pacientes: <strong>{filteredPatients.length}</strong>
        </Typography>
      </Box>
    </div>
  );
};

