import { AccessTime, CalendarToday, Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { DoctorAppointment } from "../../domain/Appointment.entity";
import type { AppointmentStatus } from "../../domain/Patient.entity";
import {
  getAppointmentsAPI,
  updateAppointmentStatusAPI,
} from "../../infrastructure/appointments.api";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { AppointmentDetailModal } from "./modals/AppointmentDetailModal";
import { CreateDiagnosisModal } from "./modals/CreateDiagnosisModal";

type ViewType = "month" | "week" | "day" | "list";

export const AppointmentsSection = () => {
  // --- ESTADOS ---
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Navegación de calendario
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  // Datos y UI
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Modales
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

  const { user } = useAuthStore();
  const { data: dashboardData } = useDoctorDashboard();

  // --- API CALLS ---

  // 1. Cargar citas desde el Backend
  const fetchAppointments = async () => {
    try {
      const data = await getAppointmentsAPI();
      setAppointments(data);
    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchAppointments();
  }, []);

  // 2. Actualizar estado (Marcar como Atendida)
  const handleStatusChange = async (
    appointmentId: string,
    newStatus: AppointmentStatus,
  ) => {
    try {
      setUpdatingStatus(true);
      const success = await updateAppointmentStatusAPI(
        appointmentId,
        newStatus,
      );

      if (success) {
        // Recargar datos globales
        await fetchAppointments();

        // Actualizar el objeto del modal abierto LOCALMENTE
        if (selectedAppointment && selectedAppointment.id === appointmentId) {
          const updatedAppt = { ...selectedAppointment, status: newStatus };

          if (updatedAppt.paymentMethodRaw === "CASH") {
            if (newStatus === "COMPLETED") {
              updatedAppt.isPaid = true;
            } else if (newStatus === "CONFIRMED") {
              updatedAppt.isPaid = false;
            }
          }

          setSelectedAppointment(updatedAppt);
        }
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado de la cita");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --- LÓGICA DE CALENDARIO ---

  // Filtros
  const getAppointmentsForDay = (dateStr: string) => {
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const getAllAppointmentsSorted = () => {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Variables auxiliares de fecha
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
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
  const daysFull = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Navegación
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

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

  // Formatos
  const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  // Handlers UI
  const handleAppointmentClick = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // --- COMPONENTES DE VISTA (RENDERS) ---

  const renderMonthView = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 (Domingo) a 6
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);
    const daysShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Rellenar final del mes
    const totalSlots = blanks.length + days.length;
    const nextMonthDays = totalSlots > 35 ? 42 - totalSlots : 35 - totalSlots;
    const nextBlanks = Array.from({ length: nextMonthDays }, (_, i) => i + 1);

    return (
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

          {blanks.map((_, i) => (
            <div
              key={`blank-${i}`}
              className="bg-gray-50 min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0"
            />
          ))}

          {days.map((d) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const isSelected = selectedDate === dateStr;
            const dayAppointments = getAppointmentsForDay(dateStr);
            const isToday =
              d === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={d}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  bg-white min-h-[120px] p-2 cursor-pointer transition-all border-r border-b border-gray-200 last:border-r-0 relative
                  ${isSelected ? "bg-blue-50 ring-2 ring-blue-500 ring-inset" : ""}
                  ${isToday && !isSelected ? "bg-yellow-50" : ""}
                  hover:bg-gray-50
                `}
              >
                <div className="flex justify-end mb-1">
                  <span
                    className={`text-sm font-semibold px-1.5 py-0.5 rounded ${isSelected ? "text-blue-700 bg-blue-100" : isToday ? "text-yellow-700 bg-yellow-100" : "text-gray-800"}`}
                  >
                    {d}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className={`text-white text-xs px-2 py-1 rounded truncate shadow-sm ${
                        apt.status === "COMPLETED"
                          ? "bg-teal-500"
                          : apt.status === "CANCELLED"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
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

          {nextBlanks.map((d) => (
            <div
              key={`next-${d}`}
              className="bg-gray-50 min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 opacity-50"
            >
              <span className="text-xs text-gray-400">{d}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Generar días de la semana
    const weekStart = new Date(currentWeek);
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      weekDays.push(d);
    }

    const timeSlots = Array.from({ length: 12 }, (_, i) => i + 7); // 7:00 - 18:00
    const todayStr = new Date().toISOString().split("T")[0];

    return (
      <div className="h-[calc(100vh-300px)] min-h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        {/* Header Semana */}
        <div className="grid grid-cols-8 border-b border-gray-200 flex-shrink-0">
          <div className="border-r border-gray-200 p-2"></div>{" "}
          {/* Esquina vacía */}
          {weekDays.map((day, i) => {
            const isToday = day.toISOString().split("T")[0] === todayStr;
            return (
              <div
                key={i}
                className={`p-2 text-center border-r border-gray-200 last:border-r-0 ${isToday ? "bg-blue-50" : ""}`}
              >
                <div className="text-xs text-gray-500 uppercase">
                  {day.toLocaleDateString("es-ES", { weekday: "short" })}
                </div>
                <div
                  className={`text-lg font-bold w-8 h-8 mx-auto rounded-full flex items-center justify-center ${isToday ? "bg-blue-600 text-white" : ""}`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid Horario */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="grid grid-cols-8">
            {/* Columna Horas */}
            <div className="border-r border-gray-200">
              {timeSlots.map((h) => (
                <div key={h} className="h-16 border-b border-gray-100 relative">
                  <span className="absolute -top-3 right-2 text-xs text-gray-500">
                    {h}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Columnas Días */}
            {weekDays.map((day, i) => {
              const dateStr = day.toISOString().split("T")[0];
              const dayAppts = getAppointmentsForDay(dateStr);

              return (
                <div key={i} className="border-r border-gray-200 relative">
                  {timeSlots.map((h) => (
                    <div
                      key={h}
                      className="h-16 border-b border-gray-100"
                    ></div>
                  ))}
                  {/* Renderizar citas absolute */}
                  {dayAppts.map((apt) => {
                    const [h, m] = apt.time.split(":").map(Number);
                    const startMin = (h - 7) * 60 + m;
                    const top = (startMin / (12 * 60)) * 100;
                    const height = (30 / (12 * 60)) * 100;

                    return (
                      <div
                        key={apt.id}
                        onClick={() => handleAppointmentClick(apt)}
                        className={`absolute left-1 right-1 p-1 text-xs rounded cursor-pointer overflow-hidden hover:z-10 hover:opacity-90 shadow-sm text-white
                                            ${apt.status === "COMPLETED" ? "bg-teal-500" : "bg-blue-500"}
                                        `}
                        style={{
                          top: `${top}%`,
                          height: `${height}%`,
                          minHeight: "20px",
                        }}
                      >
                        <span className="font-bold">{apt.time}</span>{" "}
                        {apt.patientName}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDay(selectedDate);
    const date = new Date(selectedDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7:00 - 18:00

    return (
      <div className="lg:col-span-2 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-bold capitalize">
            {date.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map((hour) => {
            const hourAppts = dayAppointments.filter(
              (a) => parseInt(a.time.split(":")[0]) === hour,
            );
            return (
              <div
                key={hour}
                className="flex border-b border-gray-100 min-h-[80px]"
              >
                <div className="w-20 p-4 text-right text-gray-500 text-sm border-r border-gray-100">
                  {hour}:00
                </div>
                <div className="flex-1 p-2 space-y-2">
                  {hourAppts.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => handleAppointmentClick(apt)}
                      className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">
                          {apt.time} - {apt.patientName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${apt.status === "COMPLETED" ? "bg-teal-200 text-teal-800" : "bg-blue-200 text-blue-800"}`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{apt.reason}</p>
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

  const renderListView = () => {
    const allAppointments = getAllAppointmentsSorted();
    return (
      <div className="lg:col-span-3 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">
            Agenda Completa ({allAppointments.length} citas)
          </h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-200">
          {allAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay citas programadas
            </div>
          ) : (
            allAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => handleAppointmentClick(apt)}
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                  <Person />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-900">
                      {apt.patientName}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${apt.status === "COMPLETED" ? "bg-teal-100 text-teal-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {apt.status === "COMPLETED"
                        ? "Atendida"
                        : apt.status === "CONFIRMED"
                          ? "Confirmada"
                          : apt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CalendarToday fontSize="inherit" />{" "}
                      {formatDateShort(apt.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <AccessTime fontSize="inherit" /> {apt.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Botones de navegación dinámicos
  const getNavLabel = () => {
    if (view === "month") return `${months[month]} ${year}`;
    if (view === "day") return formatDate(selectedDate);
    if (view === "week") {
      const start = new Date(currentWeek);
      const day = start.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + diff);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${formatDateShort(start.toISOString().split("T")[0])} - ${formatDateShort(end.toISOString().split("T")[0])}`;
    }
    return "Lista";
  };

  const handlePrev = () => {
    if (view === "month") prevMonth();
    else if (view === "week") prevWeek();
    else if (view === "day") prevDay();
  };
  const handleNext = () => {
    if (view === "month") nextMonth();
    else if (view === "week") nextWeek();
    else if (view === "day") nextDay();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Principal */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            {view !== "list" && (
              <>
                <button
                  onClick={handlePrev}
                  className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <span className="text-xl font-bold">‹</span>
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <span className="text-xl font-bold">›</span>
                </button>
              </>
            )}
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium border border-gray-300"
            >
              Hoy
            </button>
            <h2 className="text-2xl font-bold text-gray-800 ml-2 capitalize">
              {getNavLabel()}
            </h2>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["month", "week", "day", "list"] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm rounded-md transition-all font-medium ${view === v ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {v === "month"
                  ? "Mes"
                  : v === "week"
                    ? "Semana"
                    : v === "day"
                      ? "Día"
                      : "Lista"}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Principal */}
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando citas...</p>
          </div>
        ) : (
          <div
            className={`${view === "week" || view === "list" ? "p-6" : "grid grid-cols-1 lg:grid-cols-3 gap-6 p-6"}`}
          >
            {view === "month" && renderMonthView()}
            {view === "week" && renderWeekView()}
            {view === "day" && renderDayView()}
            {view === "list" && renderListView()}

            {/* Sidebar para Mes y Día */}
            {(view === "month" || view === "day") && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                  Agenda: {formatDate(selectedDate)}
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {getAppointmentsForDay(selectedDate).length === 0 ? (
                    <div className="text-center py-10">
                      <AccessTime className="text-gray-300 text-4xl mb-2" />
                      <p className="text-gray-400 text-sm">
                        No hay citas para este día
                      </p>
                    </div>
                  ) : (
                    getAppointmentsForDay(selectedDate)
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => handleAppointmentClick(apt)}
                          className="border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer bg-white group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-800 group-hover:text-blue-700">
                                {apt.patientName}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <AccessTime style={{ fontSize: 14 }} />{" "}
                                {apt.time}
                              </p>
                            </div>
                            <span
                              className={`w-3 h-3 rounded-full ${apt.status === "COMPLETED" ? "bg-teal-500" : apt.status === "CANCELLED" ? "bg-red-500" : "bg-blue-500"}`}
                            ></span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODALES --- */}

      <AppointmentDetailModal
        open={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
        onStatusChange={handleStatusChange}
        onOpenDiagnosisModal={() => setIsDiagnosisModalOpen(true)}
        loading={updatingStatus}
      />

      {selectedAppointment && (
        <CreateDiagnosisModal
          open={isDiagnosisModalOpen}
          onClose={() => setIsDiagnosisModalOpen(false)}
          appointment={selectedAppointment}
          doctorId={user?.id || ""}
          doctorName={user?.name || "Dr. Usuario"}
          onSuccess={() => {
            setIsDiagnosisModalOpen(false);
            fetchAppointments();
          }}
        />
      )}
    </>
  );
};
