import { Box, Typography, IconButton, Grid, Button } from '@mui/material';
import { CalendarToday, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';

export const DatePickerSection = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const month = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Obtener días del mes
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  
  const days: (number | null)[] = [];
  // Días del mes anterior
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  // Días del mes siguiente para completar la cuadrícula
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const isAvailable = (day: number | null) => {
    if (day === null) return false;
    // Simular días disponibles (22-27)
    return day >= 22 && day <= 27;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="subtitle2" fontWeight={600}>
          Selecciona una fecha *
        </Typography>
      </Box>
      
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="body1" fontWeight={600}>
            {monthCapitalized}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>

        <Grid container spacing={0.5}>
          {daysOfWeek.map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}>
                {day}
              </Typography>
            </Grid>
          ))}
          {days.map((day, index) => (
            <Grid item xs={12 / 7} key={index}>
              {day !== null && isAvailable(day) ? (
                <Button
                  onClick={() => setSelectedDate(day)}
                  sx={{
                    minWidth: 'auto',
                    width: '100%',
                    height: 36,
                    p: 0,
                    backgroundColor: selectedDate === day ? '#000' : '#f3f4f6',
                    color: selectedDate === day ? 'white' : 'text.primary',
                    fontWeight: selectedDate === day ? 700 : 400,
                    '&:hover': {
                      backgroundColor: selectedDate === day ? '#000' : '#e5e7eb',
                    },
                  }}
                >
                  {day}
                </Button>
              ) : (
                <Box sx={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ color: day === null ? 'transparent' : '#d1d5db' }}>
                    {day}
                  </Typography>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
