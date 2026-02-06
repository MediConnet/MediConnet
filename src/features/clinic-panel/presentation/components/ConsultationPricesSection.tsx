import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import { AttachMoney, Edit, Warning } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { formatMoney } from '../../../../shared/lib/formatMoney';
import type { ConsultationPrice } from '../../domain/clinic.entity';

interface ConsultationPricesSectionProps {
  specialties: string[]; // Especialidades del perfil de la clínica
  consultationPrices?: ConsultationPrice[];
  onUpdate: (prices: ConsultationPrice[]) => Promise<void>;
}

const priceValidationSchema = Yup.object({
  price: Yup.number()
    .required('El precio es requerido')
    .min(0, 'El precio debe ser mayor o igual a 0')
    .test('decimal', 'Solo se permiten 2 decimales', (value) => {
      if (value === undefined) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
});

export const ConsultationPricesSection = ({
  specialties,
  consultationPrices = [],
  onUpdate,
}: ConsultationPricesSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<ConsultationPrice[]>(consultationPrices);

  // Sincronizar precios cuando cambien las especialidades del perfil o consultationPrices
  useEffect(() => {
    console.log('🔄 Sincronizando precios...', { specialties, consultationPrices });
    
    // Si hay precios guardados, usarlos como base
    const basePrices = consultationPrices.length > 0 ? [...consultationPrices] : [];
    
    // Agregar nuevas especialidades con precio 0
    specialties.forEach((specialty) => {
      const exists = basePrices.find((p) => p.specialty === specialty);
      if (!exists) {
        basePrices.push({
          specialty,
          price: 0,
          isActive: true,
        });
      }
    });

    // Marcar como inactivas las especialidades que ya no están en el perfil
    basePrices.forEach((price) => {
      if (!specialties.includes(price.specialty)) {
        price.isActive = false;
      } else {
        price.isActive = true;
      }
    });

    console.log('✅ Precios sincronizados:', basePrices);
    setPrices(basePrices);
  }, [specialties, consultationPrices]);

  const formik = useFormik({
    initialValues: {
      price: '',
    },
    validationSchema: priceValidationSchema,
    onSubmit: async (values) => {
      if (!selectedSpecialty) return;

      try {
        setLoading(true);
        console.log('💾 Guardando precio...', { selectedSpecialty, price: values.price });
        
        const updatedPrices = prices.map((p) =>
          p.specialty === selectedSpecialty
            ? { ...p, price: parseFloat(values.price) }
            : p
        );

        console.log('📤 Enviando precios actualizados:', updatedPrices);
        await onUpdate(updatedPrices);
        
        console.log('✅ Precio guardado exitosamente');
        setPrices(updatedPrices);
        setDialogOpen(false);
        setSelectedSpecialty(null);
        formik.resetForm();
        alert('Precio actualizado correctamente');
      } catch (error) {
        console.error('❌ Error al actualizar precio:', error);
        alert('Error al actualizar el precio. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleEditPrice = (specialty: string, currentPrice: number) => {
    setSelectedSpecialty(specialty);
    formik.setFieldValue('price', currentPrice.toString());
    setDialogOpen(true);
  };

  const activePrices = prices.filter((p) => p.isActive);
  const hasUnpricedSpecialties = activePrices.some((p) => p.price === 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney sx={{ color: '#14b8a6' }} />
            Precios por Especialidad
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configura el precio de consulta para cada especialidad que ofrece tu clínica
          </Typography>
        </Box>
      </Box>

      {specialties.length === 0 ? (
        <Alert severity="info" icon={<Warning />}>
          <Typography variant="body2" fontWeight={600}>
            No has agregado especialidades en tu perfil
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Ve a "Perfil de Clínica" y agrega las especialidades que ofreces para poder configurar sus precios.
          </Typography>
        </Alert>
      ) : (
        <>
          {hasUnpricedSpecialties && (
            <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600}>
                Algunas especialidades no tienen precio configurado
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Configura los precios para todas las especialidades para que los pacientes puedan agendar citas.
              </Typography>
            </Alert>
          )}

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Especialidad</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Precio de Consulta
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activePrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay especialidades activas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  activePrices.map((priceItem) => (
                    <TableRow key={priceItem.specialty} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{priceItem.specialty}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                          <Typography
                            fontWeight={600}
                            color={priceItem.price === 0 ? 'error' : '#10b981'}
                            fontSize="1.1rem"
                          >
                            {formatMoney(priceItem.price)}
                          </Typography>
                          {priceItem.price === 0 && (
                            <Chip label="Sin precio" color="error" size="small" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditPrice(priceItem.specialty, priceItem.price)}
                          sx={{ color: '#14b8a6' }}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Nota:</strong> Los precios configurados aquí se aplicarán a todos los médicos de la
              especialidad correspondiente. También puedes establecer precios individuales por médico en la
              sección "Gestión de Médicos".
            </Typography>
          </Alert>
        </>
      )}

      {/* Dialog para editar precio */}
      <Dialog open={dialogOpen} onClose={() => !loading && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            <Typography variant="h6" fontWeight={700}>
              Establecer Precio de Consulta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedSpecialty}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Precio de Consulta ($) *"
                name="price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                placeholder="50.00"
                autoFocus
              />

              <Alert severity="info">
                <Typography variant="body2">
                  Este precio se aplicará por defecto a todos los médicos de esta especialidad. Puedes
                  personalizar el precio individual de cada médico en "Gestión de Médicos".
                </Typography>
              </Alert>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
            >
              {loading ? 'Guardando...' : 'Guardar Precio'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
