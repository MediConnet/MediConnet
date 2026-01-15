import { useState, useEffect } from "react";
import {
  CalendarToday,
  AccessTime,
  Block,
  Save,
  CheckCircle,
} from "@mui/icons-material";
import { Button, Chip, TextField, Box, Typography, Card, CardContent } from "@mui/material";
import { useAuthStore } from "../../../../app/store/auth.store";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";
import type { WorkSchedule, TimeSlot } from "../../domain/DoctorDashboard.entity";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { handleNumberInput } from "../../../../shared/lib/inputValidation";

export const SettingsSection = () => {
  const authStore = useAuthStore();
  const { user } = authStore;
  const { data, refetch } = useDoctorDashboard();
  const { updateProfile, loading: saving } = useUpdateDoctorProfile();

  const [consultationDuration, setConsultationDuration] = useState(30);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  useEffect(() => {
    if (data?.doctor) {
      setConsultationDuration(data.doctor.consultationDuration || 30);
      setWorkSchedule(data.doctor.workSchedule || []);
      setBlockedDates(data.doctor.blockedDates || []);
    }
  }, [data]);

  // Bloques horarios predefinidos
  const timeSlots: TimeSlot[] = [
    { startTime: "08:00", endTime: "09:00", available: true },
    { startTime: "09:00", endTime: "10:00", available: true },
    { startTime: "10:00", endTime: "11:00", available: true },
    { startTime: "11:00", endTime: "12:00", available: true },
    { startTime: "12:00", endTime: "13:00", available: true },
    { startTime: "13:00", endTime: "14:00", available: true },
    { startTime: "14:00", endTime: "15:00", available: true },
    { startTime: "15:00", endTime: "16:00", available: true },
    { startTime: "16:00", endTime: "17:00", available: true },
    { startTime: "17:00", endTime: "18:00", available: true },
  ];

  const dayLabels: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const handleDayToggle = (day: string) => {
    setWorkSchedule((prev) => {
      const existing = prev.find((s) => s.day === day);
      if (existing) {
        return prev.map((s) =>
          s.day === day ? { ...s, enabled: !s.enabled } : s
        );
      } else {
        return [
          ...prev,
          {
            day,
            enabled: true,
            startTime: "09:00",
            endTime: "17:00",
            timeSlots: timeSlots.map((slot) => ({ ...slot })),
            blockedHours: [],
          },
        ];
      }
    });
  };

  const handleTimeSlotToggle = (day: string, slotIndex: number) => {
    setWorkSchedule((prev) =>
      prev.map((schedule) => {
        if (schedule.day === day) {
          const slots = schedule.timeSlots || timeSlots.map((s) => ({ ...s }));
          slots[slotIndex].available = !slots[slotIndex].available;
          return { ...schedule, timeSlots: slots };
        }
        return schedule;
      })
    );
  };

  const handleBlockHour = (day: string, hour: string) => {
    setWorkSchedule((prev) =>
      prev.map((schedule) => {
        if (schedule.day === day) {
          const blocked = schedule.blockedHours || [];
          const isBlocked = blocked.includes(hour);
          return {
            ...schedule,
            blockedHours: isBlocked
              ? blocked.filter((h) => h !== hour)
              : [...blocked, hour],
          };
        }
        return schedule;
      })
    );
  };

  const handleBlockDate = () => {
    if (newBlockedDate && !blockedDates.includes(newBlockedDate)) {
      setBlockedDates([...blockedDates, newBlockedDate]);
      setNewBlockedDate("");
    }
  };

  const handleRemoveBlockedDate = (date: string) => {
    setBlockedDates(blockedDates.filter((d) => d !== date));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    await updateProfile(user.id, {
      consultationDuration,
      workSchedule,
      blockedDates,
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Duración de Consulta */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <AccessTime sx={{ color: "#06b6d4" }} />
            <Typography variant="h6" fontWeight={600}>
              Duración de Consulta
            </Typography>
          </div>
          <TextField
            type="text"
            label="Duración en minutos"
            value={consultationDuration}
            onChange={(e) => {
              handleNumberInput(e, (value) => {
                const numValue = parseInt(value) || 0;
                if (numValue >= 0 && numValue <= 480) {
                  setConsultationDuration(numValue);
                }
              });
            }}
            InputProps={{
              endAdornment: <Typography variant="body2" color="text.secondary">min</Typography>,
            }}
            fullWidth
            sx={{ maxWidth: 300 }}
            helperText="Solo números (máximo 480 minutos)"
          />
        </CardContent>
      </Card>

      {/* Selección de Días Laborales */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <CalendarToday sx={{ color: "#06b6d4" }} />
            <Typography variant="h6" fontWeight={600}>
              Días Laborales
            </Typography>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(dayLabels).map(([day, label]) => {
              const schedule = workSchedule.find((s) => s.day === day);
              const isEnabled = schedule?.enabled || false;
              return (
                <button
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isEnabled
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 bg-white text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isEnabled && <CheckCircle sx={{ fontSize: 20 }} />}
                    <span className="font-medium">{label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bloques Horarios Predefinidos */}
      {workSchedule
        .filter((s) => s.enabled)
        .map((schedule) => {
          const slots = schedule.timeSlots || timeSlots.map((s) => ({ ...s }));
          return (
            <Card key={schedule.day} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Bloques Horarios - {dayLabels[schedule.day]}
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotToggle(schedule.day, index)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        slot.available
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>

                {/* Bloqueo de Horas Específicas */}
                <Box mt={3}>
                  <Typography variant="body2" fontWeight={600} mb={2}>
                    Bloquear horas específicas
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot, index) => {
                      const isBlocked =
                        schedule.blockedHours?.includes(slot.startTime) || false;
                      return (
                        <Chip
                          key={index}
                          label={slot.startTime}
                          onClick={() => handleBlockHour(schedule.day, slot.startTime)}
                          color={isBlocked ? "error" : "default"}
                          variant={isBlocked ? "filled" : "outlined"}
                          icon={isBlocked ? <Block /> : undefined}
                          sx={{ cursor: "pointer" }}
                        />
                      );
                    })}
                  </div>
                </Box>
              </CardContent>
            </Card>
          );
        })}

      {/* Bloqueo de Días Completos */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Block sx={{ color: "#ef4444" }} />
            <Typography variant="h6" fontWeight={600}>
              Bloquear Días Completos
            </Typography>
          </div>
          <div className="flex gap-2 mb-4">
            <TextField
              type="date"
              label="Fecha a bloquear"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleBlockDate}
              disabled={!newBlockedDate}
              sx={{ textTransform: "none" }}
            >
              Bloquear
            </Button>
          </div>
          {blockedDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blockedDates.map((date) => (
                <Chip
                  key={date}
                  label={new Date(date).toLocaleDateString("es-ES")}
                  onDelete={() => handleRemoveBlockedDate(date)}
                  color="error"
                  variant="outlined"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            backgroundColor: "#06b6d4",
            textTransform: "none",
            px: 4,
            py: 1.5,
            "&:hover": { backgroundColor: "#0891b2" },
          }}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
};
