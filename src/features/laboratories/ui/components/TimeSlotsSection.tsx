import { Box, Typography, Grid, Button } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { useState } from 'react';

export const TimeSlotsSection = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          Horarios disponibles *
        </Typography>
      </Box>

      <Grid container spacing={1}>
        {timeSlots.map((time) => (
          <Grid item xs={4} sm={3} key={time}>
            <Button
              variant="outlined"
              onClick={() => setSelectedTime(time)}
              fullWidth
              sx={{
                borderColor: selectedTime === time ? '#06b6d4' : '#e5e7eb',
                backgroundColor: selectedTime === time ? '#06b6d4' : 'white',
                color: selectedTime === time ? 'white' : 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#06b6d4',
                  backgroundColor: selectedTime === time ? '#0891b2' : '#f0fdfa',
                },
              }}
            >
              {time}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
        Los horarios tachados ya están reservados
      </Typography>
    </Box>
  );
};
