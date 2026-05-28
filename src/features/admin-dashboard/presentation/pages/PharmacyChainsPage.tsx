import {
  Add,
  Edit,
  Delete,
  Business,
  CloudUpload,
  CheckCircle,
  Block,
} from "@mui/icons-material";
import {
  Avatar,
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
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useState, useRef, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { usePharmacyChains } from "../hooks/usePharmacyChains";
import type { PharmacyChain } from "../../domain/pharmacy-chain.entity";

const CURRENT_ADMIN = {
  name: "Administrador",
  roleLabel: "Administrador",
  initials: "AD",
  isActive: true,
};

export const PharmacyChainsPage = () => {
  const { chains, loading, error, total, setPage, setPageSize, createChain, updateChain, deleteChain, clearError } = usePharmacyChains();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChain, setEditingChain] = useState<PharmacyChain | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    description: "",
    isActive: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    setEditingChain(null);
    setFormData({ name: "", logoUrl: "", description: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleEdit = (chain: PharmacyChain) => {
    setEditingChain(chain);
    setFormData({
      name: chain.name,
      logoUrl: chain.logoUrl,
      description: chain.description || "",
      isActive: chain.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta cadena?")) {
      try {
        await deleteChain(id);
        setSnackbar({ open: true, message: "Cadena eliminada correctamente", severity: 'success' });
      } catch (err: any) {
        const errorMessage = err?.message || err?.response?.data?.message || "Error al eliminar la cadena. Por favor, intenta nuevamente.";
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    }
  };

  const handleToggleActive = async (chain: PharmacyChain) => {
    try {
      await updateChain(chain.id, { isActive: !chain.isActive });
      setSnackbar({ open: true, message: `Cadena ${chain.isActive ? 'desactivada' : 'activada'} correctamente`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: "Error al cambiar el estado. Por favor, intenta nuevamente.", severity: 'error' });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: "El nombre es requerido", severity: 'warning' });
      return;
    }
    try {
      setSaving(true);
      if (editingChain) {
        await updateChain(editingChain.id, {
          name: formData.name,
          logoUrl: formData.logoUrl,
          description: formData.description,
          isActive: formData.isActive,
        });
        setSnackbar({ open: true, message: "Cadena actualizada correctamente", severity: 'success' });
      } else {
        await createChain({
          name: formData.name,
          logoUrl: formData.logoUrl,
          description: formData.description,
          isActive: formData.isActive,
        });
        setSnackbar({ open: true, message: "Cadena creada correctamente", severity: 'success' });
      }
      setIsModalOpen(false);
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const columns: GridColDef<PharmacyChain>[] = [
    {
      field: "logo",
      headerName: "Logo",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams<PharmacyChain>) =>
        params.row.logoUrl ? (
          <Box
            component="img"
            src={params.row.logoUrl}
            alt={params.row.name}
            sx={{ width: 40, height: 40, objectFit: "contain", borderRadius: "50%", border: "1px solid", borderColor: "grey.200", bgcolor: "white", p: 0.3 }}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40 }}><Business /></Avatar>
        ),
    },
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 200 },
    {
      field: "isActive",
      headerName: "Estado",
      width: 110,
      renderCell: (params: GridRenderCellParams<PharmacyChain>) => (
        <Chip
          label={params.row.isActive ? "Activa" : "Inactiva"}
          color={params.row.isActive ? "success" : "default"}
          size="small"
          icon={params.row.isActive ? <CheckCircle /> : <Block />}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha de Creación",
      width: 160,
      renderCell: (params: GridRenderCellParams<PharmacyChain>) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.row.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<PharmacyChain>) => (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: "100%" }}>
          <Switch
            checked={params.row.isActive}
            onChange={() => handleToggleActive(params.row)}
            size="small"
          />
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

  if (loading && chains.length === 0) {
    return (
      <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
        <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
          <Typography>Cargando cadenas de farmacias...</Typography>
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
              Cadenas de Farmacias
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona las cadenas de farmacias disponibles en el sistema
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Nueva Cadena
          </Button>
        </Box>

        <Box sx={{ height: 600, width: "100%", bgcolor: "white", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <DataGrid
            rows={chains}
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

        {/* Modal de Crear/Editar */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingChain ? "Editar Cadena" : "Nueva Cadena"}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField fullWidth label="Nombre de la Cadena *" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <TextField fullWidth label="Descripción" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Cadena de farmacias con más de 50 años de experiencia" multiline rows={3} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Logo de la Cadena</Typography>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                <Box onClick={handleUploadClick}
                  sx={{ border: "2px dashed", borderColor: "grey.300", borderRadius: 2, p: 3, textAlign: "center", cursor: "pointer", bgcolor: "grey.50", "&:hover": { borderColor: "primary.main", bgcolor: "grey.100" } }}>
                  {formData.logoUrl ? (
                    <Box component="img" src={formData.logoUrl} alt="Logo"
                      sx={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain", mb: 1 }} />
                  ) : (
                    <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {formData.logoUrl ? "Click para cambiar logo" : "Click para subir logo"}
                  </Typography>
                </Box>
                <TextField fullWidth label="URL del Logo (alternativa)" value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="https://..." sx={{ mt: 2 }} />
              </Box>
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />} label="Cadena activa (visible para farmacias)" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={saving}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingChain ? "Guardar Cambios" : "Crear Cadena"}
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
