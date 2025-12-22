// NOTE: Barra de navegación principal con links a diferentes secciones
// TODO: Agregar indicador visual de página activa más destacado

import { Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  LocalHospital as DoctorsIcon,
  Business as PharmacyIcon,
  Science as LabIcon,
  LocalShipping as AmbulanceIcon,
  Inventory as SuppliesIcon,
} from '@mui/icons-material';
import { ROUTES } from '../../app/config/constants';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: <HomeIcon />, path: ROUTES.HOME },
  { label: 'Médicos', icon: <DoctorsIcon />, path: ROUTES.SEARCH },
  { label: 'Farmacias', icon: <PharmacyIcon />, path: ROUTES.PHARMACIES },
  { label: 'Laboratorios', icon: <LabIcon />, path: ROUTES.LABORATORIES },
  { label: 'Ambulancias', icon: <AmbulanceIcon />, path: ROUTES.AMBULANCES },
  { label: 'Insumos', icon: <SuppliesIcon />, path: ROUTES.SEARCH },
];

export const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    // Para farmacias, también considerar las rutas hijas
    if (path === ROUTES.PHARMACIES) {
      return location.pathname.startsWith('/pharmacies') || location.pathname.startsWith('/pharmacy-branch');
    }
    // Para laboratorios, también considerar las rutas hijas
    if (path === ROUTES.LABORATORIES) {
      return location.pathname.startsWith('/laboratories');
    }
    // Para ambulancias, también considerar las rutas hijas
    if (path === ROUTES.AMBULANCES) {
      return location.pathname.startsWith('/ambulances');
    }
    return location.pathname === path;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap', // Para que se ajuste en pantallas pequeñas
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Button
            key={item.path}
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            size="small"
            sx={{
              color: active ? '#0e7490' : '#4b5563', // Azul oscuro si activo, gris oscuro si inactivo
              backgroundColor: active ? '#e0f2fe' : 'transparent', // Fondo azul claro si activo
              fontWeight: active ? 600 : 400,
              textTransform: 'none',
              fontSize: '0.875rem',
              py: 0.5,
              px: 1.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: active ? '#e0f2fe' : 'rgba(0, 0, 0, 0.04)',
              },
              '& .MuiSvgIcon-root': {
                color: active ? '#0e7490' : '#4b5563',
              },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
};

