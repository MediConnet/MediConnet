import {
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, useCallback, useRef } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { DataTable, TableToolbar, TablePageLayout } from "../../../../shared/components/DataTable";
import { useAdminSpecialties } from "../hooks/useAdminSpecialties";
import type { Specialty } from "../../domain/specialty.entity";
import type { GridPaginationModel, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { FEEDBACK } from "../../../../shared/constants/feedback-messages";

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
  const { specialties, loading, error, total, loadSpecialties, createSpecialty, updateSpecialty, deleteSpecialty, clearError } = useAdminSpecialties();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color_hex: "#4CAF50",
  });
  const feedback = useFeedbackStore();

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchText]);

  // Fetch data when pagination or debounced search changes
  useEffect(() => {
    const apiPage = paginationModel.page + 1;
    loadSpecialties(apiPage, paginationModel.pageSize, debouncedSearch || undefined);
  }, [paginationModel, debouncedSearch, loadSpecialties]);

  const handleReload = useCallback(() => {
    const apiPage = paginationModel.page + 1;
    loadSpecialties(apiPage, paginationModel.pageSize, debouncedSearch || undefined);
  }, [paginationModel, debouncedSearch, loadSpecialties]);

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
    feedback.showDelete("Eliminar especialidad", "¿Estás seguro de eliminar esta especialidad?", async () => {
      try {
        await deleteSpecialty(id);
        feedback.showFeedback("success", FEEDBACK.SUCCESS.DELETE.title, FEEDBACK.SUCCESS.DELETE.message);
        handleReload();
      } catch (err: any) {
        feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, err?.message || err?.response?.data?.message || FEEDBACK.ERROR.GENERIC.message);
      }
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      feedback.showFeedback("warning", "Campo requerido", "El nombre es requerido");
      return;
    }
    if (formData.name.trim().length < 3) {
      feedback.showFeedback("warning", "Validación", "El nombre debe tener al menos 3 caracteres");
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
        feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
      } else {
        await createSpecialty({
          name: formData.name,
          description: formData.description,
          color_hex: formData.color_hex,
        });
        feedback.showFeedback("success", FEEDBACK.SUCCESS.SAVE.title, FEEDBACK.SUCCESS.SAVE.message);
      }
      setIsModalOpen(false);
      handleReload();
    } catch (err) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, FEEDBACK.ERROR.GENERIC.message);
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

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <TablePageLayout>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <TableToolbar
          title="Especialidades Médicas"
          subtitle="Gestiona las especialidades médicas disponibles en el sistema"
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder="Buscar por nombre o descripción..."
          actions={[
            {
              label: "Actualizar",
              icon: undefined,
              onClick: handleReload,
              variant: "outlined",
            },
            {
              label: "Nueva Especialidad",
              icon: <Add />,
              onClick: handleCreate,
              variant: "contained",
            },
          ]}
        />

        <DataTable
          columns={columns}
          rows={specialties}
          loading={loading}
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row.id}
          emptyTitle="No se encontraron especialidades"
          emptyDescription="Crea una nueva especialidad para comenzar"
        />

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
      </TablePageLayout>
    </DashboardLayout>
  );
};
