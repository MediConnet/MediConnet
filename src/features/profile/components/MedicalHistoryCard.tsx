import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Description, Add } from '@mui/icons-material';
import { MedicalRecordModal } from './MedicalRecordModal';

export const MedicalHistoryCard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Description sx={{ fontSize: 24, color: '#06b6d4' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
              Historial Médico
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
            Agregar Registro
          </Button>
        </Box>

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
            <Description sx={{ fontSize: 64, color: '#cbd5e1' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b', fontSize: '1.125rem' }}>
            No hay registros médicos aún
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', maxWidth: 400, fontSize: '0.875rem' }}>
            Agrega tus antecedentes, alergias y otros datos médicos importantes
          </Typography>
        </Box>
      </Box>

      <MedicalRecordModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

