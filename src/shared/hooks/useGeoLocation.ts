import { useState, useEffect } from 'react';

interface GeoLocation {
  latitude: number;
  longitude: number;
  error?: string;
}

/**
 * Hook para obtener la ubicación geográfica del usuario
 */
export const useGeoLocation = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: 0,
        longitude: 0,
        error: 'Geolocalización no soportada',
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setLocation({
          latitude: 0,
          longitude: 0,
          error: error.message,
        });
        setLoading(false);
      }
    );
  }, []);

  return { location, loading };
};





