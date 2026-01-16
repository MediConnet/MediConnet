import {
  AccessTime,
  CalendarToday,
  Close,
  Email,
  Person,
  Phone,
  CheckCircle,
  Payment,
  Schedule,
  Assignment,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  generateMockAppointments,
  type DoctorAppointment,
} from "../../infrastructure/appointments.mock";
import { CreateDiagnosisModal } from "./CreateDiagnosisModal";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getDiagnosesByAppointmentMock } from "../../infrastructure/diagnoses.mock";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";

type ViewType = "month" | "week" | "day" | "list";

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onStatusChange?: (appointmentId: string, newStatus: string) => void;
  doctorId: string;
  doctorName: string;
  onOpenDiagnosisModal?: () => void;
}

const AppointmentDetailModal = ({
  open,
  onClose,
  appointment,
  onStatusChange,
  doctorId,
  doctorName,
  onOpenDiagnosisModal,
}: AppointmentDetailModalProps) => {
  const [currentStatus, setCurrentStatus] = useState<string>("pending");
  const [hasDiagnosis, setHasDiagnosis] = useState(false);

  useEffect(() => {
    if (appointment) {
      // Mapear estados: pending -> Programada, paid -> Pagada, completed -> Atendida
      setCurrentStatus(appointment.status || "pending");
      // Verificar si ya tiene diagnóstico
      const diagnosis = getDiagnosesByAppointmentMock(appointment.id);
      setHasDiagnosis(!!diagnosis);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(appointment.id, newStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "paid":
        return "bg-green-100 text-green-700 border-green-300";
      case "completed":
        return "bg-teal-100 text-teal-700 border-teal-300";
      case "finalizada":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Fijo) */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de la Cita
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Información del paciente y motivo de consulta
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <Close />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Información del Paciente */}
          <div className="bg-teal-50 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                <Person className="text-teal-600 text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg truncate">
                  {appointment.patientName}
                </h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Email className="text-xs shrink-0" />
                    <span className="truncate">{appointment.patientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="text-xs shrink-0" />
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
                <p className="text-lg font-bold text-gray-900">
                  {appointment.time}
                </p>
              </div>
            </div>
          </div>

          {/* Razón de la Cita */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Motivo de la consulta
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {appointment.reason}
            </p>
          </div>

          {/* Información de pago (solo lectura) */}
          {(appointment.paymentMethod || appointment.status === "paid") && (
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Información de pago
              </h4>
              <div className="flex items-center gap-2">
                <Payment className="text-green-600" />
                <span className="text-gray-700">
                  Pagada con {appointment.paymentMethod === "card" ? "Tarjeta" : "Efectivo"}
                </span>
              </div>
              {appointment.price && (
                <p className="text-sm text-gray-600 mt-1">
                  Monto: ${appointment.price.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Estado de la cita - Solo "Atendida" como acción */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Marcar como atendida
            </h4>
            <div className="space-y-2">
              {currentStatus === "completed" ? (
                <div className={`flex items-center gap-3 p-3 rounded-lg border-2 ${getStatusColor("completed")}`}>
                  <CheckCircle className="text-teal-600" />
                  <span className="font-medium text-teal-700">
                    Cita Atendida
                  </span>
                  <CheckCircle className="text-teal-600 ml-auto" />
                </div>
              ) : (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-all text-left"
                >
                  <CheckCircle className="text-gray-400" />
                  <span className="font-medium text-gray-700">
                    Marcar como Atendida
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer (Fijo) */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center shrink-0">
          <div>
            {currentStatus === "completed" && (
              <button
                onClick={() => {
                  if (onOpenDiagnosisModal) {
                    onOpenDiagnosisModal();
                  }
                }}
                className={`px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                  hasDiagnosis
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Assignment />
                {hasDiagnosis ? "Ver/Editar Diagnóstico" : "Crear Diagnóstico"}
              </button>
            )}
          </div>
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
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const authStore = useAuthStore();
  const { user } = authStore;
  const { data } = useDoctorDashboard();

  // Cargar citas desde localStorage o generar mock
  useEffect(() => {
    const savedAppointments = localStorage.getItem("doctor_appointments");
    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments);
        // Verificar si hay citas válidas (futuras)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hasValidAppointments = parsed.some((apt: DoctorAppointment) => {
          const [year, month, day] = apt.date.split("-").map(Number);
          const appointmentDate = new Date(year, month - 1, day);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate >= today;
        });
        
        if (hasValidAppointments && parsed.length > 0) {
          setAppointments(parsed);
        } else {
          // Si no hay citas válidas, regenerar mocks
          const mockAppointments = generateMockAppointments();
          setAppointments(mockAppointments);
          localStorage.setItem("doctor_appointments", JSON.stringify(mockAppointments));
        }
      } catch (error) {
        // Si hay error al parsear, generar mocks nuevos
        const mockAppointments = generateMockAppointments();
        setAppointments(mockAppointments);
        localStorage.setItem("doctor_appointments", JSON.stringify(mockAppointments));
      }
    } else {
      // No hay citas guardadas, generar mocks
      const mockAppointments = generateMockAppointments();
      setAppointments(mockAppointments);
      localStorage.setItem("doctor_appointments", JSON.stringify(mockAppointments));
    }
  }, []);

  // Marcar citas como atendidas automáticamente cuando termina la hora
  useEffect(() => {
    const checkAndMarkCompleted = () => {
      setAppointments((currentAppointments) => {
        const now = new Date();
        const updated = currentAppointments.map((apt) => {
          // Solo procesar citas que no estén ya completadas
          if (apt.status === "completed") {
            return apt;
          }

          // Parsear fecha y hora de la cita
          const [year, month, day] = apt.date.split("-").map(Number);
          const [hours, minutes] = apt.time.split(":").map(Number);
          const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
          
          // Obtener duración de consulta (por defecto 30 minutos)
          const consultationDuration = data?.doctor?.consultationDuration || 30;
          const appointmentEndTime = new Date(appointmentDateTime.getTime() + consultationDuration * 60000);

          // Si la hora de la cita ya pasó (incluyendo la duración), marcarla como atendida
          if (now >= appointmentEndTime && apt.status === "paid") {
            return { ...apt, status: "completed" as any };
          }

          return apt;
        });

        // Solo actualizar si hubo cambios
        const hasChanges = updated.some((apt, index) => apt.status !== currentAppointments[index].status);
        if (hasChanges) {
          localStorage.setItem("doctor_appointments", JSON.stringify(updated));
          window.dispatchEvent(new Event("appointments-updated"));
          return updated;
        }

        return currentAppointments;
      });
    };

    // Verificar cada minuto
    const interval = setInterval(checkAndMarkCompleted, 60000);
    
    // Verificar inmediatamente al cargar
    checkAndMarkCompleted();

    return () => clearInterval(interval);
  }, [data?.doctor?.consultationDuration]);

  // Usar las citas del estado (que se actualizan cuando cambia el estado)
  const mockAppointments = appointments.length > 0 ? appointments : generateMockAppointments();

  // Debug: mostrar cuántas citas hay
  useEffect(() => {
    console.log("Total citas cargadas:", mockAppointments.length);
    console.log("Citas:", mockAppointments);
  }, [mockAppointments.length]);

  // Filtrar citas: solo mostrar las del día de hoy en adelante (fecha y hora)
  const activeAppointments = mockAppointments.filter((apt) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Inicio del día de hoy
    
    // Parsear fecha de la cita
    const [year, month, day] = apt.date.split("-").map(Number);
    const appointmentDate = new Date(year, month - 1, day);
    appointmentDate.setHours(0, 0, 0, 0);

    // Si la fecha es anterior a hoy, excluirla
    if (appointmentDate < today) return false;

    // Si la fecha es hoy, verificar la hora
    if (appointmentDate.getTime() === today.getTime()) {
      const now = new Date();
      const [hours, minutes] = apt.time.split(":").map(Number);
      const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
      
      // Si la hora ya pasó y la cita está completada, excluirla
      // Pero si está pendiente o pagada, mostrarla aunque la hora haya pasado (puede estar en curso)
      if (appointmentDateTime < now && apt.status === "completed") {
        return false;
      }
    }

    return true;
  });

  // Obtener citas del día seleccionado
  const appointmentsForDate = activeAppointments.filter(
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

  const daysShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const daysShortWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]; // Para vista semanal que empieza en lunes
  const daysFull = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
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

  // Obtener citas de un día específico (solo activas, sin finalizadas)
  const getAppointmentsForDay = (dateStr: string) => {
    return activeAppointments.filter((apt) => apt.date === dateStr);
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

  // Obtener días de la semana (empezando en lunes)
  const getWeekDays = () => {
    const weekStart = new Date(currentWeek);
    // Ajustar para que la semana empiece en lunes (getDay() devuelve 0 para domingo)
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retroceder 6 días; si no, ajustar a lunes
    weekStart.setDate(weekStart.getDate() + diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Obtener todas las citas ordenadas por fecha y hora (solo activas)
  const getAllAppointmentsSorted = () => {
    return [...activeAppointments].sort((a, b) => {
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

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
    );
    
    // Actualizar el estado inmediatamente
    setAppointments(updatedAppointments);
    localStorage.setItem("doctor_appointments", JSON.stringify(updatedAppointments));
    
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new Event("appointments-updated"));
    
    // Si se marca como completada, mantener el modal abierto para permitir crear diagnóstico
    // Actualizar el appointment seleccionado si es el mismo
    if (selectedAppointment && selectedAppointment.id === appointmentId) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus as any });
    }
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
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(d).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const dayAppointments = getAppointmentsForDay(dateStr);
          const today = isToday(d);

          return (
            <div
              key={d}
              onClick={() => setSelectedDate(dateStr)}
              className={`
                bg-white min-h-[120px] p-2 cursor-pointer transition-all border-r border-b border-gray-200 last:border-r-0 relative
                ${
                  isSelected ? "bg-blue-50 ring-2 ring-blue-500 ring-inset" : ""
                }
                ${today && !isSelected ? "bg-yellow-50" : ""}
                hover:bg-gray-50 hover:shadow-inner
              `}
            >
              <div className="flex items-center justify-end mb-1">
                <span
                  className={`
                    text-sm font-semibold px-1.5 py-0.5 rounded
                    ${
                      isSelected
                        ? "text-blue-700 bg-blue-100"
                        : today
                        ? "text-yellow-700 bg-yellow-100"
                        : "text-gray-800"
                    }
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

  // Generar horas del día (07:00 - 18:00)
  const generateTimeSlots = () => {
    const hours = [];
    for (let i = 7; i <= 18; i++) {
      hours.push(i);
    }
    return hours;
  };

  // Obtener posición de una cita en el calendario
  const getAppointmentPosition = (appointment: DoctorAppointment) => {
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const duration = data?.doctor?.consultationDuration || 30;
    const endMinutes = startMinutes + duration;
    
    // Convertir a porcentaje relativo al día (7:00 - 18:00 = 11 horas = 660 minutos)
    const dayStartMinutes = 7 * 60; // 7:00 AM
    const dayTotalMinutes = 11 * 60; // 11 horas
    
    const topPercent = ((startMinutes - dayStartMinutes) / dayTotalMinutes) * 100;
    const heightPercent = (duration / dayTotalMinutes) * 100;
    
    return { top: topPercent, height: heightPercent };
  };

  // Verificar si es la hora actual
  const isCurrentTime = (hour: number) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return currentHour === hour && currentMinute < 30;
  };

  // Obtener posición de la línea de tiempo actual
  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;
    
    const dayStartMinutes = 7 * 60;
    const dayTotalMinutes = 11 * 60;
    
    if (currentHour < 7 || currentHour > 18) return null;
    
    const topPercent = ((currentMinutes - dayStartMinutes) / dayTotalMinutes) * 100;
    return topPercent;
  };

  // Renderizar mini calendario
  const renderMiniCalendar = () => {
    const today = new Date();
    const currentDate = new Date(currentWeek);
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);
    
    const miniDaysShort = ["L", "M", "X", "J", "V", "S", "D"]; // Lunes a Domingo

    // Obtener el primer día de la semana actual (lunes)
    const weekStart = new Date(currentWeek);
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + diff);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentWeek(newDate);
            }}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ‹
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentWeek(newDate);
            }}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {miniDaysShort.map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square"></div>
          ))}
          {days.map((day) => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday =
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();
            const isInCurrentWeek = (() => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              return date >= weekStart && date <= weekEnd;
            })();

            return (
              <button
                key={day}
                onClick={() => {
                  const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  setCurrentWeek(newDate);
                  setSelectedDate(dateStr);
                }}
                className={`
                  aspect-square text-xs rounded flex items-center justify-center
                  ${isToday ? "bg-blue-600 text-white font-bold" : ""}
                  ${!isToday && isInCurrentWeek ? "bg-blue-100 text-blue-700 font-semibold" : ""}
                  ${!isToday && !isInCurrentWeek ? "text-gray-700 hover:bg-gray-100" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar vista de Semana estilo Google Calendar
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const timeSlots = generateTimeSlots();
    const currentTimePos = getCurrentTimePosition();
    const today = new Date();

    return (
      <div className="flex gap-4 h-[calc(100vh-300px)] min-h-[600px]">
        {/* Sidebar izquierdo con mini calendario */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {renderMiniCalendar()}
          
          {/* Lista de calendarios (opcional, similar a Google Calendar) */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">Mis Calendarios</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-700">Citas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vista semanal principal */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Headers de días */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDays.map((day, index) => {
              const dateStr = day.toISOString().split("T")[0];
              const isToday = dateStr === today.toISOString().split("T")[0];
              const dayAppointments = getAppointmentsForDay(dateStr);
              // Obtener el día de la semana (0=domingo, 1=lunes, etc.) y ajustar para el array que empieza en lunes
              const dayOfWeek = day.getDay();
              const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convertir domingo (0) a 6, y lunes (1) a 0

              return (
                <div
                  key={index}
                  className={`
                    border-r border-gray-200 last:border-r-0 p-3 text-center
                    ${isToday ? "bg-blue-50" : "bg-gray-50"}
                  `}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {daysShortWeek[dayIndex]}
                  </div>
                  <div
                    className={`
                      text-lg font-bold w-8 h-8 mx-auto rounded-full flex items-center justify-center
                      ${isToday ? "bg-blue-600 text-white" : "text-gray-800"}
                    `}
                  >
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dayAppointments.length} cita{dayAppointments.length !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendario con horarios */}
          <div className="relative overflow-y-auto" style={{ height: "calc(100% - 80px)" }}>
            <div className="grid grid-cols-7">
              {/* Columna de horas */}
              <div className="border-r border-gray-200">
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-gray-100 h-16 relative"
                    style={{ minHeight: "64px" }}
                  >
                    <div className="absolute -top-3 -left-12 text-xs text-gray-500 pr-2 text-right w-10">
                      {hour}:00
                    </div>
                  </div>
                ))}
              </div>

              {/* Columnas de días */}
              {weekDays.map((day, dayIndex) => {
                const dateStr = day.toISOString().split("T")[0];
                const dayAppointments = getAppointmentsForDay(dateStr);
                const isToday = dateStr === today.toISOString().split("T")[0];

                return (
                  <div
                    key={dayIndex}
                    className="border-r border-gray-200 last:border-r-0 relative"
                  >
                    {/* Línea de tiempo actual */}
                    {isToday && currentTimePos !== null && (
                      <div
                        className="absolute left-0 right-0 z-10"
                        style={{ top: `${currentTimePos}%` }}
                      >
                        <div className="h-0.5 bg-red-500 relative">
                          <div className="absolute -left-1 -top-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    )}

                    {/* Slot de horas */}
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="border-b border-gray-100 h-16 relative"
                        style={{ minHeight: "64px" }}
                      >
                        {/* Media hora */}
                        <div className="absolute top-8 left-0 right-0 h-px bg-gray-100"></div>
                      </div>
                    ))}

                    {/* Citas posicionadas */}
                    {dayAppointments.map((apt) => {
                      const position = getAppointmentPosition(apt);
                      const statusColors: Record<string, string> = {
                        pending: "bg-blue-500",
                        paid: "bg-green-500",
                        completed: "bg-teal-500",
                        cancelled: "bg-red-500",
                      };
                      const bgColor = statusColors[apt.status] || "bg-blue-500";

                      return (
                        <div
                          key={apt.id}
                          onClick={() => handleAppointmentClick(apt)}
                          className={`
                            absolute left-1 right-1 ${bgColor} text-white text-xs p-1.5 rounded cursor-pointer
                            hover:opacity-90 transition-opacity shadow-sm z-20
                          `}
                          style={{
                            top: `${position.top}%`,
                            height: `${position.height}%`,
                          }}
                          title={`${apt.time} - ${apt.patientName}`}
                        >
                          <div className="font-semibold truncate">{apt.time}</div>
                          <div className="truncate">{apt.patientName}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
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
                            <div className="font-semibold mb-1">
                              {apt.patientName}
                            </div>
                            <div className="text-sm opacity-90">
                              {apt.reason}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 py-2">
                          Sin citas
                        </div>
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
              {allAppointments.length} cita
              {allAppointments.length !== 1 ? "s" : ""} programada
              {allAppointments.length !== 1 ? "s" : ""}
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
                          <h4 className="font-bold text-gray-800">
                            {apt.patientName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarToday className="text-xs" />
                            <span>{formatDateShort(apt.date)}</span>
                            <AccessTime className="text-xs ml-2" />
                            <span>{apt.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{apt.reason}</p>
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
                <p className="text-gray-500 text-sm font-medium">
                  No hay citas programadas
                </p>
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
        label: `Semana del ${formatDateShort(
          getWeekDays()[0].toISOString().split("T")[0]
        )} - ${formatDateShort(getWeekDays()[6].toISOString().split("T")[0])}`,
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
              <button
                onClick={() => {
                  localStorage.removeItem("doctor_appointments");
                  const newMocks = generateMockAppointments();
                  setAppointments(newMocks);
                  localStorage.setItem("doctor_appointments", JSON.stringify(newMocks));
                  window.location.reload();
                }}
                className="px-4 py-2 text-sm text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium shadow-sm border border-red-300"
                title="Regenerar citas mock (solo desarrollo)"
              >
                🔄 Regenerar Mocks
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

        <div className={`${view === "week" ? "p-6" : "grid grid-cols-1 lg:grid-cols-3 gap-6 p-6"}`}>
          {/* Vista Principal según el tipo seleccionado */}
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
          {view === "list" && renderListView()}

          {/* Panel lateral (solo para Mes y Día, no para Semana que ya tiene su propio sidebar) */}
          {view !== "list" && view !== "week" && (
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
                              <span className="font-medium">
                                {appointment.time}
                              </span>
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
                  <p className="text-gray-500 text-sm font-medium">
                    No hay citas programadas
                  </p>
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
        onStatusChange={handleStatusChange}
        doctorId={user?.id || "doc-1"}
        doctorName={user?.name || "Dr. Usuario"}
        onOpenDiagnosisModal={() => setIsDiagnosisModalOpen(true)}
      />
      
      {/* Modal de Crear Diagnóstico - Renderizado fuera del modal de cita para que tenga z-index correcto */}
      {selectedAppointment && (
        <CreateDiagnosisModal
          open={isDiagnosisModalOpen}
          onClose={() => {
            setIsDiagnosisModalOpen(false);
          }}
          appointment={selectedAppointment}
          doctorId={user?.id || "doc-1"}
          doctorName={user?.name || "Dr. Usuario"}
          onSuccess={() => {
            setIsDiagnosisModalOpen(false);
            // Refrescar el modal de cita para actualizar el estado del botón
            if (selectedAppointment) {
              const updated = { ...selectedAppointment };
              setSelectedAppointment(null);
              setTimeout(() => setSelectedAppointment(updated), 100);
            }
          }}
        />
      )}
    </>
  );
};
