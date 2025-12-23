import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';

interface SimpleCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export const SimpleCalendar = ({ selectedDate, onSelectDate }: SimpleCalendarProps) => {
  // Estado para navegar meses (empezamos hoy)
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Nombres de días y meses en Español
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const daysShort = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  // Lógica para generar los días
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Funciones de navegación
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Generar array de días vacíos y días reales
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header del Calendario */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
          <ChevronLeft />
        </button>
        <span className="font-bold text-gray-800">
          {months[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
          <ChevronRight />
        </button>
      </div>

      {/* Grid de Días */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Cabecera (Lu, Ma, Mi...) */}
        {daysShort.map(d => (
          <div key={d} className="text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}

        {/* Días vacíos previos */}
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}

        {/* Días del mes */}
        {days.map(d => {
          // Formato YYYY-MM-DD para comparar
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          
          return (
            <button
              key={d}
              onClick={() => onSelectDate(dateStr)}
              className={`
                text-sm py-2 rounded-lg transition-colors
                ${isSelected 
                  ? 'bg-[#06B6D4] text-white font-bold shadow-md' 
                  : 'text-gray-700 hover:bg-blue-50'}
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};