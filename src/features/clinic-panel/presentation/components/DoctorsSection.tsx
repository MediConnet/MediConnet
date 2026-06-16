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
import { Email, Edit, ToggleOn, ToggleOff, Delete, Visibility, Schedule } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useClinicDoctors } from "../hooks/useClinicDoctors";
import { useFormik } from "formik";
import * as Yup from "yup";
import { clearClinicMocks } from "../../infrastructure/clear-clinic-mocks";
import { DoctorProfileViewModal } from "./DoctorProfileViewModal";
import { DoctorScheduleModal } from "./DoctorScheduleModal";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import type { ClinicDoctor } from "../../domain/doctor.entity";


interface DoctorsSectionProps {
  clinicId: string;
}

const inviteValidationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("El email es requerido"),
});

export const DoctorsSection = ({ clinicId }: DoctorsSectionProps) => {
  const { doctors, loading, inviteDoctor, toggleStatus, assignOffice, deleteDoctor, updateConsultationFee } = useClinicDoctors(clinicId);
  const feedback = useFeedbackStore();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [assignOfficeDialogOpen, setAssignOfficeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name?: string; email: string } | null>(null);
  const [profileViewOpen, setProfileViewOpen] = useState(false);
  const [selectedDoctorForView, setSelectedDoctorForView] = useState<ClinicDoctor | null>(null);
  const [doctorEmail, setDoctorEmail] = useState<string>("");
  const [isInviting, setIsInviting] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    clearClinicMocks();
  }, []);

  const officeFormik = useFormik({
    initialValues: { officeNumber: "" },
    onSubmit: async (values) => {
      if (selectedDoctor) {
        try {
          await assignOffice(selectedDoctor, values.officeNumber);
          feedback.showFeedback('success', 'Operación completada', 'La información se guardó correctamente.');
          setAssignOfficeDialogOpen(false);
          officeFormik.resetForm();
          setSelectedDoctor(null);
        } catch {
          feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
        }
      }
    },
  });

  const priceFormik = useFormik({
    initialValues: { consultationFee: "" },
    onSubmit: async (values) => {
      if (selectedDoctor) {
        try {
          const fee = parseFloat(values.consultationFee);
          if (isNaN(fee) || fee < 0) {
            feedback.showFeedback('error', 'Error', 'Por favor ingresa un precio válido');
            return;
          }

          await updateConsultationFee(selectedDoctor, fee);
          feedback.showFeedback('success', 'Operación completada', 'La información se guardó correctamente.');
          setPriceDialogOpen(false);
          priceFormik.resetForm();
          setSelectedDoctor(null);
        } catch {
          feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
        }
      }
    },
  });

  const handleToggleStatus = async (doctor: ClinicDoctor) => {
    try {
      await toggleStatus(doctor.id, !doctor.isActive);
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
    } catch {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    }
  };

  const handleInviteByEmail = () => {
    setInviteDialogOpen(true);
    setDoctorEmail("");
  };

  const handleSendInvitation = async () => {
    if (!doctorEmail || !inviteValidationSchema.isValidSync({ email: doctorEmail })) {
      feedback.showFeedback('error', 'Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsInviting(true);
    try {
      await inviteDoctor(doctorEmail);

      setInviteDialogOpen(false);
      setDoctorEmail("");

      feedback.showFeedback('success', 'Operación completada', 'La invitación ha sido enviada exitosamente.');
    } catch (err: any) {
      const message = err?.message || 'No fue posible completar la operación.';
      feedback.showFeedback('error', 'Error', message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleAssignOffice = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setAssignOfficeDialogOpen(true);
  };

  const handleUpdatePrice = (doctorId: string, currentPrice?: number) => {
    setSelectedDoctor(doctorId);
    priceFormik.setFieldValue('consultationFee', currentPrice?.toString() || '');
    setPriceDialogOpen(true);
  };

  const handleDeleteDoctor = (doctor: { id: string; name?: string; email: string }) => {
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (doctorToDelete) {
      try {
        await deleteDoctor(doctorToDelete.id);
        feedback.showFeedback('success', 'Registro eliminado', 'La acción se completó correctamente.');
        setDeleteDialogOpen(false);
        setDoctorToDelete(null);
      } catch {
        feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
      }
    }
  };

  const handleViewProfile = (doctor: ClinicDoctor) => {
    setSelectedDoctorForView(doctor);
    setProfileViewOpen(true);
  };

  const handleOpenSchedule = (doctor: ClinicDoctor) => {
    setSelectedDoctorForSchedule({ id: doctor.id, name: doctor.name || doctor.email });
    setScheduleModalOpen(true);
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
        <Button
          variant="contained"
          startIcon={<Email />}
          onClick={handleInviteByEmail}
          sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
        >
          Invitar por Email
        </Button>
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
                        onClick={() => handleViewProfile(doctor)}
                        title="Ver perfil completo"
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenSchedule(doctor)}
                        title="Configurar horario"
                      >
                        <Schedule />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleStatus(doctor)}
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

      {/* Dialog Invitar por Email - VERSIÓN SIMPLIFICADA */}
      <Dialog open={inviteDialogOpen} onClose={() => {
        setInviteDialogOpen(false);
        setDoctorEmail("");
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Invitar Médico por Email</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ingresa el email del médico. Se enviará un correo con la invitación automáticamente.
          </Typography>
          <TextField
            fullWidth
            label="Email del médico *"
            type="email"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
            error={doctorEmail !== "" && !inviteValidationSchema.isValidSync({ email: doctorEmail })}
            helperText={
              doctorEmail !== "" && !inviteValidationSchema.isValidSync({ email: doctorEmail })
                ? "Email inválido"
                : "Se enviará un link de acceso único para que el médico se registre o asocie."
            }
            sx={{ mt: 1 }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && doctorEmail && inviteValidationSchema.isValidSync({ email: doctorEmail })) {
                handleSendInvitation();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setInviteDialogOpen(false);
            setDoctorEmail("");
          }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSendInvitation}
            disabled={isInviting || !doctorEmail || !inviteValidationSchema.isValidSync({ email: doctorEmail })}
            sx={{ backgroundColor: "#14b8a6" }}
            startIcon={<Email />}
          >
            {isInviting ? "Enviando..." : "Enviar Invitación"}
          </Button>
        </DialogActions>
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

      {/* Dialog Actualizar Precio de Consulta */}
      <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)}>
        <form onSubmit={priceFormik.handleSubmit}>
          <DialogTitle>Establecer Precio de Consulta</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Este precio será el que los pacientes pagarán por las consultas con este médico en tu clínica.
            </Typography>
            <TextField
              fullWidth
              label="Precio de Consulta ($)"
              name="consultationFee"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={priceFormik.values.consultationFee}
              onChange={priceFormik.handleChange}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPriceDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#14b8a6" }}>
              Guardar Precio
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Ver Perfil del Médico */}
      <DoctorProfileViewModal
        open={profileViewOpen}
        onClose={() => {
          setProfileViewOpen(false);
          setSelectedDoctorForView(null);
        }}
        doctor={selectedDoctorForView}
      />

      {/* Modal Configurar Horario del Médico */}
      {selectedDoctorForSchedule && (
        <DoctorScheduleModal
          open={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false);
            setSelectedDoctorForSchedule(null);
          }}
          doctorId={selectedDoctorForSchedule.id}
          doctorName={selectedDoctorForSchedule.name}
        />
      )}
    </Box>
  );
};
