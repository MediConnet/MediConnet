import { useState } from "react";
import { AccessTime, Person, Close, Email, Phone, CalendarToday } from "@mui/icons-material";
import { generateMockAppointments, type DoctorAppointment } from "../../infrastructure/appointments.mock";

type ViewType = "month" | "week" | "day" | "list";

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
}

const AppointmentDetailModal = ({ open, onClose, appointment }: AppointmentDetailModalProps) => {
  if (!appointment) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalle de la Cita</h2>
            <p className="text-sm text-gray-500 mt-1">Información del paciente y motivo de consulta</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información del Paciente */}
          <div className="bg-teal-50 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Person className="text-teal-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Email className="text-xs" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="text-xs" />
                    <span>{appointment.patientPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hora de la Cita */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AccessTime className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hora agendada</p>
                <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
              </div>
            </div>
          </div>

          {/* Razón de la Cita */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Motivo de la consulta</h4>
            <p className="text-gray-700 leading-relaxed">{appointment.reason}</p>
          </div>

          {/* Notas adicionales */}
          {appointment.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Notas adicionales</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export const AppointmentsSection = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Generar citas mock basadas en el mes actual
  const mockAppointments = generateMockAppointments();

  // Obtener citas del día seleccionado
  const appointmentsForDate = mockAppointments.filter(
    (apt) => apt.date === selectedDate
  );

  // Generar días del mes
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  // Días del mes siguiente para completar la cuadrícula
  const nextMonthDays = 42 - (blanks.length + days.length);
  const nextMonthBlanks = Array.from({ length: nextMonthDays }, (_, i) => i);

  const daysShort = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
  const daysFull = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const prevWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const nextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const prevDay = () => {
    const newDay = new Date(currentDay);
    newDay.setDate(newDay.getDate() - 1);
    setCurrentDay(newDay);
    setSelectedDate(newDay.toISOString().split("T")[0]);
  };

  const nextDay = () => {
    const newDay = new Date(currentDay);
    newDay.setDate(newDay.getDate() + 1);
    setCurrentDay(newDay);
    setSelectedDate(newDay.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setCurrentWeek(today);
    setCurrentDay(today);
    setSelectedDate(today.toISOString().split("T")[0]);
  };

  // Obtener citas de un día específico
  const getAppointmentsForDay = (dateStr: string) => {
    return mockAppointments.filter((apt) => apt.date === dateStr);
  };

  // Verificar si un día es hoy
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const formatDate = (dateString: string) => {
    // Parsear la fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  // Obtener días de la semana
  const getWeekDays = () => {
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Obtener todas las citas ordenadas por fecha y hora
  const getAllAppointmentsSorted = () => {
    return [...mockAppointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const handleAppointmentClick = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Renderizar vista de Mes
  const renderMonthView = () => (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-7 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {daysShort.map((d) => (
          <div
            key={d}
            className="bg-gradient-to-b from-gray-50 to-white text-sm font-bold text-gray-700 py-3 text-center border-r border-gray-200 last:border-r-0"
          >
            {d}
          </div>
        ))}

        {blanks.map((_, i) => {
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          const prevMonthDay = prevMonthLastDay - blanks.length + i + 1;
          return (
            <div
              key={`blank-${i}`}
              className="bg-gray-50 min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0"
            >
              <span className="text-xs text-gray-400">{prevMonthDay}</span>
            </div>
          );
        })}

        {days.map((d) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const dayAppointments = getAppointmentsForDay(dateStr);
          const today = isToday(d);

          return (
            <div
              key={d}
              onClick={() => setSelectedDate(dateStr)}
              className={`
                bg-white min-h-[120px] p-2 cursor-pointer transition-all border-r border-b border-gray-200 last:border-r-0 relative
                ${isSelected ? "bg-blue-50 ring-2 ring-blue-500 ring-inset" : ""}
                ${today && !isSelected ? "bg-yellow-50" : ""}
                hover:bg-gray-50 hover:shadow-inner
              `}
            >
              <div className="flex items-center justify-end mb-1">
                <span
                  className={`
                    text-sm font-semibold px-1.5 py-0.5 rounded
                    ${isSelected ? "text-blue-700 bg-blue-100" : today ? "text-yellow-700 bg-yellow-100" : "text-gray-800"}
                  `}
                >
                  {d}
                </span>
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md truncate cursor-pointer hover:bg-blue-600 transition-colors shadow-sm"
                    title={`${apt.time} - ${apt.patientName}`}
                  >
                    {apt.time} {apt.patientName}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-blue-600 font-medium px-2">
                    +{dayAppointments.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {nextMonthBlanks.map((_, i) => {
          const nextMonthDay = i + 1;
          return (
            <div
              key={`next-${i}`}
              className="bg-gray-50 min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 opacity-50"
            >
              <span className="text-xs text-gray-400">{nextMonthDay}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Renderizar vista de Semana
  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="lg:col-span-2">
        <div className="grid grid-cols-7 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {weekDays.map((day, index) => {
            const dateStr = day.toISOString().split("T")[0];
            const dayAppointments = getAppointmentsForDay(dateStr);
            const isSelected = selectedDate === dateStr;
            const isTodayDate = dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={index}
                className={`
                  border-r border-gray-200 last:border-r-0 min-h-[400px]
                  ${isSelected ? "bg-blue-50 ring-2 ring-blue-500 ring-inset" : "bg-white"}
                  ${isTodayDate && !isSelected ? "bg-yellow-50" : ""}
                `}
              >
                <div
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    p-3 border-b border-gray-200 cursor-pointer
                    ${isSelected ? "bg-blue-100" : "bg-gray-50"}
                  `}
                >
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {daysFull[day.getDay()]}
                  </div>
                  <div
                    className={`
                      text-lg font-bold
                      ${isSelected ? "text-blue-700" : isTodayDate ? "text-yellow-700" : "text-gray-800"}
                    `}
                  >
                    {day.getDate()}
                  </div>
                </div>
                <div className="p-2 space-y-2">
                  {dayAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => handleAppointmentClick(apt)}
                        className="bg-blue-500 text-white text-xs p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        <div className="font-semibold">{apt.time}</div>
                        <div className="truncate">{apt.patientName}</div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar vista de Día
  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDay(selectedDate);
    const date = new Date(selectedDate);
    const isTodayDate = selectedDate === new Date().toISOString().split("T")[0];

    // Horas del día (8:00 AM - 6:00 PM)
    const hours = Array.from({ length: 11 }, (_, i) => i + 8);

    return (
      <div className="lg:col-span-2">
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div
            className={`
              p-4 border-b-2 border-gray-200
              ${isTodayDate ? "bg-yellow-50" : "bg-gray-50"}
            `}
          >
            <div className="text-sm font-medium text-gray-500 mb-1">
              {daysFull[date.getDay()]}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
            </div>
          </div>
          <div className="bg-white max-h-[500px] overflow-y-auto">
            {hours.map((hour) => {
              const hourAppointments = dayAppointments.filter(
                (apt) => parseInt(apt.time.split(":")[0]) === hour
              );

              return (
                <div key={hour} className="border-b border-gray-100 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 text-right">
                      <div className="text-sm font-semibold text-gray-700">
                        {hour}:00
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {hourAppointments.length > 0 ? (
                        hourAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => handleAppointmentClick(apt)}
                            className="bg-blue-500 text-white p-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            <div className="font-semibold mb-1">{apt.patientName}</div>
                            <div className="text-sm opacity-90">{apt.reason}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 py-2">Sin citas</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar vista de Lista
  const renderListView = () => {
    const allAppointments = getAllAppointmentsSorted();

    return (
      <div className="lg:col-span-3">
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 p-4 border-b-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Todas las Citas</h3>
            <p className="text-sm text-gray-500 mt-1">
              {allAppointments.length} cita{allAppointments.length !== 1 ? "s" : ""} programada{allAppointments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="bg-white max-h-[600px] overflow-y-auto">
            {allAppointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {allAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => handleAppointmentClick(apt)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Person className="text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-gray-800">{apt.patientName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarToday className="text-xs" />
                            <span>{formatDateShort(apt.date)}</span>
                            <AccessTime className="text-xs ml-2" />
                            <span>{apt.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{apt.reason}</p>
                        {apt.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">{apt.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarToday className="text-gray-400 text-3xl" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No hay citas programadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Determinar qué botones de navegación mostrar
  const getNavigationButtons = () => {
    if (view === "week") {
      return {
        prev: prevWeek,
        next: nextWeek,
        label: `Semana del ${formatDateShort(getWeekDays()[0].toISOString().split("T")[0])} - ${formatDateShort(getWeekDays()[6].toISOString().split("T")[0])}`,
      };
    }
    if (view === "day") {
      return {
        prev: prevDay,
        next: nextDay,
        label: formatDate(selectedDate),
      };
    }
    return {
      prev: prevMonth,
      next: nextMonth,
      label: `${months[month]} ${year}`,
    };
  };

  const navButtons = getNavigationButtons();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header del Calendario */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={navButtons.prev}
                className="p-2.5 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors shadow-sm"
              >
                <span className="text-xl font-bold">‹</span>
              </button>
              <button
                onClick={navButtons.next}
                className="p-2.5 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors shadow-sm"
              >
                <span className="text-xl font-bold">›</span>
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium shadow-sm"
              >
                Hoy
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {navButtons.label}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors ${
                  view === "month"
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors ${
                  view === "week"
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setView("day")}
                className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors ${
                  view === "day"
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition-colors ${
                  view === "list"
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Vista Principal según el tipo seleccionado */}
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
          {view === "list" && renderListView()}

          {/* Panel lateral (solo para Mes, Semana y Día) */}
          {view !== "list" && (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Citas del {formatDate(selectedDate)}
              </h3>

              {appointmentsForDate.length > 0 ? (
                <div className="space-y-3">
                  {appointmentsForDate
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer bg-white"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Person className="text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 mb-1">
                              {appointment.patientName}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <AccessTime className="text-xs" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AccessTime className="text-gray-400 text-3xl" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No hay citas programadas</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Cita */}
      <AppointmentDetailModal
        open={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
      />
    </>
  );
};
