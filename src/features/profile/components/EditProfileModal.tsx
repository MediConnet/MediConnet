import { useState, useEffect } from 'react';
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
import { Close, Person } from '@mui/icons-material';
import type { Profile } from '../domain/Profile.entity';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (updatedProfile: Profile) => void;
}

export const EditProfileModal = ({ open, onClose, profile, onSave }: EditProfileModalProps) => {
  const [firstName, ...lastNameParts] = profile.fullName.split(' ');
  const lastName = lastNameParts.join(' ');

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: profile.email,
    phone: profile.phone,
    gender: profile.gender,
    birthDate: profile.birthDate,
  });

  useEffect(() => {
    if (open) {
      const [first, ...last] = profile.fullName.split(' ');
      setFormData({
        firstName: first,
        lastName: last.join(' '),
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        birthDate: profile.birthDate,
      });
    }
  }, [open, profile]);

  const genders = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: Profile = {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      birthDate: formData.birthDate,
    };
    onSave(updatedProfile);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Person sx={{ fontSize: 24, color: '#06b6d4' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          Editar Información Personal
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
                label="Nombre"
                required
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Apellidos"
                required
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de Nacimiento"
                required
                type="date"
                fullWidth
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Género"
                required
                fullWidth
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Teléfono"
                required
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Correo Electrónico"
                required
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
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
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

