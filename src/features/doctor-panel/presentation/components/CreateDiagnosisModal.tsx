import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import type { DoctorAppointment } from "../../domain/Appointment.entity";
import { createDiagnosisAPI } from "../../infrastructure/diagnoses.api";

interface CreateDiagnosisModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  doctorId: string;
  doctorName: string;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("El título es obligatorio"),
  description: Yup.string()
    .required("La descripción es obligatoria")
    .min(10, "Mínimo 10 caracteres"),
  prescription: Yup.string(),
  notes: Yup.string(),
});

export const CreateDiagnosisModal = ({
  open,
  onClose,
  appointment,
  doctorId,
  doctorName,
  onSuccess,
}: CreateDiagnosisModalProps) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      prescription: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!appointment) return;

      try {
        // --- CAMBIO 2: Llamada a la API Real ---
        const success = await createDiagnosisAPI(appointment.id, {
          title: values.title,
          description: values.description,
          prescription: values.prescription,
          notes: values.notes,
        });

        if (success) {
          resetForm();
          if (onSuccess) onSuccess();
          onClose();
        } else {
          alert("No se pudo guardar el diagnóstico");
        }
      } catch (error) {
        console.error("Error al crear diagnóstico:", error);
        alert("Error de conexión al guardar diagnóstico");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Resetear formulario cuando se cierra
  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open, formik]);

  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 10000 }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            Crear Diagnóstico Médico
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Paciente: {appointment.patientName} | Fecha: {appointment.date}
        </Typography>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* Título */}
            <TextField
              fullWidth
              label="Título / Motivo *"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              placeholder="Ej: Infección respiratoria aguda"
            />

            {/* Descripción */}
            <TextField
              fullWidth
              label="Descripción y Hallazgos *"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              multiline
              rows={4}
              placeholder="Describa los síntomas, evaluación física y diagnóstico..."
            />

            {/* Receta / Tratamiento */}
            <TextField
              fullWidth
              label="Receta / Plan de Tratamiento"
              name="prescription"
              value={formik.values.prescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={3}
              placeholder="Medicamentos, dosis y frecuencia..."
            />

            {/* Notas Adicionales */}
            <TextField
              fullWidth
              label="Notas Internas (Opcional)"
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={2}
              placeholder="Observaciones para seguimiento futuro..."
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={formik.isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Guardando..." : "Guardar Diagnóstico"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
