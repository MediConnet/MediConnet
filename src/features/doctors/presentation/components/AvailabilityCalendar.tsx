import { Availability } from '../../domain/Availability.entity';
import { Button } from '../../../../shared/ui/Button';

interface AvailabilityCalendarProps {
  availabilities: Availability[];
  onSelect: (availability: Availability) => void;
}

export const AvailabilityCalendar = ({
  availabilities,
  onSelect,
}: AvailabilityCalendarProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Horarios disponibles</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availabilities
          .filter((av) => av.isAvailable)
          .map((availability) => (
            <Button
              key={availability.id}
              variant="outline"
              size="sm"
              onClick={() => onSelect(availability)}
            >
              {new Date(availability.date).toLocaleDateString('es-ES')}{' '}
              {availability.startTime}
            </Button>
          ))}
      </div>
    </div>
  );
};





