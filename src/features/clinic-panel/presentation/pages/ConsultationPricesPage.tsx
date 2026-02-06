import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { ConsultationPricesSection } from '../components/ConsultationPricesSection';
import { useClinicProfile } from '../hooks/useClinicProfile';
import type { ConsultationPrice } from '../../domain/clinic.entity';

interface ConsultationPricesPageProps {
  clinicId: string;
}

export const ConsultationPricesPage = ({ clinicId }: ConsultationPricesPageProps) => {
  const { profile: clinic, loading, error, updateProfile } = useClinicProfile();

  const handleUpdatePrices = async (prices: ConsultationPrice[]) => {
    if (!clinic) return;

    await updateProfile({
      ...clinic,
      consultationPrices: prices,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error al cargar los precios: {error.message}</Alert>
      </Box>
    );
  }

  if (!clinic) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No se encontró información de la clínica</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Precios por Consulta
      </Typography>

      <ConsultationPricesSection
        specialties={clinic.specialties || []}
        consultationPrices={clinic.consultationPrices || []}
        onUpdate={handleUpdatePrices}
      />
    </Box>
  );
};
