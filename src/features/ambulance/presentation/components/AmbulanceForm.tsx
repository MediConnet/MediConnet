import { useState } from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Button } from '../../../../shared/ui/Button';
import { useRequestAmbulance } from '../hooks/useAmbulance';
import type { RequestAmbulanceDTO } from '../../application/request-ambulance.usecase';

export const AmbulanceForm = () => {
  const [formData, setFormData] = useState<Partial<RequestAmbulanceDTO>>({
    patientName: '',
    phone: '',
    urgency: 'medium',
  });

  const requestAmbulance = useRequestAmbulance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.patientName && formData.phone && formData.location) {
      requestAmbulance.mutate(formData as RequestAmbulanceDTO, {
        onSuccess: (data) => {
          window.location.href = `/ambulance/tracking/${data.id}`;
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del paciente"
        value={formData.patientName}
        onChange={(e) =>
          setFormData({ ...formData, patientName: e.target.value })
        }
        required
      />
      <Input
        label="Teléfono"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Urgencia
        </label>
        <select
          value={formData.urgency}
          onChange={(e) =>
            setFormData({
              ...formData,
              urgency: e.target.value as RequestAmbulanceDTO['urgency'],
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
      </div>
      <Button
        type="submit"
        isLoading={requestAmbulance.isPending}
        disabled={!formData.patientName || !formData.phone}
      >
        Solicitar Ambulancia
      </Button>
    </form>
  );
};





