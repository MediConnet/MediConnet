import { AccessTime, Close, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import type { WorkSchedule } from "../../domain/LaboratoryDashboard.entity";

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedule: WorkSchedule[];
  onSave: (schedule: WorkSchedule[]) => void;
}

const DAYS_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

const DEFAULT_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const EditScheduleModal = ({
  open,
  onClose,
  schedule,
  onSave,
}: EditScheduleModalProps) => {
  const [formData, setFormData] = useState<WorkSchedule[]>([]);

  useEffect(() => {
    if (schedule && schedule.length > 0) {
      setFormData([...schedule]);
    } else {
      // Inicializar con días por defecto
      setFormData(
        DEFAULT_DAYS.map((day) => ({
          day,
          isOpen: false,
          startTime: "09:00",
          endTime: "18:00",
        }))
      );
    }
  }, [schedule, open]);

  const handleChange = (
    day: string,
    field: keyof WorkSchedule,
    value: boolean | string
  ) => {
    setFormData((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #eee"
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700 }}>
          Editar Horarios de Atención
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formData.map((item) => (
            <Box
              key={item.day}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
              }}
            >
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.isOpen}
                        onChange={(e) =>
                          handleChange(item.day, "isOpen", e.target.checked)
                        }
                      />
                    }
                    label={
                      <Typography fontWeight={600}>
                        {DAYS_LABELS[item.day] || item.day}
                      </Typography>
                    }
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Hora de Apertura"
                    type="time"
                    value={item.startTime}
                    onChange={(e) =>
                      handleChange(item.day, "startTime", e.target.value)
                    }
                    disabled={!item.isOpen}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <AccessTime sx={{ color: "text.secondary", mr: 1 }} />
                      ),
                    }}
                    slotProps={{
                      htmlInput: { step: 1800 }
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Hora de Cierre"
                    type="time"
                    value={item.endTime}
                    onChange={(e) =>
                      handleChange(item.day, "endTime", e.target.value)
                    }
                    disabled={!item.isOpen}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <AccessTime sx={{ color: "text.secondary", mr: 1 }} />
                      ),
                    }}
                    slotProps={{
                      htmlInput: { step: 1800 }
                    }}
                  />
                </Grid2>
              </Grid2>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Guardar Horarios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

