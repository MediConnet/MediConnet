// NOTE: Componente de menú de usuario con opción de logout
// TODO: Agregar más opciones del menú (perfil, configuración, etc.)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuthStore } from '../../app/store/auth.store';

export const UserMenu = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { user, logout } = authStore;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // NOTE: Cerrar sesión y redirigir al login
    logout();
    handleClose();
    navigate('/login');
  };

  // NOTE: Si no hay usuario, no mostrar el menú
  if (!user) {
    return null;
  }

  // NOTE: Obtener iniciales del nombre para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {getInitials(user.name)}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* NOTE: Información del usuario */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        
        {/* TODO: Agregar más opciones del menú */}
        <MenuItem onClick={handleClose}>
          <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
          Mi Perfil
        </MenuItem>
        
        <Divider />
        
        {/* NOTE: Opción de logout */}
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  );
};

