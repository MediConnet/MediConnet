import {
  Assignment,
  Close,
  Description,
  Edit,
  LocalPharmacy,
  Note,
  Save,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import type { DoctorAppointment } from "../../../domain/Appointment.entity";
import {
  createDiagnosisAPI,
  getDiagnosisByAppointmentAPI,
  type DiagnosisParams,
} from "../../../infrastructure/diagnoses.api";

interface CreateDiagnosisModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  diagnosis: Yup.string().required(
    "El diagnóstico es obligatorio (Ej: Faringitis)",
  ),
  treatment: Yup.string().required("El tratamiento es obligatorio"),
  indications: Yup.string().required("Las indicaciones son obligatorias"),
  observations: Yup.string(),
});

// Valores por defecto (vacíos)
const emptyValues: DiagnosisParams = {
  diagnosis: "",
  treatment: "",
  indications: "",
  observations: "",
};

export const CreateDiagnosisModal = ({
  open,
  onClose,
  appointment,
  onSuccess,
}: CreateDiagnosisModalProps) => {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] =
    useState<DiagnosisParams>(emptyValues);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!appointment) return;

      try {
        const success = await createDiagnosisAPI(appointment.id, values);

        if (success) {
          alert(
            isEditing
              ? "Diagnóstico actualizado correctamente"
              : "Diagnóstico creado correctamente",
          );
          resetForm();
          onSuccess();
          onClose();
        } else {
          alert("No se pudo guardar el diagnóstico");
        }
      } catch (error) {
        console.error("Error guardando diagnóstico:", error);
        alert("Error de conexión al guardar diagnóstico");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (open && appointment) {
      setIsLoadingData(true);

      // Consultamos si ya existe un diagnóstico
      getDiagnosisByAppointmentAPI(appointment.id)
        .then((existingData) => {
          if (existingData) {
            // SI EXISTE: Pre-llenamos el formulario
            setInitialValues({
              diagnosis: existingData.diagnosis,
              treatment: existingData.treatment || "",
              indications: existingData.indications || "",
              observations: existingData.observations || "",
            });
            setIsEditing(true);
          } else {
            // NO EXISTE: Formulario limpio
            setInitialValues(emptyValues);
            setIsEditing(false);
          }
        })
        .catch(() => {
          setInitialValues(emptyValues);
          setIsEditing(false);
        })
        .finally(() => {
          setIsLoadingData(false);
          formik.setErrors({});
          formik.setTouched({});
        });
    } else {
      // Si se cierra, limpiamos
      formik.resetForm();
      setInitialValues(emptyValues);
      setIsEditing(false);
    }
  }, [open, appointment]);

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
          <Typography
            variant="h6"
            fontWeight={700}
            display="flex"
            alignItems="center"
            gap={1}
          >
            {/* Cambiamos el icono y título según si es edición */}
            {isEditing ? (
              <Edit color="primary" />
            ) : (
              <Description color="primary" />
            )}
            {isEditing ? "Editar Historial Médico" : "Crear Historial Médico"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, ml: 4 }}
        >
          Paciente: <strong>{appointment.patientName}</strong> | Fecha:{" "}
          {appointment.date}
        </Typography>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          {isLoadingData ? (
            <Stack alignItems="center" justifyContent="center" py={5}>
              <CircularProgress size={40} />
              <Typography variant="caption" color="text.secondary" mt={2}>
                Cargando información del historial...
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Diagnóstico Principal *"
                name="diagnosis"
                value={formik.values.diagnosis}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.diagnosis && Boolean(formik.errors.diagnosis)
                }
                helperText={formik.touched.diagnosis && formik.errors.diagnosis}
                placeholder="Ej: Faringitis Aguda Bacteriana"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                label="Tratamiento / Medicación *"
                name="treatment"
                value={formik.values.treatment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.treatment && Boolean(formik.errors.treatment)
                }
                helperText={formik.touched.treatment && formik.errors.treatment}
                multiline
                rows={3}
                placeholder="Ej: Amoxicilina 500mg cada 8 horas por 7 días..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mt: 1 }}>
                        <LocalPharmacy color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { alignItems: "flex-start" },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Indicaciones y Cuidados *"
                name="indications"
                value={formik.values.indications}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.indications &&
                  Boolean(formik.errors.indications)
                }
                helperText={
                  formik.touched.indications && formik.errors.indications
                }
                multiline
                rows={3}
                placeholder="Ej: Reposo absoluto por 3 días, hidratación constante..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mt: 1 }}>
                        <Assignment color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { alignItems: "flex-start" },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Observaciones (Opcional)"
                name="observations"
                value={formik.values.observations}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline
                rows={2}
                placeholder="Notas adicionales para el historial clínico..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mt: 1 }}>
                        <Note color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { alignItems: "flex-start" },
                  },
                }}
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            disabled={formik.isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting || isLoadingData}
            startIcon={<Save />}
            sx={{ px: 4 }}
          >
            {formik.isSubmitting
              ? "Guardando..."
              : isEditing
                ? "Actualizar Historial"
                : "Guardar Historial"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
