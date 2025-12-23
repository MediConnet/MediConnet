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
  MenuItem,
} from '@mui/material';
import { Close, Description } from '@mui/icons-material';

interface MedicalRecordModalProps {
  open: boolean;
  onClose: () => void;
}

export const MedicalRecordModal = ({ open, onClose }: MedicalRecordModalProps) => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    date: '',
    doctor: '',
  });

  const recordTypes = [
    'Alergia',
    'Enfermedad Crónica',
    'Cirugía',
    'Medicamento',
    'Vacuna',
    'Otro',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar guardado
    console.log('Guardar registro:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Description sx={{ fontSize: 24, color: '#06b6d4' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          Nuevo Registro Médico
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            select
            label="Tipo de Registro"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Selecciona un tipo"
          >
            {recordTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Título"
            fullWidth
            placeholder="Ej: Alergia a la penicilina"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            placeholder="Detalles adicionales..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            label="Fecha"
            type="date"
            fullWidth
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ placeholder: 'dd/mm/aaaa' }}
          />

          <TextField
            label="Doctor"
            fullWidth
            placeholder="Nombre del doctor"
            value={formData.doctor}
            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          />
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

