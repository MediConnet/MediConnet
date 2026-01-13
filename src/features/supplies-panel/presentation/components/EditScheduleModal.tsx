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
import type { SupplyDashboard, WorkSchedule } from "../../domain/SupplyDashboard.entity";

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  data: SupplyDashboard;
  onSave: (updatedData: SupplyDashboard) => void;
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
  data,
  onSave,
}: EditScheduleModalProps) => {
  const [formData, setFormData] = useState<WorkSchedule[]>([]);

  useEffect(() => {
    if (data.supply.workSchedule && data.supply.workSchedule.length > 0) {
      setFormData([...data.supply.workSchedule]);
    } else {
      // Inicializar con días por defecto
      setFormData(
        DEFAULT_DAYS.map((day) => ({
          day,
          enabled: day !== "saturday" && day !== "sunday",
          startTime: "08:00",
          endTime: "18:00",
        }))
      );
    }
  }, [data, open]);

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

  // Función para generar el texto del horario
  const getDynamicScheduleText = (schedule: WorkSchedule[]) => {
    const activeDays = schedule.filter((s) => s.enabled);
    if (activeDays.length === 0) return "Cerrado temporalmente";

    const dayMap: Record<string, string> = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom",
    };

    const startDay = dayMap[activeDays[0].day];
    const endDay = dayMap[activeDays[activeDays.length - 1].day];
    const startTime = activeDays[0].startTime;
    const endTime = activeDays[0].endTime;

    if (activeDays.length === 1) {
      return `${startDay} ${startTime}-${endTime}`;
    }

    return `${startDay}-${endDay} ${startTime}-${endTime}`;
  };

  const handleSave = () => {
    const scheduleString = getDynamicScheduleText(formData);
    const updatedData: SupplyDashboard = {
      ...data,
      supply: {
        ...data.supply,
        workSchedule: formData,
        schedule: scheduleString,
      },
    };
    onSave(updatedData);
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
        <Stack spacing={3} sx={{ mt: 1 }}>
          {formData.map((daySchedule) => (
            <Box
              key={daySchedule.day}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: daySchedule.enabled ? "grey.50" : "grey.100",
              }}
            >
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={daySchedule.enabled}
                        onChange={(e) =>
                          handleChange(daySchedule.day, "enabled", e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label={
                      <Typography fontWeight={600}>
                        {DAYS_LABELS[daySchedule.day] || daySchedule.day}
                      </Typography>
                    }
                  />
                </Grid2>
                {daySchedule.enabled && (
                  <>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Hora de Inicio"
                        value={daySchedule.startTime}
                        onChange={(e) =>
                          handleChange(daySchedule.day, "startTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <AccessTime sx={{ color: "text.secondary", mr: 1 }} />
                          ),
                        }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Hora de Fin"
                        value={daySchedule.endTime}
                        onChange={(e) =>
                          handleChange(daySchedule.day, "endTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <AccessTime sx={{ color: "text.secondary", mr: 1 }} />
                          ),
                        }}
                      />
                    </Grid2>
                  </>
                )}
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
            bgcolor: "#f97316",
            "&:hover": {
              bgcolor: "#ea580c",
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

