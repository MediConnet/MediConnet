import { Group, Block, CheckCircle } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getUsersAPI, toggleUserStatusAPI, updateUserAPI } from "../../infrastructure/users.api";
import type { User } from "../../domain/user.entity";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "provider" | "clinic">("all");
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios desde la API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsersAPI();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => {
        const userRole = u.role.toLowerCase();
        if (roleFilter === "admin") {
          return userRole === "admin";
        } else if (roleFilter === "provider") {
          return userRole === "provider" || u.provider !== undefined;
        } else if (roleFilter === "clinic") {
          return userRole === "clinic" || u.clinic !== undefined;
        }
        return true;
      });
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          (u.name || u.displayName || '').toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          (u.clinic?.name || '').toLowerCase().includes(searchLower) ||
          (u.provider?.commercialName || '').toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [users, roleFilter, searchText]);

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      await toggleUserStatusAPI(userId, !user.isActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Error al cambiar estado del usuario');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      await updateUserAPI(selectedUser.id, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        tipo: selectedUser.tipo,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar usuario');
    }
  };

  const getRoleLabel = (role: string, tipo?: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower === "admin") return "Administrador";
    if (roleLower === "clinic") return "Clínica";
    if (tipo === "doctor") return "Médico";
    if (tipo === "pharmacy") return "Farmacia";
    if (tipo === "lab") return "Laboratorio";
    if (tipo === "ambulance") return "Ambulancia";
    if (tipo === "supplies") return "Insumos Médicos";
    return "Proveedor";
  };

  const getUserDisplayName = (user: User) => {
    return user.displayName || user.name || user.clinic?.name || user.provider?.commercialName || 'Sin nombre';
  };

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Group sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Administración de Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona usuarios administradores y servicios
            </Typography>
          </Box>
        </Stack>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Box mb={4}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ flex: 1 }}
              disabled={loading}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Usuario</InputLabel>
              <Select
                value={roleFilter}
                label="Tipo de Usuario"
                onChange={(e) => setRoleFilter(e.target.value as any)}
                disabled={loading}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="admin">Administradores</MenuItem>
                <MenuItem value="provider">Proveedores</MenuItem>
                <MenuItem value="clinic">Clínicas</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Tabla de usuarios */}
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron usuarios
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                          {getUserDisplayName(user).charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{getUserDisplayName(user)}</Typography>
                          {(user.tipo || user.additionalInfo) && (
                            <Typography variant="caption" color="text.secondary">
                              {user.additionalInfo || getRoleLabel(user.role, user.tipo)}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role, user.tipo)}
                        color={user.role.toLowerCase() === "admin" ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.isActive ? <CheckCircle /> : <Block />}
                        label={user.isActive ? "Activo" : "Inactivo"}
                        color={user.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant={user.isActive ? "outlined" : "contained"}
                          color={user.isActive ? "error" : "success"}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.isActive ? "Desactivar" : "Activar"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal de edición */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={selectedUser.name || selectedUser.displayName || ''}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={selectedUser.role}
                    label="Rol"
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value as any })
                    }
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="provider">Proveedor</MenuItem>
                    <MenuItem value="clinic">Clínica</MenuItem>
                    <MenuItem value="patient">Paciente</MenuItem>
                  </Select>
                </FormControl>
                {selectedUser.role.toLowerCase() === "provider" && (
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Servicio</InputLabel>
                    <Select
                      value={selectedUser.tipo || ""}
                      label="Tipo de Servicio"
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, tipo: e.target.value as "doctor" | "lab" | "supplies" | "pharmacy" | "ambulance" | undefined })
                      }
                    >
                      <MenuItem value="doctor">Médico</MenuItem>
                      <MenuItem value="pharmacy">Farmacia</MenuItem>
                      <MenuItem value="lab">Laboratorio</MenuItem>
                      <MenuItem value="ambulance">Ambulancia</MenuItem>
                      <MenuItem value="supplies">Insumos Médicos</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

