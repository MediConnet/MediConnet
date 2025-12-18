import { useState } from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Button } from '../../../../shared/ui/Button';
import { SearchFiltersVO } from '../../domain/search-filters.vo';

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersVO) => void;
}

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = new SearchFiltersVO({
      query,
      specialty: specialty || undefined,
    });
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Buscar"
        placeholder="Nombre, especialidad..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Input
        label="Especialidad"
        placeholder="Cardiología, Pediatría..."
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      />
      <Button type="submit">Buscar</Button>
    </form>
  );
};





