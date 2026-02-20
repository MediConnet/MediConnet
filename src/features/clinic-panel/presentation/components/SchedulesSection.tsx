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
  Alert,
  Snackbar,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { ClinicSchedule, DaySchedule } from "../../domain/clinic.entity";
import { useClinicProfile } from "../hooks/useClinicProfile";
import { updateClinicScheduleAPI } from "../../infrastructure/clinic.api";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";

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
  const { profile, loading: profileLoading } = useClinicProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const defaultSchedule: ClinicSchedule = {
    monday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    tuesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    wednesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    thursday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    friday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "18:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "18:00" },
  };

  // ⭐ Función para normalizar el schedule y asegurar que todos los días existan
  const normalizeSchedule = (schedule: any): ClinicSchedule => {
    if (!schedule || typeof schedule !== 'object') {
      return defaultSchedule;
    }

    // Si viene como array, convertir a objeto
    if (Array.isArray(schedule)) {
      const normalized: ClinicSchedule = { ...defaultSchedule };
      schedule.forEach((item: any) => {
        const dayKey = item.day?.toLowerCase() || item.dayOfWeek;
        if (dayKey && normalized[dayKey as keyof ClinicSchedule]) {
          normalized[dayKey as keyof ClinicSchedule] = {
            enabled: item.enabled ?? item.is_active ?? false,
            startTime: item.startTime || item.start_time || "09:00",
            endTime: item.endTime || item.end_time || "18:00",
          } as any;
        }
      });
      return normalized;
    }

    // Si viene como objeto, asegurar que todos los días existan
    const normalized: ClinicSchedule = { ...defaultSchedule };
    const dayKeys: (keyof ClinicSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
      dayKeys.forEach((dayKey) => {
      const dayData = schedule[dayKey];
      if (dayData && typeof dayData === 'object') {
        normalized[dayKey] = {
          enabled: dayData.enabled ?? dayData.is_active ?? false,
          startTime: dayData.startTime || dayData.start_time || "09:00",
          endTime: dayData.endTime || dayData.end_time || "18:00",
        } as any;
      }
    });

    return normalized;
  };

  const [schedule, setSchedule] = useState<ClinicSchedule>(defaultSchedule);
  
  useEffect(() => {
    if (profile?.generalSchedule) {
      const normalized = normalizeSchedule(profile.generalSchedule);
      setSchedule(normalized);
    } else {
      setSchedule(defaultSchedule);
    }
    // Cuando carga nuevo perfil, salir del modo edición
    setIsEditing(false);
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

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    // Restaurar valores originales del perfil
    if (profile?.generalSchedule) {
      const normalized = normalizeSchedule(profile.generalSchedule);
      setSchedule(normalized);
    } else {
      setSchedule(defaultSchedule);
    }
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Llamar al endpoint específico de horarios
      const updatedSchedule = await updateClinicScheduleAPI(schedule);
      
      // Actualizar el estado local con la respuesta del servidor
      setSchedule(updatedSchedule);
      setIsEditing(false);
      setSuccessMessage('Horarios guardados correctamente');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar horarios');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return <LoadingSpinner text="Cargando horarios..." />;
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
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}
          
          <Grid2 container spacing={3}>
            {daysOfWeek.map((day) => {
              // ⭐ Validación segura: asegurar que daySchedule siempre existe
              const daySchedule = schedule[day.key] || {
                enabled: false,
                startTime: "09:00",
                endTime: "18:00",
              };
              
              // Validación adicional de propiedades
              const safeDaySchedule: DaySchedule = {
                enabled: Boolean(daySchedule?.enabled ?? false),
                startTime: daySchedule?.startTime || "09:00",
                endTime: daySchedule?.endTime || "18:00",
              };

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
                          checked={safeDaySchedule.enabled}
                          onChange={(e) => handleDayChange(day.key, "enabled", e.target.checked)}
                          disabled={!isEditing}
                        />
                      }
                      label={day.label}
                      sx={{ minWidth: 100 }}
                    />
                    {safeDaySchedule.enabled && (
                      <>
                        <TextField
                          type="time"
                          label="Inicio"
                          value={safeDaySchedule.startTime}
                          onChange={(e) => handleDayChange(day.key, "startTime", e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          size="small"
                          disabled={!isEditing}
                          slotProps={{
                            htmlInput: { step: 1800 }
                          }}
                        />
                        <TextField
                          type="time"
                          label="Fin"
                          value={safeDaySchedule.endTime}
                          onChange={(e) => handleDayChange(day.key, "endTime", e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          size="small"
                          disabled={!isEditing}
                          slotProps={{
                            htmlInput: { step: 1800 }
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                onClick={handleEdit}
                sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
              >
                Editar Horarios
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ backgroundColor: "#14b8a6", "&:hover": { backgroundColor: "#0d9488" } }}
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body2" color="info.main" sx={{ mt: 3, p: 2, bgcolor: '#eff6ff', borderRadius: 1 }}>
        ℹ️ Los médicos asociados a esta clínica trabajarán según estos horarios generales.
      </Typography>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
