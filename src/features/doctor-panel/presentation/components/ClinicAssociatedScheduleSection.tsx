import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid2,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Info, Save, Schedule } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import type { ClinicSchedule, DaySchedule } from '../../../clinic-panel/domain/clinic.entity';
import type { DoctorSchedule } from '../../../clinic-panel/domain/doctor-schedule.entity';

type WeekDayKey = keyof ClinicSchedule;
import {
  getClinicAssociatedScheduleAPI,
  updateClinicAssociatedScheduleAPI,
} from '../../infrastructure/clinic-associated.api';
import {
  doctorScheduleToApiPayload,
  validateDoctorScheduleAgainstClinic,
} from '../../infrastructure/clinic-schedule.utils';
import { LoadingSpinner } from '../../../../shared/components/LoadingSpinner';
import { getUserFriendlyMessage, logApiError } from '../../../../shared/lib/api-error';

const daysOfWeek = [
  { key: 'monday' as const, label: 'Lunes' },
  { key: 'tuesday' as const, label: 'Martes' },
  { key: 'wednesday' as const, label: 'Miércoles' },
  { key: 'thursday' as const, label: 'Jueves' },
  { key: 'friday' as const, label: 'Viernes' },
  { key: 'saturday' as const, label: 'Sábado' },
  { key: 'sunday' as const, label: 'Domingo' },
];

export const ClinicAssociatedScheduleSection = () => {
  const [clinicSchedule, setClinicSchedule] = useState<ClinicSchedule | null>(null);
  const [doctorSchedule, setDoctorSchedule] = useState<DoctorSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const feedback = useFeedbackStore();

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClinicAssociatedScheduleAPI();
      setClinicSchedule(data.clinicSchedule);
      setDoctorSchedule(data.doctorSchedule);
    } catch (err: unknown) {
      logApiError('ClinicAssociatedSchedule', err);
      setError(getUserFriendlyMessage(err, { fallback: 'No fue posible cargar los horarios.' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleDoctorDayChange = (
    day: WeekDayKey,
    field: keyof DaySchedule | 'breakStart' | 'breakEnd',
    value: string | boolean,
  ) => {
    if (!doctorSchedule) return;

    setDoctorSchedule({
      ...doctorSchedule,
      [day]: {
        ...doctorSchedule[day],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!doctorSchedule || !clinicSchedule) return;

    const validationError = validateDoctorScheduleAgainstClinic(doctorSchedule, clinicSchedule);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await updateClinicAssociatedScheduleAPI(
        doctorScheduleToApiPayload(doctorSchedule),
      );
      setClinicSchedule(result.clinicSchedule);
      setDoctorSchedule(result.doctorSchedule);
      feedback.showFeedback('success', 'Cambios guardados', 'Tu disponibilidad se guardó correctamente.');
    } catch (err: unknown) {
      logApiError('ClinicAssociatedSchedule:save', err);
      setError(getUserFriendlyMessage(err, { fallback: 'No fue posible guardar tu disponibilidad.' }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando horarios..." />;
  }

  if (error && !doctorSchedule) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Horarios
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!clinicSchedule || !doctorSchedule) {
    return (
      <Alert severity="warning">
        No se encontró información de horarios. Verifica que estés asociado a una clínica activa.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Schedule sx={{ fontSize: 32, color: '#14b8a6' }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Horarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Horario de la clínica (referencia) y tu disponibilidad dentro de ese rango
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        Solo puedes configurar disponibilidad dentro del horario laboral de la clínica. Por ejemplo,
        si la clínica atiende de 08:00 a 18:00, no podrás registrar bloques desde las 07:00 ni después
        de las 18:00.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Horario de la clínica (solo lectura)
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Día</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Estado
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Inicio
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Fin
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {daysOfWeek.map(({ key, label }) => {
                  const day = clinicSchedule[key];
                  return (
                    <TableRow key={key} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{label}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={day.enabled ? 'Abierto' : 'Cerrado'}
                          color={day.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {day.enabled ? day.startTime : '—'}
                      </TableCell>
                      <TableCell align="center">
                        {day.enabled ? day.endTime : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Mi disponibilidad
      </Typography>

      <Card>
        <CardContent>
          <Grid2 container spacing={3}>
            {daysOfWeek.map(({ key, label }) => {
              const clinicDay = clinicSchedule[key];
              const doctorDay = doctorSchedule[key];
              const clinicClosed = !clinicDay.enabled;

              return (
                <Grid2 key={key} size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      opacity: clinicClosed ? 0.6 : 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={doctorDay.enabled}
                          disabled={clinicClosed}
                          onChange={(e) =>
                            handleDoctorDayChange(key, 'enabled', e.target.checked)
                          }
                        />
                      }
                      label={
                        <Typography fontWeight={600}>
                          {label}
                          {clinicClosed && (
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              (clínica cerrada)
                            </Typography>
                          )}
                          {!clinicClosed && clinicDay.enabled && (
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              Clínica: {clinicDay.startTime} – {clinicDay.endTime}
                            </Typography>
                          )}
                        </Typography>
                      }
                    />

                    {doctorDay.enabled && !clinicClosed && (
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1, ml: 4 }}>
                        <TextField
                          label="Inicio"
                          type="time"
                          size="small"
                          value={doctorDay.startTime}
                          onChange={(e) => handleDoctorDayChange(key, 'startTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Fin"
                          type="time"
                          size="small"
                          value={doctorDay.endTime}
                          onChange={(e) => handleDoctorDayChange(key, 'endTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Almuerzo inicio"
                          type="time"
                          size="small"
                          value={doctorDay.breakStart ?? ''}
                          onChange={(e) =>
                            handleDoctorDayChange(key, 'breakStart', e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Almuerzo fin"
                          type="time"
                          size="small"
                          value={doctorDay.breakEnd ?? ''}
                          onChange={(e) =>
                            handleDoctorDayChange(key, 'breakEnd', e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
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
              sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' } }}
            >
              {saving ? 'Guardando...' : 'Guardar disponibilidad'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
