import { useState } from 'react';
import { SearchFilters } from '../components/SearchFilters';
import { ProviderCard } from '../components/ProviderCard';
import { useSearch } from '../hooks/useSearch';
import { SearchFiltersVO } from '../../domain/search-filters.vo';
import type { Provider } from '../../application/search-providers.usecase';

export const SearchPage = () => {
  const [filters, setFilters] = useState<SearchFiltersVO>(
    new SearchFiltersVO({})
  );
  const { data: providers, isLoading } = useSearch(filters);

  const handleSearch = (newFilters: SearchFiltersVO) => {
    setFilters(newFilters);
  };

  const handleSelectProvider = (provider: Provider) => {
    if (provider.type === 'doctor') {
      window.location.href = `/doctor/${provider.id}`;
    }
    // Lógica para ambulancia
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Buscar Médicos / Ambulancias</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SearchFilters onSearch={handleSearch} />
        </div>
        
        <div className="md:col-span-2">
          {isLoading ? (
            <p>Cargando...</p>
          ) : providers && providers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onSelect={handleSelectProvider}
                />
              ))}
            </div>
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>
      </div>
    </div>
  );
};





