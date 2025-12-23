import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Medication, Add } from '@mui/icons-material';
import { MedicationReminderModal } from './MedicationReminderModal';

export const MedicationCard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 3,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Medication sx={{ fontSize: 24, color: '#06b6d4' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
                Recordatorios de Medicación
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
              Nunca olvides tomar tu medicación a tiempo
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
            sx={{
              backgroundColor: '#06b6d4',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#0891b2',
              },
            }}
          >
            Agregar
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Empty State */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Medication sx={{ fontSize: 64, color: '#cbd5e1' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b', fontSize: '1.125rem' }}>
            No tienes recordatorios de medicación
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', maxWidth: 400, fontSize: '0.875rem' }}>
            Agrega tus medicamentos para no olvidar ninguna toma
          </Typography>
        </Box>
      </Box>

      <MedicationReminderModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

