import { AccessTime, Close, Person } from "@mui/icons-material";
import { useEffect, useState } from "react"; // ✅ Importamos useEffect
import { type Doctor } from "../../../doctors/domain/Doctor.entity";
import { SimpleCalendar } from "./SimpleCalendar";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

export const AppointmentModal = ({
  isOpen,
  onClose,
  doctor,
}: AppointmentModalProps) => {
  // Estados del flujo
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    symptoms: "",
  });

  // ✅ NUEVO: Función para limpiar todo el formulario
  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({
      patientName: "",
      patientPhone: "",
      symptoms: "",
    });
  };

  // ✅ NUEVO: Este "Efecto" vigila la variable isOpen.
  // Cada vez que el modal se ABRE (isOpen cambia a true), limpiamos el formulario.
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePayment = () => {
    // 1. Mostrar Alerta de Simulación
    alert("¡Cita agendada con éxito!");

    // 2. Limpiar formulario y estados
    resetForm();

    // 3. Cerrar el modal
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up my-auto">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Agendar Cita</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. INFO DOCTOR & PRECIO */}
          <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white p-2 rounded-full h-12 w-12 flex items-center justify-center text-blue-500 font-bold text-xl">
              {doctor.name.charAt(4)}
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Consulta</p>
              <p className="text-lg font-bold text-[#06B6D4]">
                ${doctor.consultationFee?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 2. CALENDARIO (Siempre visible) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecciona una fecha *
            </label>
            <SimpleCalendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            />
          </div>

          {/* 3. HORARIOS (Solo si hay fecha) */}
          {selectedDate && (
            <div className="animate-fade-in-down">
              <div className="flex items-center gap-2 mb-2">
                <AccessTime className="text-gray-400" fontSize="small" />
                <label className="text-sm font-semibold text-gray-700">
                  Horarios disponibles *
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      py-2 text-sm rounded-lg border transition-all
                      ${
                        selectedTime === time
                          ? "bg-[#06B6D4] text-white border-[#06B6D4] font-bold shadow-md"
                          : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. FORMULARIO PACIENTE (Solo si hay hora) */}
          {selectedTime && (
            <div className="animate-fade-in-down bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Person className="text-gray-400" fontSize="small" />
                <h4 className="font-semibold text-gray-900">
                  Datos del paciente
                </h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium ml-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    placeholder="Ej: Rodrigo Salazar"
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium ml-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, patientPhone: e.target.value })
                    }
                    placeholder="099..."
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium ml-1">
                    Síntomas (Opcional)
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData({ ...formData, symptoms: e.target.value })
                    }
                    placeholder="Describe brevemente el motivo..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER (BOTÓN PAGAR) --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handlePayment}
            disabled={
              !selectedDate ||
              !selectedTime ||
              !formData.patientName ||
              !formData.patientPhone
            }
            className={`
              w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg cursor-pointer
              ${
                !selectedDate || !selectedTime || !formData.patientName
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-[#06B6D4] hover:bg-[#0891b2] hover:shadow-blue-200"
              }
            `}
          >
            Continuar al Pago - ${doctor.consultationFee?.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};
