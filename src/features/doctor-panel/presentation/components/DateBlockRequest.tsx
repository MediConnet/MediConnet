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
} from "@mui/material";
import { Add, Block, CheckCircle, Cancel } from "@mui/icons-material";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDateBlockRequests } from "../hooks/useDateBlockRequests";
import { useClinicAssociatedDoctor } from "../hooks/useClinicAssociatedDoctor";
// Formateo de fechas sin date-fns

const validationSchema = Yup.object({
  startDate: Yup.string().required("La fecha de inicio es requerida"),
  endDate: Yup.string()
    .required("La fecha de fin es requerida")
    .test("is-after-start", "La fecha de fin debe ser posterior a la fecha de inicio", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
  reason: Yup.string()
    .required("El motivo es requerido")
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(200, "El motivo debe tener máximo 200 caracteres"),
});

export const DateBlockRequest = () => {
  const { clinicInfo } = useClinicAssociatedDoctor();
  const { requests, loading, submitting, requestBlock } = useDateBlockRequests(
    clinicInfo?.id || ""
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      reason: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await requestBlock(values.startDate, values.endDate, values.reason);
        formik.resetForm();
        setIsDialogOpen(false);
        alert("Solicitud de bloqueo enviada. Espera la aprobación de la clínica.");
      } catch (error) {
        console.error("Error solicitando bloqueo:", error);
        alert("Error al enviar la solicitud de bloqueo");
      }
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      default:
        return status;
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
      <Box>
        <Typography>Cargando información de la clínica...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Solicitar Bloqueos de Fecha
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Puedes solicitar bloqueos de fechas para vacaciones, congresos u otros motivos. 
        La clínica revisará y aprobará o rechazará tu solicitud.
      </Alert>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
        >
          Nueva Solicitud
        </Button>
      </Box>

      {loading ? (
        <Typography>Cargando solicitudes...</Typography>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              No hay solicitudes de bloqueo. Crea una nueva para solicitar días libres.
            </Typography>
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
              {requests.map((request) => (
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
                        request.status === "approved" ? (
                          <CheckCircle />
                        ) : request.status === "rejected" ? (
                          <Cancel />
                        ) : (
                          <Block />
                        )
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

      {/* Dialog para nueva solicitud */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Nueva Solicitud de Bloqueo</DialogTitle>
          <DialogContent>
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
