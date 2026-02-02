import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Email, Link, Edit, ToggleOn, ToggleOff, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useClinicDoctors } from "../hooks/useClinicDoctors";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateInvitationLinkAPI } from "../../infrastructure/clinic-doctors.api";
import { clearClinicMocks } from "../../infrastructure/clear-clinic-mocks";


interface DoctorsSectionProps {
  clinicId: string;
}

const inviteValidationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("El email es requerido"),
});

export const DoctorsSection = ({ clinicId }: DoctorsSectionProps) => {
  const { doctors, loading, inviteDoctor, toggleStatus, assignOffice, deleteDoctor } = useClinicDoctors(clinicId);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [assignOfficeDialogOpen, setAssignOfficeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name?: string; email: string } | null>(null);

  // ⭐ Limpiar mocks al cargar el componente (solo una vez)
  useEffect(() => {
    clearClinicMocks();
  }, []);

  const inviteFormik = useFormik({
    initialValues: { 
      email: ""
    },
    validationSchema: inviteValidationSchema,
    onSubmit: async (values) => {
      try {
        await inviteDoctor(values.email);
        setInviteDialogOpen(false);
        inviteFormik.resetForm();
        alert("Médico invitado correctamente");
      } catch (error) {
        console.error("Error al invitar médico:", error);
        alert("Error al invitar médico. Intenta nuevamente.");
      }
    },
  });

  const officeFormik = useFormik({
    initialValues: { officeNumber: "" },
    onSubmit: async (values) => {
      if (selectedDoctor) {
        try {
          await assignOffice(selectedDoctor, values.officeNumber);
          setAssignOfficeDialogOpen(false);
          officeFormik.resetForm();
          setSelectedDoctor(null);
        } catch (error) {
          console.error("Error al asignar consultorio:", error);
        }
      }
    },
  });

  const handleInviteByEmail = () => {
    setInviteDialogOpen(true);
  };

  const handleInviteByLink = async () => {
    try {
      // Obtener email del formulario de invitación si está abierto
      const email = inviteFormik.values.email || prompt("Ingresa el email del médico:");
      if (!email) return;
      
      const result = await generateInvitationLinkAPI(email);
      navigator.clipboard.writeText(result.invitationLink);
      alert(`Link de invitación copiado al portapapeles. Expira el ${new Date(result.expiresAt).toLocaleDateString()}`);
    } catch (error) {
      console.error("Error generando link de invitación:", error);
      alert("Error al generar el link de invitación");
    }
  };

  const handleAssignOffice = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setAssignOfficeDialogOpen(true);
  };

  const handleDeleteDoctor = (doctor: { id: string; name?: string; email: string }) => {
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (doctorToDelete) {
      try {
        await deleteDoctor(doctorToDelete.id);
        setDeleteDialogOpen(false);
        setDoctorToDelete(null);
        alert("Médico eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar médico:", error);
        alert("Error al eliminar médico. Intenta nuevamente.");
      }
    }
  };

  if (loading) {
    return <Typography>Cargando médicos...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Gestión de Médicos
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Link />}
            onClick={handleInviteByLink}
            sx={{ borderColor: "#14b8a6", color: "#14b8a6" }}
          >
            Invitar por Link
          </Button>
          <Button
            variant="contained"
            startIcon={<Email />}
            onClick={handleInviteByEmail}
            sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
          >
            Invitar por Email
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Consultorio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay médicos registrados. Invita médicos usando los botones de arriba.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name || "Sin nombre"}</TableCell>
                  <TableCell>{doctor.specialty || "Sin especialidad"}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.officeNumber || "Sin asignar"}</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.isActive ? "Activo" : "Inactivo"}
                      color={doctor.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => toggleStatus(doctor.id)}
                        title={doctor.isActive ? "Desactivar" : "Activar"}
                      >
                        {doctor.isActive ? <ToggleOn color="success" /> : <ToggleOff />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleAssignOffice(doctor.id)}
                        title="Asignar consultorio"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDoctor(doctor)}
                        title="Eliminar médico"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Invitar por Email */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={inviteFormik.handleSubmit}>
          <DialogTitle>Invitar Médico por Email</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email del médico *"
              name="email"
              type="email"
              value={inviteFormik.values.email}
              onChange={inviteFormik.handleChange}
              error={inviteFormik.touched.email && Boolean(inviteFormik.errors.email)}
              helperText={inviteFormik.touched.email && inviteFormik.errors.email || "El médico completará su nombre y especialidad al aceptar la invitación"}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInviteDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#14b8a6" }}>
              Enviar Invitación
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Asignar Consultorio */}
      <Dialog open={assignOfficeDialogOpen} onClose={() => setAssignOfficeDialogOpen(false)}>
        <form onSubmit={officeFormik.handleSubmit}>
          <DialogTitle>Asignar Consultorio</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Número de Consultorio"
              name="officeNumber"
              value={officeFormik.values.officeNumber}
              onChange={officeFormik.handleChange}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignOfficeDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#14b8a6" }}>
              Asignar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Confirmar Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>{doctorToDelete?.name || doctorToDelete?.email}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
