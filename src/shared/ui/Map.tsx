import { useEffect, useRef } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

/**
 * Componente wrapper para mapas (Google Maps / Mapbox)
 * Por ahora es un placeholder - implementar según la librería elegida
 */
export const Map = ({
  latitude,
  longitude,
  zoom = 15,
  className = '',
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aquí se implementaría la inicialización del mapa
    // Ejemplo con Google Maps o Mapbox
    if (mapRef.current) {
      // TODO: Inicializar mapa
      console.log('Mapa inicializado en:', { latitude, longitude, zoom });
    }
  }, [latitude, longitude, zoom]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full bg-gray-200 rounded-lg ${className}`}
    >
      {/* Placeholder del mapa */}
      <div className="flex items-center justify-center h-full text-gray-500">
        Mapa: {latitude}, {longitude}
      </div>
    </div>
  );
};





