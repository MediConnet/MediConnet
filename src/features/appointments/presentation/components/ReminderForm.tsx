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
import { Close, Notifications } from '@mui/icons-material';
import type { CreateReminderParams } from '../../domain/Reminder.entity';

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (params: CreateReminderParams) => void;
}

export const ReminderForm = ({ open, onClose, onSubmit }: ReminderFormProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(true);

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
      pushNotificationEnabled,
    });

    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setPushNotificationEnabled(true);
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setPushNotificationEnabled(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Notifications sx={{ color: '#06b6d4', fontSize: 24 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Crear Recordatorio
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Configura un recordatorio para tu cita médica
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
            label="Título del Recordatorio"
            required
            fullWidth
            placeholder="Ej: Recordatorio - Consulta con Dr. García"
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
            />
            <TextField
              label="Hora"
              required
              type="time"
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
            placeholder="Información adicional sobre el recordatorio..."
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
                  checked={pushNotificationEnabled}
                  onChange={(e) => setPushNotificationEnabled(e.target.checked)}
                  sx={{ color: '#06b6d4', '&.Mui-checked': { color: '#06b6d4' } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Activar notificación push
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
              <Notifications sx={{ mr: 1, fontSize: 18 }} />
              Crear Recordatorio
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

