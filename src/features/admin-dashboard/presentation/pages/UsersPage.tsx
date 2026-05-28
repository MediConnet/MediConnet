import { Group, Block, CheckCircle, Delete } from "@mui/icons-material";
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
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getUsersAPI, toggleUserStatusAPI, updateUserAPI, deleteUserAPI } from "../../infrastructure/users.api";
import type { User } from "../../domain/user.entity";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import { PROVIDER_TYPE_LABELS } from "../../../../shared/config/domain.constants";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "provider" | "clinic">("all");
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { appointments: adminAppointments, notificationsViewAllPath } = useAdminNotificationsLayout();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const loadUsers = useCallback(async (page: number, limit: number, role: string, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUsersAPI({
        page,
        limit,
        role: role === "all" ? undefined : role,
        search: search || undefined,
      });
      setUsers(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(paginationModel.page + 1, paginationModel.pageSize, roleFilter, searchText);
  }, [paginationModel, roleFilter, searchText, loadUsers]);

  const handleRoleFilterChange = (newRole: string) => {
    setRoleFilter(newRole as any);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      await toggleUserStatusAPI(userId, !user.isActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      );
      setSnackbar({
        open: true,
        message: `Usuario ${!user.isActive ? 'activado' : 'desactivado'} correctamente`,
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Error al cambiar estado del usuario',
        severity: 'error'
      });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // Llamar a la API para eliminar el usuario usando el endpoint correcto
      await deleteUserAPI(userToDelete.id);

      // Eliminar de la lista local
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setSnackbar({
        open: true,
        message: "Usuario eliminado correctamente",
        severity: 'success'
      });
    } catch (err: any) {
      console.error("Error al eliminar usuario:", err);
      setSnackbar({
        open: true,
        message: err.message || 'Error al eliminar usuario. Verifica que tengas permisos de administrador.',
        severity: 'error'
      });
    }
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
      setSnackbar({
        open: true,
        message: "Usuario actualizado correctamente",
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Error al actualizar usuario',
        severity: 'error'
      });
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

  const columns: GridColDef<User>[] = [
    {
      field: "displayName",
      headerName: "Usuario",
      width: 300,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ height: "100%", py: 1 }}>
          <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40, flexShrink: 0 }}>
            {getUserDisplayName(params.row).charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {getUserDisplayName(params.row)}
            </Typography>
            {(params.row.tipo || params.row.additionalInfo) && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {params.row.additionalInfo || getRoleLabel(params.row.role, params.row.tipo)}
              </Typography>
            )}
          </Box>
        </Stack>
      ),
    },
    {
      field: "role",
      headerName: "Rol",
      width: 160,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={getRoleLabel(params.row.role, params.row.tipo)}
          color={params.row.role.toLowerCase() === "admin" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "isActive",
      headerName: "Estado",
      width: 120,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          icon={params.row.isActive ? <CheckCircle /> : <Block />}
          label={params.row.isActive ? "Activo" : "Inactivo"}
          color={params.row.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 300,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          <Button size="small" variant="outlined" onClick={() => handleEdit(params.row)}>
            Editar
          </Button>
          <Button
            size="small"
            variant={params.row.isActive ? "outlined" : "contained"}
            color={params.row.isActive ? "error" : "success"}
            onClick={() => handleToggleStatus(params.row.id)}
          >
            {params.row.isActive ? "Desactivar" : "Activar"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteClick(params.row)}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <DashboardLayout 
      role="ADMIN" 
      userProfile={CURRENT_ADMIN}
      appointments={adminAppointments}
      notificationsVariant="professional"
      notificationsViewAllPath={notificationsViewAllPath}
    >
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
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{ flex: 1 }}
              disabled={loading}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Usuario</InputLabel>
              <Select
                value={roleFilter}
                label="Tipo de Usuario"
                onChange={(e) => handleRoleFilterChange(e.target.value)}
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

        {/* DataGrid */}
        <Box sx={{ height: 600, width: "100%", bgcolor: "white", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            rowHeight={72}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            }}
          />
        </Box>

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
                      {(Object.keys(PROVIDER_TYPE_LABELS) as Array<keyof typeof PROVIDER_TYPE_LABELS>)
                        .filter((k) => k !== "clinic")
                        .map((type) => (
                          <MenuItem key={type} value={type}>{PROVIDER_TYPE_LABELS[type]}</MenuItem>
                        ))}
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

        {/* Modal de confirmación de eliminación */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: 'error.main' }}>
            ¿Eliminar Usuario?
          </DialogTitle>
          <DialogContent>
            {userToDelete && (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Estás a punto de eliminar al siguiente usuario:
                </Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {getUserDisplayName(userToDelete)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {userToDelete.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rol:</strong> {getRoleLabel(userToDelete.role, userToDelete.tipo)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleConfirmDelete}
              startIcon={<Delete />}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

