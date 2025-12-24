import type { Provider } from '../../application/search-providers.usecase';
import { Button } from '../../../../shared/ui/Button';

interface ProviderCardProps {
  provider: Provider;
  onSelect: (provider: Provider) => void;
}

export const ProviderCard = ({ provider, onSelect }: ProviderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{provider.name}</h3>
      {provider.specialty && (
        <p className="text-gray-600 text-sm">{provider.specialty}</p>
      )}
      <div className="mt-2">
        <span className="text-yellow-500">★</span>
        <span className="ml-1">{provider.rating.toFixed(1)}</span>
      </div>
      <Button
        variant="primary"
        size="sm"
        className="mt-4"
        onClick={() => onSelect(provider)}
      >
        Ver detalles
      </Button>
    </div>
  );
};





