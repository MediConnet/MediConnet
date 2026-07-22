import { useState, useEffect } from "react";
import {
  CalendarToday,
  AccessTime,
  Block,
  Save,
  CheckCircle,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAuthStore } from "../../../../app/store/auth.store";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";
import type { WorkSchedule, TimeSlot } from "../../domain/DoctorDashboard.entity";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import {
  createDoctorBlockedSlotAPI,
  deleteDoctorBlockedSlotAPI,
  getDoctorBlockedSlotsAPI,
  type BlockedSlot,
} from "../../infrastructure/doctors.api";

interface Props {
  isAesthetic?: boolean;
}

export const SettingsSection = ({ isAesthetic = false }: Props) => {
  const authStore = useAuthStore();
  const { user } = authStore;
  const feedback = useFeedbackStore();
  const { data, refetch } = useDoctorDashboard();
  const { mutateAsync: updateProfile, isPending: saving } = useUpdateDoctorProfile();

  const [consultationDuration, setConsultationDuration] = useState(30);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [savingBlocked, setSavingBlocked] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  useEffect(() => {
    if (data?.doctor) {
      setConsultationDuration(data.doctor.consultationDuration || 30);
      const duration = normalizeDuration(data.doctor.consultationDuration || 30);
      const hydrated = (data.doctor.workSchedule || []).map((s) => {
        const blockedHours = Array.isArray(s.blockedHours) ? s.blockedHours : [];
        const builtSlots =
          s.timeSlots && s.timeSlots.length > 0
            ? s.timeSlots
            : buildTimeSlots({
                startTime: s.startTime || "09:00",
                endTime: s.endTime || "17:00",
                durationMin: duration,
              });

        return {
          ...s,
          blockedHours,
          timeSlots: builtSlots.map((slot) => ({
            ...slot,
            available: blockedHours.includes(slot.startTime) ? false : slot.available,
          })),
        };
      });
      setWorkSchedule(hydrated);
    }
  }, [data]);

  useEffect(() => {
    // Cargar bloqueos reales (solo doctores independientes)
    let mounted = true;
    (async () => {
      setLoadingBlocked(true);
      try {
        const slots = await getDoctorBlockedSlotsAPI();
        if (mounted) setBlockedSlots(slots);
      } catch {
        // Silencioso: algunos usuarios (médico de clínica) no tienen este endpoint aplicable.
      } finally {
        if (mounted) setLoadingBlocked(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const durationOptions = [30, 60] as const;
  const normalizeDuration = (value: number) => (value === 60 ? 60 : 30);

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
    return h * 60 + m;
  };

  const fromMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const buildTimeSlots = (params: {
    startTime: string;
    endTime: string;
    durationMin: number;
    previousSlots?: TimeSlot[];
  }): TimeSlot[] => {
    const start = toMinutes(params.startTime);
    const end = toMinutes(params.endTime);
    const step = normalizeDuration(params.durationMin);
    if (end <= start) return [];

    const prevAvailability = new Map(
      (params.previousSlots || []).map((s) => [s.startTime, Boolean(s.available)]),
    );

    const slots: TimeSlot[] = [];
    for (let t = start; t + step <= end; t += step) {
      const slotStart = fromMinutes(t);
      const slotEnd = fromMinutes(t + step);
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: prevAvailability.get(slotStart) ?? true,
      });
    }
    return slots;
  };

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
            timeSlots: buildTimeSlots({
              startTime: "09:00",
              endTime: "17:00",
              durationMin: consultationDuration,
            }),
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
          const slots =
            schedule.timeSlots ||
            buildTimeSlots({
              startTime: schedule.startTime || "09:00",
              endTime: schedule.endTime || "17:00",
              durationMin: consultationDuration,
            });
          const target = slots[slotIndex];
          if (schedule.blockedHours?.includes(target.startTime)) {
            return schedule;
          }
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
          const slots = (schedule.timeSlots || []).map((slot) =>
            slot.startTime === hour
              ? { ...slot, available: isBlocked ? true : false }
              : slot,
          );
          return {
            ...schedule,
            timeSlots: slots,
            blockedHours: isBlocked
              ? blocked.filter((h) => h !== hour)
              : [...blocked, hour],
          };
        }
        return schedule;
      })
    );
  };

  const isFullDayBlocked = (date: string) =>
    blockedSlots.some(
      (s) => s.date === date && s.startTime === "00:00" && s.endTime === "23:59",
    );

  const handleBlockDate = async () => {
    if (!newBlockedDate) return;
    if (isFullDayBlocked(newBlockedDate)) {
      setNewBlockedDate("");
      return;
    }

    setSavingBlocked(true);
    try {
      const created = await createDoctorBlockedSlotAPI({
        date: newBlockedDate,
        startTime: "00:00",
        endTime: "23:59",
        reason: "Bloqueo día completo",
      });
      setBlockedSlots((prev) => [...prev, created]);
      setNewBlockedDate("");
      feedback.showFeedback('success', 'Operación completada', 'La información se guardó correctamente.');
    } catch {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    } finally {
      setSavingBlocked(false);
    }
  };

  const handleRemoveBlockedDate = async (date: string) => {
    const fullDayBlocks = blockedSlots.filter(
      (s) => s.date === date && s.startTime === "00:00" && s.endTime === "23:59",
    );
    if (fullDayBlocks.length === 0) return;

    setSavingBlocked(true);
    try {
      await Promise.all(fullDayBlocks.map((b) => deleteDoctorBlockedSlotAPI(b.id)));
      setBlockedSlots((prev) =>
        prev.filter((s) => !(s.date === date && s.startTime === "00:00" && s.endTime === "23:59")),
      );
      feedback.showFeedback('success', 'Registro eliminado', 'La acción se completó correctamente.');
    } catch {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    } finally {
      setSavingBlocked(false);
    }
  };

  const handleConsultationDurationChange = (next: number) => {
    const normalized = normalizeDuration(next);
    setConsultationDuration(normalized);
    setWorkSchedule((prev) =>
      prev.map((s) => {
        if (!s.enabled) return s;
        const newSlots = buildTimeSlots({
          startTime: s.startTime || "09:00",
          endTime: s.endTime || "17:00",
          durationMin: normalized,
          previousSlots: s.timeSlots,
        });
        // Limpiar bloqueos de horas que ya no existan en la nueva granularidad
        const allowedStarts = new Set(newSlots.map((ts) => ts.startTime));
        const nextBlocked = (s.blockedHours || []).filter((h) => allowedStarts.has(h));
        return { ...s, timeSlots: newSlots, blockedHours: nextBlocked };
      }),
    );
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        consultationDuration: normalizeDuration(consultationDuration),
        workSchedule: workSchedule.map((s) => ({
          ...s,
          timeSlots: s.enabled
            ? buildTimeSlots({
                startTime: s.startTime || "09:00",
                endTime: s.endTime || "17:00",
                durationMin: consultationDuration,
                previousSlots: s.timeSlots,
              })
            : s.timeSlots,
        })),
      });
      refetch();
      feedback.showFeedback('success', 'Cambios guardados', 'La información fue actualizada correctamente.');
    } catch {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Duración de Consulta */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <AccessTime sx={{ color: isAesthetic ? "#db2777" : "#06b6d4" }} />
            <Typography variant="h6" fontWeight={600}>
              Duración de Consulta / Cita
            </Typography>
          </div>
          <FormControl fullWidth sx={{ maxWidth: 300 }}>
            <InputLabel id="consultation-duration-label">Duración</InputLabel>
            <Select
              labelId="consultation-duration-label"
              label="Duración"
              value={normalizeDuration(consultationDuration)}
              onChange={(e) => handleConsultationDurationChange(Number(e.target.value))}
            >
              {durationOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt} min
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Solo puedes seleccionar 30 o 60 minutos.
            </Typography>
          </FormControl>
        </CardContent>
      </Card>

      {/* Selección de Días Laborales */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <CalendarToday sx={{ color: isAesthetic ? "#db2777" : "#06b6d4" }} />
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
                      ? isAesthetic
                        ? "border-pink-500 bg-pink-50 text-pink-700 font-bold"
                        : "border-teal-500 bg-teal-50 text-teal-700"
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
          const slots =
            schedule.timeSlots ||
            buildTimeSlots({
              startTime: schedule.startTime || "09:00",
              endTime: schedule.endTime || "17:00",
              durationMin: consultationDuration,
            });
          return (
            <Card key={schedule.day} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Bloques Horarios - {dayLabels[schedule.day]}
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {slots.map((slot, index) => (
                    (() => {
                      const isBlockedByHour =
                        schedule.blockedHours?.includes(slot.startTime) || false;
                      return (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotToggle(schedule.day, index)}
                      disabled={isBlockedByHour}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        isBlockedByHour
                          ? "border-red-300 bg-red-50 text-red-600 cursor-not-allowed"
                          : slot.available
                          ? isAesthetic
                            ? "border-pink-500 bg-pink-50 text-pink-700 font-semibold"
                            : "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                      );
                    })()
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
              disabled={!newBlockedDate || savingBlocked}
              sx={{
                textTransform: "none",
                backgroundColor: isAesthetic ? "#db2777" : undefined,
                "&:hover": { backgroundColor: isAesthetic ? "#be185d" : undefined },
              }}
            >
              {savingBlocked ? "Procesando..." : "Bloquear"}
            </Button>
          </div>
          {loadingBlocked && (
            <Typography variant="body2" color="text.secondary">
              Cargando bloqueos...
            </Typography>
          )}
          {blockedSlots.filter((s) => s.startTime === "00:00" && s.endTime === "23:59").length >
            0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(
                  blockedSlots
                    .filter((s) => s.startTime === "00:00" && s.endTime === "23:59")
                    .map((s) => s.date),
                ),
              ).map((date) => (
                <Chip
                  key={date}
                  label={new Date(date).toLocaleDateString("es-ES")}
                  onDelete={() => handleRemoveBlockedDate(date)}
                  color="error"
                  variant="outlined"
                  disabled={savingBlocked}
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
            backgroundColor: isAesthetic ? "#db2777" : "#06b6d4",
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontWeight: 700,
            "&:hover": { backgroundColor: isAesthetic ? "#be185d" : "#0891b2" },
          }}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
};
