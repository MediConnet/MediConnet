import { useEffect, useRef } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
  className?: string;
  height?: number | string;
}

/**
 * Componente wrapper para mapas (Google Maps / Mapbox)
 * Por ahora es un placeholder - implementar según la librería elegida
 */
export const Map = ({
  latitude,
  longitude,
  zoom = 15,
  address,
  className = '',
  height = 300,
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

  // URL para abrir en Google Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: height,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.300',
        position: 'relative',
        bgcolor: 'grey.100',
        ...(className && { className }),
      }}
    >
      {/* Placeholder del mapa con mejor diseño */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.200',
          position: 'relative',
        }}
      >
        <LocationOn sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Mapa: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Typography>
        {address && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, textAlign: 'center', px: 2 }}>
            {address}
          </Typography>
        )}
        <Link
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 600,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Ver en Google Maps
        </Link>
      </Box>
    </Box>
  );
};





