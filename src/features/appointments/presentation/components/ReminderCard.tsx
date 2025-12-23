import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { CalendarToday, AccessTime, LocationOn, Delete, Notifications } from '@mui/icons-material';
import type { Reminder } from '../../domain/Reminder.entity';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete?: (id: string) => void;
}

export const ReminderCard = ({ reminder, onDelete }: ReminderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
            {reminder.title}
          </Typography>
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(reminder.id)}
              sx={{ color: '#ef4444' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 18, color: '#06b6d4' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {formatDate(reminder.date)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 18, color: '#06b6d4' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {reminder.time}
            </Typography>
          </Box>

          {reminder.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 18, color: '#06b6d4' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {reminder.location}
              </Typography>
            </Box>
          )}

          {reminder.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontStyle: 'italic' }}>
              {reminder.notes}
            </Typography>
          )}

          {reminder.pushNotificationEnabled && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1,
                px: 1.5,
                py: 0.5,
                backgroundColor: '#e0f2fe',
                borderRadius: 1,
                width: 'fit-content',
              }}
            >
              <Notifications sx={{ fontSize: 16, color: '#06b6d4' }} />
              <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 500 }}>
                Notificación push activada
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

