import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, IconButton, Box, Typography, Avatar, Alert } from '@mui/material';
import { Close, Person, CheckCircle } from '@mui/icons-material';
import { DatePickerSection } from './DatePickerSection';
import { TimeSlotsSection } from './TimeSlotsSection';
import { PatientForm } from './PatientForm';
import type { Laboratory } from '../../domain/laboratory.model';

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  laboratory?: Laboratory;
}

export const AppointmentModal = ({ open, onClose, laboratory }: AppointmentModalProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAgendarCita = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Agendar Cita
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {laboratory && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, backgroundColor: '#f0fdfa', borderRadius: 2 }}>
            <Avatar sx={{ backgroundColor: '#06b6d4', width: 48, height: 48 }}>
              <Person sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {laboratory.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Laboratory
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f0fdfa', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Consulta General
          </Typography>
          <Typography variant="h6" sx={{ color: '#06b6d4', fontWeight: 600 }}>
            $25.00
          </Typography>
        </Box>

        {showSuccess ? (
          <Alert 
            icon={<CheckCircle />} 
            severity="success" 
            sx={{ mt: 3 }}
          >
            Cita agendada con éxito
          </Alert>
        ) : (
          <>
            <DatePickerSection />
            <TimeSlotsSection />
            <PatientForm />

            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleAgendarCita}
              sx={{ 
                mt: 3, 
                backgroundColor: '#06b6d4',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#0891b2',
                },
              }}
            >
              Agendar Cita
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
