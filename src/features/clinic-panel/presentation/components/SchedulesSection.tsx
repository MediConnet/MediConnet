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
import { Save, Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { ClinicSchedule, DaySchedule } from "../../domain/clinic.entity";
import { useClinicProfile } from "../hooks/useClinicProfile";
import { useClinicDoctors } from "../hooks/useClinicDoctors";
import { useDoctorSchedule } from "../hooks/useDoctorSchedule";
import type { ClinicDoctor } from "../../domain/doctor.entity";
import type { DoctorSchedule } from "../../domain/doctor-schedule.entity";

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
          };
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
        };
      }
    });

    return normalized;
  };

  const [schedule, setSchedule] = useState<ClinicSchedule>(
    profile?.generalSchedule ? normalizeSchedule(profile.generalSchedule) : defaultSchedule
  );
  
  useEffect(() => {
    if (profile?.generalSchedule) {
      const normalized = normalizeSchedule(profile.generalSchedule);
      setSchedule(normalized);
    } else {
      setSchedule(defaultSchedule);
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
                        />
                        <TextField
                          type="time"
                          label="Fin"
                          value={safeDaySchedule.endTime}
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
        Configura los horarios específicos de cada médico en esta clínica
      </Typography>

      <DoctorSchedulesList clinicId={clinicId} />
    </Box>
  );
};

// Componente para listar y editar horarios de médicos
const DoctorSchedulesList = ({ clinicId }: { clinicId: string }) => {
  const { doctors, loading } = useClinicDoctors(clinicId);
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);

  if (loading) {
    return <Typography>Cargando médicos...</Typography>;
  }

  if (doctors.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No hay médicos registrados. Invita médicos desde la sección "Gestión de Médicos".
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const activeDoctors = doctors.filter((doctor) => doctor.isActive);

  if (activeDoctors.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No hay médicos activos. Activa médicos desde la sección "Gestión de Médicos".
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {activeDoctors.map((doctor) => (
        <DoctorScheduleCard
          key={doctor.id}
          doctor={doctor}
          isExpanded={expandedDoctor === doctor.id}
          onToggleExpand={() => setExpandedDoctor(expandedDoctor === doctor.id ? null : doctor.id)}
        />
      ))}
    </Box>
  );
};

// Componente para editar horarios de un médico
const DoctorScheduleCard = ({
  doctor,
  isExpanded,
  onToggleExpand,
}: {
  doctor: ClinicDoctor;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const { schedule, loading, updateSchedule } = useDoctorSchedule(doctor.id);
  const [localSchedule, setLocalSchedule] = useState<DoctorSchedule | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule) {
      setLocalSchedule(schedule);
    }
  }, [schedule]);

  const handleDayChange = (
    day: keyof Omit<DoctorSchedule, 'id' | 'doctorId' | 'clinicId' | 'createdAt' | 'updatedAt'>,
    field: keyof DaySchedule,
    value: any
  ) => {
    if (!localSchedule) return;
    
    setLocalSchedule({
      ...localSchedule,
      [day]: {
        ...localSchedule[day],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!localSchedule) return;
    
    setSaving(true);
    try {
      await updateSchedule(localSchedule);
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      alert('Error al guardar horarios. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !localSchedule) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>Cargando horarios de {doctor.name}...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            mb: isExpanded ? 2 : 0,
          }}
          onClick={onToggleExpand}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {doctor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {doctor.specialty} {doctor.officeNumber && `• Consultorio ${doctor.officeNumber}`}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<Edit />}>
            {isExpanded ? 'Ocultar' : 'Editar Horarios'}
          </Button>
        </Box>

        {isExpanded && (
          <Box sx={{ mt: 2 }}>
            <Grid2 container spacing={2}>
              {daysOfWeek.map((day) => {
                const daySchedule = localSchedule[day.key];
                return (
                  <Grid2 key={day.key} size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={daySchedule.enabled}
                            onChange={(e) =>
                              handleDayChange(day.key, 'enabled', e.target.checked)
                            }
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
                            onChange={(e) =>
                              handleDayChange(day.key, 'startTime', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                          <TextField
                            type="time"
                            label="Fin"
                            value={daySchedule.endTime}
                            onChange={(e) =>
                              handleDayChange(day.key, 'endTime', e.target.value)
                            }
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

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
              >
                {saving ? 'Guardando...' : 'Guardar Horarios'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
