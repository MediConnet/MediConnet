import { useState, useRef } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { CameraAlt, Person } from '@mui/icons-material';
import { ProfileTabs } from '../components/ProfileTabs';
import { PersonalInfoCard } from '../components/PersonalInfoCard';
import { MedicalHistoryCard } from '../components/MedicalHistoryCard';
import { MedicationCard } from '../components/MedicationCard';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { useProfile } from '../hooks/useProfile';
import { Footer } from '../../../shared/components/Footer';

type TabValue = 'info' | 'history' | 'medication' | 'professional';

export const ProfilePage = () => {
  const [tab, setTab] = useState<TabValue>('info');
  const { data: initialData } = useProfile();
  const [profileData, setProfileData] = useState(initialData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (updatedProfile: typeof initialData) => {
    setProfileData(updatedProfile);
    // TODO: Aquí se podría hacer una llamada a la API para guardar los cambios
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB');
        return;
      }

      // Crear URL temporal para mostrar la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // TODO: Aquí se podría subir la imagen al servidor
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <Box sx={{ flex: 1, maxWidth: '1200px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, py: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, mb: { xs: 3, md: 4 }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Avatar
              src={profileImage || undefined}
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                bgcolor: profileImage ? 'transparent' : '#06b6d4',
                fontSize: { xs: 32, sm: 40, md: 48 },
              }}
            >
              {!profileImage && <Person sx={{ fontSize: { xs: 40, sm: 50, md: 64 }, color: 'white' }} />}
            </Avatar>
            <IconButton
              onClick={handleCameraClick}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: '#e0e0e0',
                width: { xs: 28, sm: 32, md: 36 },
                height: { xs: 28, sm: 32, md: 36 },
                border: '3px solid white',
                '&:hover': {
                  bgcolor: '#d0d0d0',
                },
              }}
            >
              <CameraAlt sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: '#4b5563' }} />
            </IconButton>
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#1e293b', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              Mi Perfil
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' } }}>
              {profileData.fullName.toLowerCase()}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <ProfileTabs value={tab} onChange={setTab} />

        {/* Content */}
        <Box sx={{ mt: 3 }}>
          {tab === 'info' && <PersonalInfoCard profile={profileData} onUpdate={handleProfileUpdate} />}
          {tab === 'history' && <MedicalHistoryCard />}
          {tab === 'medication' && <MedicationCard />}
          {tab === 'professional' && <ProfessionalCard />}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};
