import {
  Email,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Person,
  Phone,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CustomAvatar } from "../../../../shared/components/CustomAvatar";
import { usePatients } from "../hooks/usePatients";

export const PatientsSection = () => {
  const {
    patients,
    loading,
    page,
    totalPages,
    totalPatients,
    search,
    setPage,
    setSearch,
  } = usePatients();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Atendida";
      case "CANCELLED":
        return "Cancelada";
      case "PENDING":
        return "Pendiente";
      case "CONFIRMED":
        return "Confirmada";
      default:
        return status;
    }
  };

  const getPaymentLabel = (method: string) => {
    if (method === "CARD") return "Tarjeta";
    if (method === "CASH") return "Efectivo";
    return "Desconocido";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pacientes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Historial de pacientes atendidos y sus citas
          </p>
        </div>
      </div>

      {/* Buscador */}
      <TextField
        fullWidth
        placeholder="Buscar por nombre, teléfono o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Tabla de pacientes */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e5e7eb" }}
      >
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Cargando pacientes...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No se encontraron pacientes
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => {
                const isExpanded = expandedRows.has(patient.id);
                const lastApptDate = patient.lastAppointmentDate
                  ? new Date(patient.lastAppointmentDate).toLocaleDateString(
                      "es-ES",
                    )
                  : "-";

                return (
                  <div key={patient.id} style={{ display: "contents" }}>
                    <TableRow hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CustomAvatar
                            name={patient.name}
                            src={patient.profilePicture}
                            size={32}
                          />

                          <Typography fontWeight={600}>
                            {patient.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Phone
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {patient.phone}
                            </Typography>
                          </Stack>
                          {patient.email && (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Email
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {patient.email}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            patient.totalAppointments ||
                            patient.appointments.length
                          }
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{lastApptDate}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(patient.id)}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Fila Colapsable: Historial de Citas */}
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={5}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box
                            sx={{
                              margin: 2,
                              bgcolor: "#f8fafc",
                              borderRadius: 2,
                              p: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{ color: "#64748b", fontWeight: 700 }}
                            >
                              Historial de Citas
                            </Typography>
                            {patient.appointments.length > 0 ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Fecha
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Hora
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Motivo
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: 600 }}
                                      align="center"
                                    >
                                      Estado
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: 600 }}
                                      align="center"
                                    >
                                      Pago
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {patient.appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                      <TableCell>
                                        {new Date(
                                          appointment.date,
                                        ).toLocaleDateString("es-ES")}
                                      </TableCell>
                                      <TableCell>{appointment.time}</TableCell>
                                      <TableCell>
                                        {appointment.reason}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Chip
                                          label={getStatusLabel(
                                            appointment.status,
                                          )}
                                          color={
                                            getStatusColor(
                                              appointment.status,
                                            ) as any
                                          }
                                          size="small"
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Stack
                                          spacing={0.5}
                                          alignItems="center"
                                        >
                                          <Chip
                                            label={getPaymentLabel(
                                              appointment.paymentMethod,
                                            )}
                                            size="small"
                                            variant="filled"
                                            sx={{
                                              height: 20,
                                              fontSize: "0.7rem",
                                            }}
                                          />
                                          {appointment.amount !== undefined && (
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              $
                                              {Number(
                                                appointment.amount,
                                              ).toFixed(2)}
                                            </Typography>
                                          )}
                                        </Stack>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ py: 2, textAlign: "center" }}
                              >
                                No hay historial disponible.
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </div>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pie de página: Resumen y Paginación */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
        <Box
          p={1.5}
          bgcolor="#f0fdfa"
          borderRadius={2}
          border="1px solid #ccfbf1"
        >
          <Typography variant="body2" color="text.secondary">
            Total pacientes encontrados: <strong>{totalPatients}</strong>
          </Typography>
        </Box>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
          disabled={loading}
        />
      </div>
    </div>
  );
};
