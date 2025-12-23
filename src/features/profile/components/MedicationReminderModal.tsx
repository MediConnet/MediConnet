import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Grid,
  MenuItem,
} from '@mui/material';
import { Close, Medication } from '@mui/icons-material';

interface MedicationReminderModalProps {
  open: boolean;
  onClose: () => void;
}

export const MedicationReminderModal = ({ open, onClose }: MedicationReminderModalProps) => {
  const [formData, setFormData] = useState({
    medication: '',
    dose: '',
    frequency: '',
    startDate: '',
    firstDoseTime: '',
    endDate: '',
    notes: '',
  });

  const frequencies = [
    'Una vez al día',
    'Dos veces al día',
    'Tres veces al día',
    'Cada 6 horas',
    'Cada 8 horas',
    'Cada 12 horas',
    'Según necesidad',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar guardado
    console.log('Guardar recordatorio:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Medication sx={{ fontSize: 24, color: '#06b6d4' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          Nuevo Recordatorio
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Medicamento"
                required
                fullWidth
                placeholder="Ej: Aspirina"
                value={formData.medication}
                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Dosis"
                fullWidth
                placeholder="Ej: 500mg, 1 tableta"
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Frecuencia"
                required
                fullWidth
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="Selecciona"
              >
                {frequencies.map((freq) => (
                  <MenuItem key={freq} value={freq}>
                    {freq}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Hora de Primera Toma"
                required
                type="time"
                fullWidth
                value={formData.firstDoseTime}
                onChange={(e) => setFormData({ ...formData, firstDoseTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ placeholder: '--:--' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de Inicio"
                required
                type="date"
                fullWidth
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de Fin (opcional)"
                type="date"
                fullWidth
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ placeholder: 'dd/mm/aaaa' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notas (opcional)"
                fullWidth
                multiline
                rows={3}
                placeholder="Ej: Tomar con comida, después de cenar..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#d1d5db',
            color: '#4b5563',
            textTransform: 'none',
            px: 3,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#06b6d4',
            color: 'white',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              backgroundColor: '#0891b2',
            },
          }}
        >
          Guardar Recordatorio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

