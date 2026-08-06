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
import { useAdminCities } from "../hooks/useAdminCities";
import type { City } from "../../domain/city.entity";
import type { GridPaginationModel, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { FEEDBACK } from "../../../../shared/constants/feedback-messages";

const CURRENT_ADMIN = {
  name: "Administrador",
  roleLabel: "Administrador",
  initials: "AD",
  isActive: true,
};

const LETTERS_AND_SPACES_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const CitiesPage = () => {
  const { cities, loading, error, total, loadCities, createCity, updateCity, deleteCity, clearError } = useAdminCities();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "Ecuador",
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
    loadCities(apiPage, paginationModel.pageSize, debouncedSearch || undefined);
  }, [paginationModel, debouncedSearch, loadCities]);

  const handleReload = useCallback(() => {
    const apiPage = paginationModel.page + 1;
    loadCities(apiPage, paginationModel.pageSize, debouncedSearch || undefined);
  }, [paginationModel, debouncedSearch, loadCities]);

  const handleCreate = () => {
    setEditingCity(null);
    setFormData({ name: "", state: "", country: "Ecuador" });
    setIsModalOpen(true);
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      state: city.state || "",
      country: city.country || "Ecuador",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    feedback.showDelete(
      "Eliminar ciudad", 
      "¿Estás seguro de eliminar esta ciudad? Esta acción no se puede deshacer si tiene proveedores asociados.",
      async () => {
        try {
          await deleteCity(id);
          feedback.showFeedback("success", FEEDBACK.SUCCESS.DELETE.title, "Ciudad eliminada correctamente.");
          handleReload();
        } catch (err: any) {
          const errMsg = err?.response?.data?.message || err?.message || FEEDBACK.ERROR.GENERIC.message;
          feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, errMsg);
        }
      }
    );
  };

  const handleSave = async () => {
    const nameTrim = formData.name.trim();
    const stateTrim = formData.state.trim();
    const countryTrim = formData.country.trim();

    if (!nameTrim) {
      feedback.showFeedback("warning", "Campo requerido", "El nombre de la ciudad es requerido");
      return;
    }
    if (nameTrim.length < 3) {
      feedback.showFeedback("warning", "Validación", "El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (!LETTERS_AND_SPACES_REGEX.test(nameTrim)) {
      feedback.showFeedback("warning", "Validación", "El nombre de la ciudad solo debe contener letras y espacios");
      return;
    }

    if (stateTrim && !LETTERS_AND_SPACES_REGEX.test(stateTrim)) {
      feedback.showFeedback("warning", "Validación", "El estado o provincia solo debe contener letras y espacios");
      return;
    }

    if (countryTrim && !LETTERS_AND_SPACES_REGEX.test(countryTrim)) {
      feedback.showFeedback("warning", "Validación", "El país solo debe contener letras y espacios");
      return;
    }

    try {
      setSaving(true);
      if (editingCity) {
        await updateCity(editingCity.id, {
          name: nameTrim,
          state: stateTrim || undefined,
          country: countryTrim || undefined,
        });
        feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, "Ciudad actualizada correctamente.");
      } else {
        await createCity({
          name: nameTrim,
          state: stateTrim || undefined,
          country: countryTrim || undefined,
        });
        feedback.showFeedback("success", FEEDBACK.SUCCESS.SAVE.title, "Ciudad creada correctamente.");
      }
      setIsModalOpen(false);
      handleReload();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || FEEDBACK.ERROR.GENERIC.message;
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, errMsg);
    } finally {
      setSaving(false);
    }
  };

  const columns: GridColDef<City>[] = [
    { field: "name", headerName: "Ciudad", flex: 1, minWidth: 200 },
    {
      field: "state",
      headerName: "Provincia / Estado",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<City>) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.state || "-"}
        </Typography>
      ),
    },
    {
      field: "country",
      headerName: "País",
      width: 150,
      renderCell: (params: GridRenderCellParams<City>) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.country || "-"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<City>) => (
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
          title="Ciudades"
          subtitle="Gestiona las ubicaciones y ciudades disponibles en el sistema"
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder="Buscar por ciudad, provincia o país..."
          actions={[
            {
              label: "Actualizar",
              icon: undefined,
              onClick: handleReload,
              variant: "outlined",
            },
            {
              label: "Nueva Ciudad",
              icon: <Add />,
              onClick: handleCreate,
              variant: "contained",
            },
          ]}
        />

        <DataTable
          columns={columns}
          rows={cities}
          loading={loading}
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row.id}
          emptyTitle="No se encontraron ciudades"
          emptyDescription="Crea una nueva ciudad para comenzar"
        />

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingCity ? "Editar Ciudad" : "Nueva Ciudad"}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                fullWidth 
                label="Nombre de la Ciudad *" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
                helperText="Solo letras y espacios, ej: Quito"
              />
              <TextField 
                fullWidth 
                label="Provincia / Estado" 
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Ej: Pichincha" 
                helperText="Opcional. Solo letras y espacios"
              />
              <TextField 
                fullWidth 
                label="País" 
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Ej: Ecuador" 
                helperText="Opcional. Solo letras y espacios"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={saving}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingCity ? "Guardar Cambios" : "Crear Ciudad"}
            </Button>
          </DialogActions>
        </Dialog>
      </TablePageLayout>
    </DashboardLayout>
  );
};
