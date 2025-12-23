import { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip } from '@mui/material';
import { Work, Send, AccessTime, LocalHospital, Science, LocalShipping, Inventory, Business } from '@mui/icons-material';
import { ProfessionalRequestModal } from './ProfessionalRequestModal';

export const ProfessionalCard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data - en producción vendría de un hook
  const requests = [
    {
      id: '1',
      name: 'Kevin Ctat',
      profession: 'Médico',
      status: 'En Revisión',
      sentDate: '16/12/2025',
    },
    {
      id: '2',
      name: 'Kevin Ctat',
      profession: 'Médico',
      status: 'En Revisión',
      sentDate: '16/12/2025',
    },
  ];

  return (
    <>
      {/* ¿Eres profesional de salud? Card */}
      <Box
        sx={{
          backgroundColor: '#f3e8ff',
          borderRadius: 2,
          p: 4,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 2,
            backgroundColor: '#9333ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Work sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1e293b', fontSize: '1.25rem' }}>
            ¿Eres profesional de salud?
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
            Solicita habilitación para ofrecer tus servicios
          </Typography>
        </Box>
      </Box>

      {/* Estado de mis solicitudes */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Work sx={{ fontSize: 24, color: '#06b6d4' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
            Estado de mis solicitudes
          </Typography>
        </Box>

        {requests.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {requests.map((request) => (
              <Card
                key={request.id}
                sx={{
                  backgroundColor: '#fef9c3',
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #fde047',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocalHospital sx={{ fontSize: 32, color: '#eab308', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {request.name}
                        </Typography>
                        <Chip
                          icon={<AccessTime sx={{ fontSize: 16 }} />}
                          label={request.status}
                          size="small"
                          sx={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            fontWeight: 500,
                            height: 24,
                            '& .MuiChip-icon': {
                              color: '#92400e',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        {request.profession}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, fontSize: '0.875rem' }}>
                        Enviada: {request.sentDate}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando sea aprobada.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
            No tienes solicitudes pendientes
          </Typography>
        )}
      </Box>

      {/* Botón Solicitar habilitación */}
      <Button
        fullWidth
        variant="contained"
        startIcon={<Send />}
        onClick={() => setModalOpen(true)}
        sx={{
          backgroundColor: '#9333ea',
          color: 'white',
          textTransform: 'none',
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: '1rem',
          mb: 4,
          '&:hover': {
            backgroundColor: '#7e22ce',
          },
        }}
      >
        Solicitar habilitación para ofrecer servicios
      </Button>

      {/* Secciones informativas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* ¿Cómo funciona? */}
        <Box
          sx={{
            backgroundColor: '#e0f2fe',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: '1.125rem' }}>
            ¿Cómo funciona?
          </Typography>
          <Box component="ol" sx={{ pl: 3, m: 0 }}>
            <Typography component="li" sx={{ mb: 1.5, color: '#1e293b', fontSize: '0.9375rem' }}>
              Envías tu solicitud con los datos y documentos requeridos
            </Typography>
            <Typography component="li" sx={{ mb: 1.5, color: '#1e293b', fontSize: '0.9375rem' }}>
              Nuestro equipo verifica tu información profesional
            </Typography>
            <Typography component="li" sx={{ mb: 1.5, color: '#1e293b', fontSize: '0.9375rem' }}>
              Te notificamos por correo cuando tu solicitud sea aprobada
            </Typography>
            <Typography component="li" sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
              Una vez aprobada, tu rol cambia a Proveedor y se habilita el Panel de Proveedor
            </Typography>
          </Box>
        </Box>

        {/* Tipos de servicios disponibles */}
        <Box
          sx={{
            backgroundColor: '#fef3c7',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: '1.125rem' }}>
            Tipos de servicios disponibles
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, listStyle: 'none' }}>
            <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalHospital sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
                <strong>Médico:</strong> Consultas, especialistas, cirugías
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
                <strong>Farmacia:</strong> Venta de medicamentos y productos
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Science sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
                <strong>Laboratorio:</strong> Exámenes clínicos y diagnósticos
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
                <strong>Ambulancia:</strong> Traslados y emergencias
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
                <strong>Insumos Médicos:</strong> Equipos y suministros
              </Typography>
            </Box>
            <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalHospital sx={{ fontSize: 20, color: '#f59e0b' }} />
              <Typography sx={{ color: '#1e293b', fontSize: '0.9375rem' }}>
                <strong>Clínica:</strong> Centros médicos integrales
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <ProfessionalRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

