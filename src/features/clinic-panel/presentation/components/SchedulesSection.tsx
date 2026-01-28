import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { ClinicSchedule, DaySchedule } from "../../domain/clinic.entity";
import { useClinicProfile } from "../hooks/useClinicProfile";

interface SchedulesSectionProps {
  clinicId: string;
}

const daysOfWeek = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
] as const;

export const SchedulesSection = ({ clinicId }: SchedulesSectionProps) => {
  const { profile, updateProfile } = useClinicProfile();
  const defaultSchedule: ClinicSchedule = {
    monday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    tuesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    wednesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    thursday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    friday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "18:00" },
  };
  const [schedule, setSchedule] = useState<ClinicSchedule>(profile?.generalSchedule || defaultSchedule);
  
  useEffect(() => {
    if (profile?.generalSchedule) {
      setSchedule(profile.generalSchedule);
    }
  }, [profile]);

  const handleDayChange = (day: keyof ClinicSchedule, field: keyof DaySchedule, value: any) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (profile) {
      await updateProfile({
        ...profile,
        generalSchedule: schedule,
      });
    }
  };

  if (!profile) {
    return <Typography>Cargando horarios...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Configuración de Horarios
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Horarios generales de la clínica
      </Typography>

      <Card>
        <CardContent>
          <Grid2 container spacing={3}>
            {daysOfWeek.map((day) => {
              const daySchedule = schedule[day.key];
              return (
                <Grid2 key={day.key} size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={daySchedule.enabled}
                          onChange={(e) => handleDayChange(day.key, "enabled", e.target.checked)}
                        />
                      }
                      label={day.label}
                      sx={{ minWidth: 100 }}
                    />
                    {daySchedule.enabled && (
                      <>
                        <TextField
                          type="time"
                          label="Inicio"
                          value={daySchedule.startTime}
                          onChange={(e) => handleDayChange(day.key, "startTime", e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          size="small"
                        />
                        <TextField
                          type="time"
                          label="Fin"
                          value={daySchedule.endTime}
                          onChange={(e) => handleDayChange(day.key, "endTime", e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          size="small"
                        />
                      </>
                    )}
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
            >
              Guardar Horarios
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Horarios de Médicos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Los horarios específicos de cada médico se configuran desde su perfil individual.
      </Typography>
    </Box>
  );
};
