import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Tabs, Tab, Grid } from '@mui/material';
import { CalendarToday, Add, CreditCard } from '@mui/icons-material';

import { ReminderForm } from '../components/ReminderForm';
import { AppointmentCard } from '../components/AppointmentCard';
import { ReminderCard } from '../components/ReminderCard';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

import { useAppointments, useDeleteAppointment } from '../hooks/useAppointment';
import { useReminders, useCreateReminder, useDeleteReminder } from '../hooks/useReminder';

import { Footer } from '../../../../shared/components/Footer';
import { ROUTES } from '../../../../app/config/constants';
import type { Appointment } from '../../domain/Appointment.entity';
import type { Reminder } from '../../domain/Reminder.entity';

type TabValue = 'paid' | 'reminders';

export const AppointmentsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('paid');
  const [reminderFormOpen, setReminderFormOpen] = useState(false);

  const [deleteAppointmentModal, setDeleteAppointmentModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
  }>({ open: false, appointment: null });

  const [deleteReminderModal, setDeleteReminderModal] = useState<{
    open: boolean;
    reminder: Reminder | null;
  }>({ open: false, reminder: null });

  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: reminders = [], isLoading: remindersLoading } = useReminders();

  const deleteAppointment = useDeleteAppointment();
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder();

  const handleDeleteAppointment = (id: string) => {
    const appointment = appointments.find((app) => app.id === id);
    if (appointment) setDeleteAppointmentModal({ open: true, appointment });
  };

  const handleConfirmDeleteAppointment = () => {
    if (deleteAppointmentModal.appointment) {
      deleteAppointment.mutate(deleteAppointmentModal.appointment.id);
    }
  };

  const handleDeleteReminder = (id: string) => {
    const reminder = reminders.find((rem) => rem.id === id);
    if (reminder) setDeleteReminderModal({ open: true, reminder });
  };

  const handleConfirmDeleteReminder = () => {
    if (deleteReminderModal.reminder) {
      deleteReminder.mutate(deleteReminderModal.reminder.id);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      {/* ✅ FULL WIDTH CONTAINER */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' }, gap: { xs: 2, sm: 0 }, mb: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: 1.5,
                backgroundColor: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarToday sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#1e293b', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                Mis Citas
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}>
                Registra y gestiona tus citas médicas
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(ROUTES.SPECIALTIES)}
            sx={{
              backgroundColor: '#06b6d4',
              color: 'white',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#0891b2',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Nueva Cita
          </Button>
        </Box>

        {/* ✅ Tabs (IGUAL A LA IMAGEN) */}
        <Box sx={{ mb: 0, overflowX: 'auto' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            TabIndicatorProps={{ style: { display: 'none' } }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-flexContainer': { gap: { xs: '4px', sm: '8px' } },
            }}
          >
            <Tab
              value="paid"
              icon={<CreditCard sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              iconPosition="start"
              label={`Citas Pagadas (${appointments.length})`}
              sx={tabStyle}
            />
            <Tab
              value="reminders"
              icon={<CalendarToday sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              iconPosition="start"
              label={`Mis Recordatorios (${reminders.length})`}
              sx={tabStyle}
            />
          </Tabs>
        </Box>

        {/* Content */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '0 8px 8px 8px',
            p: { xs: 2, md: 4 },
            minHeight: '60vh',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {activeTab === 'paid' && (
            <>
              {appointmentsLoading ? (
                <Typography>Cargando citas...</Typography>
              ) : appointments.length === 0 ? (
                <EmptyState
                  icon={<CreditCard sx={{ fontSize: 64, color: '#cbd5e1' }} />}
                  title="No tienes citas pagadas"
                  subtitle="Agenda una cita con un profesional de salud para verla aquí"
                />
              ) : (
                <Grid container spacing={3}>
                  {appointments.map((appointment) => (
                    <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                      <AppointmentCard appointment={appointment} onDelete={handleDeleteAppointment} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {activeTab === 'reminders' && (
            <>
              {remindersLoading ? (
                <Typography>Cargando recordatorios...</Typography>
              ) : reminders.length === 0 ? (
                <EmptyState
                  icon={<CalendarToday sx={{ fontSize: 64, color: '#cbd5e1' }} />}
                  title="No tienes recordatorios de citas"
                  action={
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setReminderFormOpen(true)}
                      sx={{
                        backgroundColor: '#0f172a',
                        color: 'white',
                        mt: 2,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: '#1e293b',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      Crear Recordatorio
                    </Button>
                  }
                />
              ) : (
                <Grid container spacing={3}>
                  {reminders.map((reminder) => (
                    <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                      <ReminderCard reminder={reminder} onDelete={handleDeleteReminder} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Modals */}
      <ReminderForm
        open={reminderFormOpen}
        onClose={() => setReminderFormOpen(false)}
        onSubmit={(params) => createReminder.mutate(params)}
      />

      {/* Confirm Delete Modals */}
      <ConfirmDeleteModal
        open={deleteAppointmentModal.open}
        onClose={() => setDeleteAppointmentModal({ open: false, appointment: null })}
        onConfirm={handleConfirmDeleteAppointment}
        title="¿Eliminar cita?"
        message="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
        itemName={deleteAppointmentModal.appointment?.title || ''}
      />

      <ConfirmDeleteModal
        open={deleteReminderModal.open}
        onClose={() => setDeleteReminderModal({ open: false, reminder: null })}
        onConfirm={handleConfirmDeleteReminder}
        title="¿Eliminar recordatorio?"
        message="¿Estás seguro de que deseas eliminar este recordatorio? Esta acción no se puede deshacer."
        itemName={deleteReminderModal.reminder?.title || ''}
      />

      <Footer />
    </Box>
  );
};

/* ✅ Estilo exacto pestañas como la imagen */
const tabStyle = {
  minHeight: 'auto',
  px: { xs: 2, sm: 3 },
  py: { xs: 1, sm: 1.2 },
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  fontWeight: 500,
  color: '#64748b',
  backgroundColor: '#f1f5f9',
  border: '1.5px solid transparent',
  '&.Mui-selected': {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontWeight: 600,
    border: '1.5px solid #0f172a',
  },
  '&:hover': {
    backgroundColor: '#e5e7eb',
  },
};

/* EmptyState */
const EmptyState = ({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
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
        {icon}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#1e293b', fontSize: '1.125rem' }}>
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          sx={{ color: '#64748b', textAlign: 'center', maxWidth: 400, fontSize: '0.875rem' }}
        >
          {subtitle}
        </Typography>
      )}

      {action}
    </Box>
  );
};
