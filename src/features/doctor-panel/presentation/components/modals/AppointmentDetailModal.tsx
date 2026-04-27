import {
  AccessTime,
  Assignment,
  CheckCircle,
  Close,
  Email,
  LocationOn,
  Payment,
  Person,
  Phone,
  Undo,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { DoctorAppointment } from "../../../domain/Appointment.entity";
import type { AppointmentStatus } from "../../../domain/Patient.entity";

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onOpenDiagnosisModal: () => void;
  loading?: boolean;
}

export const AppointmentDetailModal = ({
  open,
  onClose,
  appointment,
  onStatusChange,
  onOpenDiagnosisModal,
  loading = false,
}: AppointmentDetailModalProps) => {
  // Estado local para el status general
  const [currentStatus, setCurrentStatus] =
    useState<AppointmentStatus>("CONFIRMED");
  const [isPaidLocal, setIsPaidLocal] = useState<boolean>(false);

  useEffect(() => {
    if (appointment) {
      setCurrentStatus(appointment.status);
      setIsPaidLocal(appointment.isPaid);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleToggleStatus = () => {
    if (!appointment.id) {
      console.error("ID de cita no disponible");
      return;
    }

    const newStatus = currentStatus === "COMPLETED" ? "CONFIRMED" : "COMPLETED";

    if (appointment.paymentMethodRaw === "CASH") {
      if (newStatus === "COMPLETED") {
        setIsPaidLocal(true);
      } else if (newStatus === "CONFIRMED") {
        setIsPaidLocal(false);
      }
    }

    setCurrentStatus(newStatus);

    onStatusChange(appointment.id, newStatus);
  };

  const handleOpenLocation = () => {
    const mapsUrl = appointment.locationGoogleMapsUrl;
    if (mapsUrl) {
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (
      typeof appointment.locationLatitude === "number" &&
      typeof appointment.locationLongitude === "number"
    ) {
      window.open(
        `https://www.google.com/maps?q=${appointment.locationLatitude},${appointment.locationLongitude}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "COMPLETED":
        return "bg-teal-100 text-teal-700 border-teal-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "COMPLETED":
        return "Atendida";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de la Cita
            </h2>
            <div
              className={`mt-2 inline-flex px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(currentStatus)}`}
            >
              {getStatusLabel(currentStatus)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Info Paciente */}
          <div className="bg-teal-50 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                {appointment.patientAvatar ? (
                  <img
                    src={appointment.patientAvatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Person className="text-teal-600 text-2xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg truncate">
                  {appointment.patientName}
                </h3>
                <div className="mt-2 space-y-1">
                  {appointment.patientEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Email className="text-xs shrink-0" />
                      <span className="truncate">
                        {appointment.patientEmail}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="text-xs shrink-0" />
                    <span>{appointment.patientPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hora */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AccessTime className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha y Hora</p>
                <p className="text-lg font-bold text-gray-900">
                  {appointment.date} - {appointment.time}
                </p>
              </div>
            </div>
          </div>

          {/* Motivo */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Motivo de la consulta
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {appointment.reason || <span className="text-gray-400 italic">No especificado</span>}
            </p>
            {appointment.notes && (
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">
                  Observaciones
                </h5>
                <p className="text-gray-700 leading-relaxed">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Información de Pago */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Información de pago
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Payment className="text-gray-500" />
                <span className="text-gray-700 font-medium">
                  {appointment.paymentMethod}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  ${appointment.price.toFixed(2)}
                </p>
                {/* Chip de estado de pago DINÁMICO usando isPaidLocal */}
                <span
                  className={`text-xs px-2 py-0.5 rounded ${isPaidLocal ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {isPaidLocal ? "Pagado" : "Pendiente"}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones - Botón de Toggle */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Acciones</h4>

            <button
              onClick={handleToggleStatus}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg border-2 transition-all font-bold cursor-pointer shadow-sm
                ${
                  currentStatus === "COMPLETED"
                    ? "border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                    : "border-teal-500 text-teal-600 hover:bg-teal-50"
                }
                ${loading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {loading ? (
                "Actualizando..."
              ) : currentStatus === "COMPLETED" ? (
                <>
                  <Undo fontSize="small" />
                  Desmarcar como Atendida
                </>
              ) : (
                <>
                  <CheckCircle fontSize="small" />
                  Marcar como Atendida
                </>
              )}
            </button>

            {(appointment.locationGoogleMapsUrl ||
              (typeof appointment.locationLatitude === "number" &&
                typeof appointment.locationLongitude === "number")) && (
              <button
                onClick={handleOpenLocation}
                className="w-full mt-3 flex items-center justify-center gap-3 p-3 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all font-bold cursor-pointer shadow-sm"
              >
                <LocationOn fontSize="small" />
                Ver ubicación del médico
              </button>
            )}

            <p className="text-xs text-gray-400 mt-2 text-center">
              {currentStatus === "COMPLETED"
                ? "Si desmarcas, la cita volverá a estado Confirmada."
                : "Al marcar como atendida, se habilitará el diagnóstico."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center shrink-0 gap-3">
          {/* Botón Diagnóstico - Solo visible si está completada */}
          <div className="flex-1">
            {currentStatus === "COMPLETED" && (
              <button
                onClick={onOpenDiagnosisModal}
                className="w-full px-6 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md hover:shadow-lg transform active:scale-95 duration-150"
              >
                <Assignment fontSize="small" />
                Diagnóstico
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
