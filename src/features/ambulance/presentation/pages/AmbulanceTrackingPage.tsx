import { useParams } from 'react-router-dom';
import { useTrackAmbulance, useCancelAmbulance } from '../hooks/useAmbulance';
import { StatusStepper } from '../components/StatusStepper';
import { Button } from '../../../../shared/ui/Button';
import { canCancelRequest } from '../../domain/canCancelRequest.rule';
import { Map } from '../../../../shared/ui/Map';

export const AmbulanceTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading } = useTrackAmbulance(id || '');
  const cancelAmbulance = useCancelAmbulance();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!request) {
    return <div>Solicitud no encontrada</div>;
  }

  const { canCancel } = canCancelRequest(request);

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de cancelar esta solicitud?')) {
      cancelAmbulance.mutate(request.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Seguimiento de Ambulancia</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <StatusStepper currentStatus={request.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Información</h2>
          <p>
            <strong>Paciente:</strong> {request.patientName}
          </p>
          <p>
            <strong>Teléfono:</strong> {request.phone}
          </p>
          <p>
            <strong>Urgencia:</strong> {request.urgency}
          </p>
          {request.estimatedArrival && (
            <p>
              <strong>Llegada estimada:</strong>{' '}
              {new Date(request.estimatedArrival).toLocaleString('es-ES')}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Ubicación</h2>
          <Map
            latitude={request.location.latitude}
            longitude={request.location.longitude}
            className="h-64"
          />
        </div>
      </div>

      {canCancel && (
        <div className="mt-6">
          <Button variant="danger" onClick={handleCancel}>
            Cancelar Solicitud
          </Button>
        </div>
      )}
    </div>
  );
};





