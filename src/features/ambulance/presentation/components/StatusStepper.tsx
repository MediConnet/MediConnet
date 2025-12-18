import { AmbulanceStatus } from '../../domain/AmbulanceStatus.enum';

interface StatusStepperProps {
  currentStatus: AmbulanceStatus;
}

const statusSteps = [
  { status: AmbulanceStatus.PENDING, label: 'Pendiente' },
  { status: AmbulanceStatus.ASSIGNED, label: 'Asignada' },
  { status: AmbulanceStatus.IN_TRANSIT, label: 'En camino' },
  { status: AmbulanceStatus.ARRIVED, label: 'Llegó' },
  { status: AmbulanceStatus.COMPLETED, label: 'Completada' },
];

export const StatusStepper = ({ currentStatus }: StatusStepperProps) => {
  const currentIndex = statusSteps.findIndex(
    (step) => step.status === currentStatus
  );

  return (
    <div className="flex items-center justify-between">
      {statusSteps.map((step, index) => (
        <div key={step.status} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              index <= currentIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <span className="ml-2 text-sm">{step.label}</span>
          {index < statusSteps.length - 1 && (
            <div
              className={`w-16 h-1 mx-4 ${
                index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};





