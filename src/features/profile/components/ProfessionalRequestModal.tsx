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
import { Close, Work, CloudUpload } from '@mui/icons-material';
import { useProfile } from '../hooks/useProfile';

interface ProfessionalRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProfessionalRequestModal = ({ open, onClose }: ProfessionalRequestModalProps) => {
  const { data: profile } = useProfile();
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    serviceType: '',
    companyName: '',
    ruc: '',
    description: '',
    address: '',
  });

  const serviceTypes = [
    'Médico',
    'Farmacia',
    'Laboratorio',
    'Ambulancia',
    'Insumos Médicos',
    'Clínica',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envío de solicitud
    console.log('Enviar solicitud:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Work sx={{ fontSize: 24, color: '#9333ea' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          Solicitud de Habilitación de Servicio
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Nombre completo"
            required
            fullWidth
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <TextField
            label="Correo registrado"
            required
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextField
            label="Número de contacto"
            required
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <TextField
            select
            label="Tipo de servicio"
            required
            fullWidth
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            placeholder="Selecciona un tipo"
          >
            {serviceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Nombre de empresa o profesional"
            required
            fullWidth
            placeholder="Ej: Clínica San José, Dr. Juan Pérez"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />

          <TextField
            label="RUC / Identificación profesional"
            fullWidth
            placeholder="Opcional"
            value={formData.ruc}
            onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
          />

          <TextField
            label="Descripción del servicio"
            required
            fullWidth
            multiline
            rows={4}
            placeholder="Describe brevemente los servicios que ofreces..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            label="Dirección física"
            fullWidth
            placeholder="Opcional - Dirección del establecimiento"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, fontSize: '0.875rem' }}>
              Documentos adjuntos (opcional)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.75rem' }}>
              Título profesional, permiso de funcionamiento, licencia, etc.
            </Typography>
            <Box
              sx={{
                border: '2px dashed #d1d5db',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              <CloudUpload sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Haz clic para subir documentos
              </Typography>
            </Box>
          </Box>
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
            backgroundColor: '#9333ea',
            color: 'white',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              backgroundColor: '#7e22ce',
            },
          }}
        >
          Enviar Solicitud
        </Button>
      </DialogActions>
    </Dialog>
  );
};

