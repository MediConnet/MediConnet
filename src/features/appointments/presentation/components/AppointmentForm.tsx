import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Close, CalendarToday } from '@mui/icons-material';
import type { CreateAppointmentParams } from '../../domain/Appointment.entity';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (params: CreateAppointmentParams) => void;
}

export const AppointmentForm = ({ open, onClose, onSubmit }: AppointmentFormProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      return;
    }

    onSubmit({
      title,
      date,
      time,
      location: location || undefined,
      notes: notes || undefined,
      reminderEnabled,
    });

    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setReminderEnabled(true);
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setReminderEnabled(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <CalendarToday sx={{ color: '#06b6d4', fontSize: 24 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Registrar Nueva Cita
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Completa los datos de tu cita médica
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ ml: 'auto' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Título de la Cita"
            required
            fullWidth
            placeholder="Ej: Consulta con Dr. García"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 1 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Fecha"
              required
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ placeholder: 'dd/mm/aaaa' }}
            />
            <TextField
              label="Hora"
              required
              type="time"
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ placeholder: '--:--' }}
            />
          </Box>

          <TextField
            label="Lugar"
            fullWidth
            placeholder="Ej: Hospital General, Consultorio 301"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <TextField
            label="Notas"
            fullWidth
            multiline
            rows={4}
            placeholder="Información adicional sobre la cita..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Box
            sx={{
              p: 2,
              backgroundColor: '#e0f2fe',
              borderRadius: 2,
              border: '1px solid #bae6fd',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  sx={{ color: '#06b6d4', '&.Mui-checked': { color: '#06b6d4' } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Activar recordatorio con notificación push
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    Recibirás una notificación el día de tu cita
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClose}
              sx={{
                borderColor: '#d1d5db',
                color: '#4b5563',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!title || !date || !time}
              sx={{
                backgroundColor: '#06b6d4',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#0891b2',
                },
                '&:disabled': {
                  backgroundColor: '#e5e7eb',
                  color: '#9ca3af',
                },
              }}
            >
              <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
              Registrar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

