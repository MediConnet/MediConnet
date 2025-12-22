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
  { label: 'Farmacias', icon: <PharmacyIcon />, path: ROUTES.SEARCH },
  { label: 'Laboratorios', icon: <LabIcon />, path: ROUTES.SEARCH },
  { label: 'Ambulancias', icon: <AmbulanceIcon />, path: ROUTES.REQUEST_AMBULANCE },
  { label: 'Insumos', icon: <SuppliesIcon />, path: ROUTES.SEARCH },
];

export const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
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

