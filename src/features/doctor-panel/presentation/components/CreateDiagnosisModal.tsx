import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { createDiagnosisMock } from "../../infrastructure/diagnoses.mock";
import type { Diagnosis } from "../../domain/Diagnosis.entity";
import type { DoctorAppointment } from "../../infrastructure/appointments.mock";

interface CreateDiagnosisModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  doctorId: string;
  doctorName: string;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  diagnosis: Yup.string()
    .required("El diagnóstico es obligatorio")
    .min(10, "El diagnóstico debe tener al menos 10 caracteres"),
  symptoms: Yup.string(),
  treatment: Yup.string(),
  medications: Yup.string(),
  observations: Yup.string(),
  recommendations: Yup.string(),
  nextAppointment: Yup.string(),
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
      diagnosis: "",
      symptoms: "",
      treatment: "",
      medications: "",
      observations: "",
      recommendations: "",
      nextAppointment: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!appointment) return;

      try {
        // Obtener el ID del paciente desde el nombre (mismo formato que en patients.mock)
        const patientId = appointment.patientName.toLowerCase().replace(/\s+/g, "-");
        
        const newDiagnosis = createDiagnosisMock({
          appointmentId: appointment.id,
          patientId: patientId,
          patientName: appointment.patientName,
          doctorId,
          doctorName,
          date: appointment.date,
          diagnosis: values.diagnosis,
          symptoms: values.symptoms || undefined,
          treatment: values.treatment || undefined,
          medications: values.medications || undefined,
          observations: values.observations || undefined,
          recommendations: values.recommendations || undefined,
          nextAppointment: values.nextAppointment || undefined,
        });

        formik.resetForm();
        
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
      } catch (error) {
        console.error("Error al crear diagnóstico:", error);
      }
    },
  });

  // Resetear formulario cuando se abre/cierra el modal o cambia la cita
  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open, appointment?.id]);

  if (!appointment) return null;

  // Usar useEffect para forzar el z-index después de que el modal se monte
  useEffect(() => {
    if (open) {
      // Buscar el elemento del modal de MUI y forzar el z-index
      const modalRoot = document.querySelector('.MuiModal-root[style*="z-index"]');
      const backdrop = document.querySelector('.MuiBackdrop-root');
      const dialogContainer = document.querySelector('.MuiDialog-container');
      const dialogPaper = document.querySelector('.MuiDialog-paper');
      
      if (modalRoot) {
        (modalRoot as HTMLElement).style.zIndex = '10000';
      }
      if (backdrop) {
        (backdrop as HTMLElement).style.zIndex = '10000';
      }
      if (dialogContainer) {
        (dialogContainer as HTMLElement).style.zIndex = '10001';
      }
      if (dialogPaper) {
        (dialogPaper as HTMLElement).style.zIndex = '10001';
      }
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      disablePortal={false}
      sx={{
        // Forzar z-index muy alto para estar por encima del modal de cita (z-index 9999)
        zIndex: "10000 !important",
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          zIndex: "10000 !important",
        },
        "& .MuiDialog-container": {
          zIndex: "10001 !important",
        },
        "& .MuiDialog-paper": {
          zIndex: "10001 !important",
          margin: "24px",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            zIndex: "10000 !important",
          },
        },
      }}
      PaperProps={{
        sx: {
          zIndex: "10001 !important",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Crear Diagnóstico
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Paciente: {appointment.patientName} | Fecha: {new Date(appointment.date).toLocaleDateString("es-ES")}
        </Typography>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Diagnóstico Principal *"
              name="diagnosis"
              value={formik.values.diagnosis}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.diagnosis && Boolean(formik.errors.diagnosis)}
              helperText={formik.touched.diagnosis && formik.errors.diagnosis}
              multiline
              rows={3}
              placeholder="Ej: Hipertensión arterial leve, controlada con medicación"
            />

            <TextField
              fullWidth
              label="Síntomas Presentados"
              name="symptoms"
              value={formik.values.symptoms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.symptoms && Boolean(formik.errors.symptoms)}
              helperText={formik.touched.symptoms && formik.errors.symptoms}
              multiline
              rows={2}
              placeholder="Ej: Dolor de cabeza, mareos ocasionales"
            />

            <TextField
              fullWidth
              label="Tratamiento Prescrito"
              name="treatment"
              value={formik.values.treatment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.treatment && Boolean(formik.errors.treatment)}
              helperText={formik.touched.treatment && formik.errors.treatment}
              multiline
              rows={2}
              placeholder="Ej: Control de presión arterial, dieta baja en sodio"
            />

            <TextField
              fullWidth
              label="Medicamentos Recetados"
              name="medications"
              value={formik.values.medications}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.medications && Boolean(formik.errors.medications)}
              helperText={formik.touched.medications && formik.errors.medications}
              multiline
              rows={2}
              placeholder="Ej: Losartan 50mg, 1 tableta diaria en la mañana"
            />

            <TextField
              fullWidth
              label="Observaciones Adicionales"
              name="observations"
              value={formik.values.observations}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.observations && Boolean(formik.errors.observations)}
              helperText={formik.touched.observations && formik.errors.observations}
              multiline
              rows={3}
              placeholder="Ej: Paciente responde bien al tratamiento, presión arterial estable"
            />

            <TextField
              fullWidth
              label="Recomendaciones"
              name="recommendations"
              value={formik.values.recommendations}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.recommendations && Boolean(formik.errors.recommendations)}
              helperText={formik.touched.recommendations && formik.errors.recommendations}
              multiline
              rows={2}
              placeholder="Ej: Realizar ejercicio moderado, evitar alimentos procesados"
            />

            <TextField
              fullWidth
              label="Próxima Cita (Opcional)"
              name="nextAppointment"
              type="date"
              value={formik.values.nextAppointment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nextAppointment && Boolean(formik.errors.nextAppointment)}
              helperText={formik.touched.nextAppointment && formik.errors.nextAppointment}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar Diagnóstico
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

