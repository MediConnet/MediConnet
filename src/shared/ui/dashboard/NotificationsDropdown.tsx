import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AccessTime, Person, Close, CalendarToday } from "@mui/icons-material";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
}

interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

export const NotificationsDropdown = ({
  open,
  onClose,
  appointments,
}: NotificationsDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Obtener solo las citas de hoy
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments
    .filter((apt) => apt.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Citas de Hoy</h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <Close className="text-sm" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {todayAppointments.length} cita{todayAppointments.length !== 1 ? "s" : ""} programada{todayAppointments.length !== 1 ? "s" : ""} para hoy
        </p>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[500px]">
        {todayAppointments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <Person className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 text-base">
                        {apt.patientName}
                      </h4>
                      <div className="flex items-center gap-2 px-2 py-1 bg-teal-50 rounded-lg">
                        <AccessTime className="text-teal-600 text-sm" />
                        <span className="font-semibold text-teal-700 text-sm">{apt.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {apt.reason}
                    </p>
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
            <p className="text-gray-500 text-sm font-medium mb-1">
              No hay citas programadas para hoy
            </p>
            <p className="text-gray-400 text-xs">
              Tus citas de hoy aparecerán aquí
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => {
            onClose();
            navigate("/doctor/dashboard?tab=appointments");
          }}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
        >
          {todayAppointments.length > 0 ? "Ver calendario completo" : "Ver todas las citas"}
        </button>
      </div>
    </div>
  );
};

