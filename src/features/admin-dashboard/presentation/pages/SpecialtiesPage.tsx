import {
  Add,
  Edit,
  Delete,
  LocalHospital,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useAdminSpecialties } from "../hooks/useAdminSpecialties";
import type { Specialty } from "../../domain/specialty.entity";

const CURRENT_ADMIN = {
  name: "Administrador",
  roleLabel: "Administrador",
  initials: "AD",
  isActive: true,
};

const COLOR_OPTIONS = [
  '#4CAF50', '#F44336', '#FF9800', '#E91E63', '#00BCD4',
  '#2196F3', '#9C27B0', '#3F51B5', '#009688', '#795548',
  '#FF5722', '#607D8B', '#00ACC1', '#8BC34A', '#E53935',
  '#AB47BC', '#26A69A', '#5C6BC0', '#42A5F5', '#66BB6A',
];

export const SpecialtiesPage = () => {
  const { specialties, loading, error, total, setPage, setPageSize, createSpecialty, updateSpecialty, deleteSpecialty, clearError } = useAdminSpecialties();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color_hex: "#4CAF50",
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setPageSize(model.pageSize);
  };

  const handleCreate = () => {
    setEditingSpecialty(null);
    setFormData({ name: "", description: "", color_hex: "#4CAF50" });
    setIsModalOpen(true);
  };

  const handleEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormData({
      name: specialty.name,
      description: specialty.description || "",
      color_hex: specialty.color_hex || "#4CAF50",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta especialidad?")) {
      try {
        await deleteSpecialty(id);
        setSnackbar({ open: true, message: "Especialidad eliminada correctamente", severity: 'success' });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err?.message || err?.response?.data?.message || "Error al eliminar la especialidad",
          severity: 'error'
        });
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: "El nombre es requerido", severity: 'warning' });
      return;
    }
    if (formData.name.trim().length < 3) {
      setSnackbar({ open: true, message: "El nombre debe tener al menos 3 caracteres", severity: 'warning' });
      return;
    }
    try {
      setSaving(true);
      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, {
          name: formData.name,
          description: formData.description,
          color_hex: formData.color_hex,
        });
        setSnackbar({ open: true, message: "Especialidad actualizada correctamente", severity: 'success' });
      } else {
        await createSpecialty({
          name: formData.name,
          description: formData.description,
          color_hex: formData.color_hex,
        });
        setSnackbar({ open: true, message: "Especialidad creada correctamente", severity: 'success' });
      }
      setIsModalOpen(false);
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const columns: GridColDef<Specialty>[] = [
    {
      field: "color",
      headerName: "Color",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Specialty>) => (
        <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: params.row.color_hex || '#ccc', border: "2px solid", borderColor: "grey.200" }} />
      ),
    },
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 200 },
    {
      field: "description",
      headerName: "Descripción",
      flex: 1,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<Specialty>) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.row.description || "-"}
        </Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "Creada",
      width: 130,
      renderCell: (params: GridRenderCellParams<Specialty>) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.created_at ? new Date(params.row.created_at).toLocaleDateString() : "-"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Specialty>) => (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: "100%" }}>
          <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: "primary.main" }}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)} sx={{ color: "error.main" }}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (loading && specialties.length === 0) {
    return (
      <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
        <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
          <Typography>Cargando especialidades...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              Especialidades Médicas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona las especialidades médicas disponibles en el sistema
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Nueva Especialidad
          </Button>
        </Box>

        <Box sx={{ height: 600, width: "100%", bgcolor: "white", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <DataGrid
            rows={specialties}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            rowHeight={72}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
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

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingSpecialty ? "Editar Especialidad" : "Nueva Especialidad"}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField fullWidth label="Nombre de la Especialidad *" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <TextField fullWidth label="Descripción" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Especialidad médica que trata..." multiline rows={3} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Color de identificación</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {COLOR_OPTIONS.map((color) => (
                    <Box key={color} onClick={() => setFormData({ ...formData, color_hex: color })}
                      sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: color, cursor: "pointer",
                        border: "3px solid", borderColor: formData.color_hex === color ? "grey.800" : "transparent",
                        "&:hover": { opacity: 0.8 } }} />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={saving}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingSpecialty ? "Guardar Cambios" : "Crear Especialidad"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};
