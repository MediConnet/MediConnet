import {
  Close,
  Description,
  LocalPharmacy,
  Save,
  Subject,
} from "@mui/icons-material";
import { useState } from "react";
import type { DoctorAppointment } from "../../../domain/Appointment.entity";
import {
  createDiagnosisAPI,
  type DiagnosisParams,
} from "../../../infrastructure/diagnoses.api";

interface CreateDiagnosisModalProps {
  open: boolean;
  onClose: () => void;
  appointment: DoctorAppointment;
  doctorId: string;
  doctorName: string;
  onSuccess: () => void;
}

export const CreateDiagnosisModal = ({
  open,
  onClose,
  appointment,
  onSuccess,
}: CreateDiagnosisModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DiagnosisParams>({
    title: "",
    description: "",
    prescription: "",
    notes: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await createDiagnosisAPI(appointment.id, formData);

      if (success) {
        onSuccess();
        setFormData({
          title: "",
          description: "",
          prescription: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error creando diagnóstico:", error);
      alert("Error al guardar el diagnóstico. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header, Form, Footer */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Description className="text-blue-600" />
              Crear Diagnóstico Médico
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Paciente:{" "}
              <span className="font-semibold text-gray-700">
                {appointment.patientName}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Subject fontSize="small" /> Título / Motivo Principal
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Infección respiratoria aguda"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción y Observaciones
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describa los síntomas..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <LocalPharmacy fontSize="small" className="text-green-600" />{" "}
              Receta / Plan de Tratamiento
            </label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows={4}
              placeholder="Ej: Paracetamol..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50/30 border-green-200"
            />
          </div>
        </form>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Guardando...</span>
            ) : (
              <>
                <Save fontSize="small" /> Guardar Diagnóstico
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
