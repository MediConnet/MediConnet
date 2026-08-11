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
} from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getUsersAPI, toggleUserStatusAPI, updateUserAPI, deleteUserAPI } from "../../infrastructure/users.api";
import type { User } from "../../domain/user.entity";
import { getUserFriendlyMessage } from "../../../../shared/lib/api-error";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import { PROVIDER_TYPE_LABELS } from "../../../../shared/config/domain.constants";
import {
  DataTable,
  TableToolbar,
  TablePageLayout,
} from "../../../../shared/components/DataTable";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { FEEDBACK } from "../../../../shared/constants/feedback-messages";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { appointments: adminAppointments, notificationsViewAllPath } = useAdminNotificationsLayout();
  const feedback = useFeedbackStore();

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
      setError(getUserFriendlyMessage(err, { fallback: "No fue posible cargar los usuarios." }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(paginationModel.page + 1, paginationModel.pageSize, roleFilter, searchText);
  }, [paginationModel, roleFilter, searchText, loadUsers]);

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    try {
      await toggleUserStatusAPI(userId, !user.isActive);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, `Usuario ${!user.isActive ? "activado" : "desactivado"} correctamente`);
    } catch (err: any) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, getUserFriendlyMessage(err, { fallback: "No fue posible cambiar el estado." }));
    }
  };

  const handleEdit = (user: User) => { setSelectedUser(user); setIsEditModalOpen(true); };
  const handleDeleteClick = (user: User) => { setUserToDelete(user); setIsDeleteModalOpen(true); };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserAPI(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      feedback.showFeedback("success", FEEDBACK.SUCCESS.DELETE.title, FEEDBACK.SUCCESS.DELETE.message);
    } catch (err: any) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, getUserFriendlyMessage(err, { fallback: "No fue posible eliminar el usuario." }));
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      await updateUserAPI(selectedUser.id, { name: selectedUser.name, email: selectedUser.email, role: selectedUser.role, tipo: selectedUser.tipo });
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
    } catch (err: any) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, getUserFriendlyMessage(err, { fallback: "No fue posible actualizar el usuario." }));
    }
  };

  const getRoleLabel = (role: string, tipo?: string) => {
    const r = role.toLowerCase();
    if (r === "admin") return "Administrador";
    if (r === "clinic" || r === "clinica") return "Clínica";
    if (tipo === "doctor") return "Médico";
    if (tipo === "pharmacy") return "Farmacia";
    if (tipo === "laboratory" || tipo === "lab") return "Laboratorio";
    if (tipo === "ambulance") return "Ambulancia";
    if (tipo === "supplies") return "Insumos Médicos";
    if (tipo === "clinica") return "Clínica";
    return "Proveedor";
  };

  const getUserDisplayName = (user: User) =>
    user.displayName || user.name || user.clinic?.name || user.provider?.commercialName || "Sin nombre";

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
          <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
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
          <Button size="small" variant="outlined" onClick={() => handleEdit(params.row)}>Editar</Button>
          <Button
            size="small"
            variant={params.row.isActive ? "outlined" : "contained"}
            color={params.row.isActive ? "error" : "success"}
            onClick={() => handleToggleStatus(params.row.id)}
          >
            {params.row.isActive ? "Desactivar" : "Activar"}
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(params.row)} startIcon={<Delete />}>
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
      <TablePageLayout>
        <TableToolbar
          title="Administración de Usuarios"
          subtitle="Gestiona usuarios administradores y servicios"
          titleIcon={<Group sx={{ fontSize: 32 }} />}
          searchValue={searchText}
          searchPlaceholder="Buscar por nombre o email..."
          onSearchChange={handleSearchChange}
          filters={[
            {
              key: "role",
              label: "Tipo de Usuario",
              value: roleFilter,
              onChange: handleRoleFilterChange,
              minWidth: 180,
              options: [
                { value: "all", label: "Todos" },
                { value: "admin", label: "Administradores" },
                { value: "provider", label: "Proveedores" },
                // Oculto: módulo de clínicas fuera de uso (no se borra)
                // { value: "clinic", label: "Clínicas" },
              ],
            },
          ]}
          sx={{ mb: 3 }}
        />

        <DataTable<User>
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          error={error}
          rowHeight={72}
          emptyTitle="Sin usuarios"
          emptyDescription="No se encontraron usuarios con los filtros aplicados."
        />

        <Dialog open={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }} maxWidth="sm" fullWidth>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField fullWidth label="Nombre" value={selectedUser.name || selectedUser.displayName || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
                <TextField fullWidth label="Email" value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select value={selectedUser.role} label="Rol"
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}>
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="provider">Proveedor</MenuItem>
                    {/* Oculto: módulo de clínicas fuera de uso (no se borra) */}
                    {/* <MenuItem value="clinic">Clínica</MenuItem> */}
                    <MenuItem value="patient">Paciente</MenuItem>
                  </Select>
                </FormControl>
                {selectedUser.role.toLowerCase() === "provider" && (
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Servicio</InputLabel>
                    <Select value={selectedUser.tipo || ""} label="Tipo de Servicio"
                      onChange={(e) => setSelectedUser({ ...selectedUser, tipo: e.target.value as any })}>
                      {(Object.keys(PROVIDER_TYPE_LABELS) as Array<keyof typeof PROVIDER_TYPE_LABELS>)
                        .filter((k) => k !== "clinica")
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
            <Button onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveEdit}>Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: "error.main" }}>¿Eliminar Usuario?</DialogTitle>
          <DialogContent>
            {userToDelete && (
              <Box>
                <Typography variant="body1" gutterBottom>Estás a punto de eliminar al siguiente usuario:</Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography variant="body2"><strong>Nombre:</strong> {getUserDisplayName(userToDelete)}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {userToDelete.email}</Typography>
                  <Typography variant="body2"><strong>Rol:</strong> {getRoleLabel(userToDelete.role, userToDelete.tipo)}</Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete} startIcon={<Delete />}>Eliminar</Button>
          </DialogActions>
        </Dialog>
      </TablePageLayout>
    </DashboardLayout>
  );
};
