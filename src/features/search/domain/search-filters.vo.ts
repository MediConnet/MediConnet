/**
 * Value Object para filtros de búsqueda
 */
export interface SearchFilters {
  query?: string;
  specialty?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius?: number; // en km
  };
  type?: 'doctor' | 'ambulance';
  minRating?: number;
  availableNow?: boolean;
}

export class SearchFiltersVO {
  constructor(private filters: SearchFilters) {}

  getQuery(): string | undefined {
    return this.filters.query;
  }

  getSpecialty(): string | undefined {
    return this.filters.specialty;
  }

  getLocation(): SearchFilters['location'] {
    return this.filters.location;
  }

  getType(): 'doctor' | 'ambulance' | undefined {
    return this.filters.type;
  }

  toParams(): Record<string, any> {
    return {
      ...this.filters,
      location: this.filters.location
        ? `${this.filters.location.latitude},${this.filters.location.longitude}`
        : undefined,
    };
  }
}





