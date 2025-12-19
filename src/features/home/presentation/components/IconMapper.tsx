// NOTE: Mapeo de nombres de íconos a componentes de Material UI
// TODO: Agregar más íconos según sea necesario

import {
  LocationOn,
  AccessTime,
  Verified,
  Security,
  LocalHospital,
  Business,
  Science,
  LocalShipping,
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

const iconMap: Record<string, SvgIconComponent> = {
  LocationOn,
  AccessTime,
  Verified,
  Security,
  LocalHospital,
  Business,
  Science,
  LocalShipping,
};

interface IconMapperProps {
  iconName: string;
  sx?: object;
}

/**
 * Componente para mapear nombres de íconos a componentes de Material UI
 */
export const IconMapper = ({ iconName, sx }: IconMapperProps) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    // Fallback a un ícono por defecto si no se encuentra
    return <LocationOn sx={sx} />;
  }

  return <IconComponent sx={sx} />;
};

