// NOTE: Barra de navegación principal con links a diferentes secciones
// TODO: Agregar indicador visual de página activa más destacado

import {
  LocalShipping as AmbulanceIcon,
  LocalHospital as DoctorsIcon,
  Home as HomeIcon,
  Science as LabIcon,
  Business as PharmacyIcon,
  Inventory as SuppliesIcon,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/config/constants';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: <HomeIcon />, path: ROUTES.HOME },
  { label: 'Médicos', icon: <DoctorsIcon />, path: ROUTES.SPECIALTIES },
  { label: 'Farmacias', icon: <PharmacyIcon />, path: ROUTES.PHARMACIES },
  { label: 'Laboratorios', icon: <LabIcon />, path: ROUTES.LABORATORIES },
  { label: 'Ambulancias', icon: <AmbulanceIcon />, path: ROUTES.AMBULANCES },
  { label: 'Insumos', icon: <SuppliesIcon />, path: ROUTES.SUPPLIES },
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
    // Para insumos, también considerar las rutas hijas
    if (path === ROUTES.SUPPLIES) {
      return location.pathname.startsWith('/supplies');
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
              color: active ? '#0e7490' : '#4b5563',
              backgroundColor: active ? '#e0f2fe' : 'transparent',
              fontWeight: active ? 600 : 400,
              textTransform: 'none',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: 0.5,
              px: { xs: 1, sm: 1.5 },
              borderRadius: 1,
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                backgroundColor: active ? '#e0f2fe' : 'rgba(0, 0, 0, 0.04)',
              },
              '& .MuiSvgIcon-root': {
                color: active ? '#0e7490' : '#4b5563',
                fontSize: { xs: 16, sm: 18 },
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

