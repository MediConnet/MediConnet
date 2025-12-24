import { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Edit } from '@mui/icons-material';
import type { Profile } from '../domain/Profile.entity';
import { EditProfileModal } from './EditProfileModal';

interface PersonalInfoCardProps {
  profile: Profile;
  onUpdate?: (updatedProfile: Profile) => void;
}

export const PersonalInfoCard = ({ profile, onUpdate }: PersonalInfoCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleSave = (updatedProfile: Profile) => {
    setCurrentProfile(updatedProfile);
    if (onUpdate) {
      onUpdate(updatedProfile);
    }
  };

  const [firstName, ...lastNameParts] = currentProfile.fullName.split(' ');
  const lastName = lastNameParts.join(' ');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        p: { xs: 2, sm: 3, md: 4 },
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 0 }, mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          Información Personal
        </Typography>
        <Button
          startIcon={<Edit />}
          variant="outlined"
          onClick={() => setEditModalOpen(true)}
          sx={{
            textTransform: 'none',
            borderColor: '#d1d5db',
            color: '#4b5563',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
          }}
        >
          Editar
        </Button>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.875rem' }}>
              Nombre
            </Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500 }}>
              {firstName}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.875rem' }}>
              Fecha de Nacimiento
            </Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500 }}>
              {formatDate(currentProfile.birthDate)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.875rem' }}>
              Teléfono
            </Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500 }}>
              {currentProfile.phone}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.875rem' }}>
              Apellidos
            </Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500 }}>
              {lastName}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.875rem' }}>
              Género
            </Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500 }}>
              {currentProfile.gender}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.875rem' }}>
              Correo Electrónico
            </Typography>
            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 500 }}>
              {currentProfile.email}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={currentProfile}
        onSave={handleSave}
      />
    </Box>
  );
};

