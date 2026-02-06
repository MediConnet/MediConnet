import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Schedule, Info } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getClinicInfoAPI } from '../../infrastructure/clinic-associated.api';
import type { ClinicSchedule } from '../../../clinic-panel/domain/clinic.entity';

const dayNames: Record<keyof ClinicSchedule, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const ClinicScheduleView = () => {
  const [schedule, setSchedule] = useState<ClinicSchedule | null>(null);
  const [clinicName, setClinicName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClinicSchedule = async () => {
      try {
        setLoading(true);
        const clinicInfo = await getClinicInfoAPI();
        
        if (clinicInfo && clinicInfo.generalSchedule) {
          setSchedule(clinicInfo.generalSchedule);
          setClinicName(clinicInfo.name);
        } else {
          setError('No se pudo cargar el horario de la clínica');
        }
      } catch (err) {
        console.error('Error cargando horario de la clínica:', err);
        setError('Error al cargar el horario de la clínica');
      } finally {
        setLoading(false);
      }
    };

    loadClinicSchedule();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !schedule) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Horario Laboral de la Clínica
        </Typography>
        <Alert severity="error">{error || 'No se encontró información del horario'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Schedule sx={{ fontSize: 32, color: '#14b8a6' }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Horario Laboral de la Clínica
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {clinicName}
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        <Typography variant="body2">
          Este es el horario general de atención de la clínica. Los horarios son configurados por la
          administración de la clínica y aplican para todos los médicos.
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600, width: '30%' }}>Día</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '20%' }} align="center">
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '25%' }} align="center">
                    Hora Inicio
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '25%' }} align="center">
                    Hora Fin
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(Object.keys(dayNames) as Array<keyof ClinicSchedule>).map((dayKey) => {
                  const daySchedule = schedule[dayKey];
                  return (
                    <TableRow key={dayKey} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{dayNames[dayKey]}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={daySchedule.enabled ? 'Abierto' : 'Cerrado'}
                          color={daySchedule.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography color={daySchedule.enabled ? 'text.primary' : 'text.disabled'}>
                          {daySchedule.enabled ? daySchedule.startTime : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color={daySchedule.enabled ? 'text.primary' : 'text.disabled'}>
                          {daySchedule.enabled ? daySchedule.endTime : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          Nota Importante
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Si necesitas modificar tu horario personal o solicitar cambios en el horario de la clínica,
          contacta con la administración de la clínica o usa la sección "Solicitar Bloqueos" para
          bloquear fechas específicas.
        </Typography>
      </Alert>
    </Box>
  );
};
