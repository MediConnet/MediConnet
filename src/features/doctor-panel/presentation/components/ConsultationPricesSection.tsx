import {
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { Add, Edit, Delete, AttachMoney } from "@mui/icons-material";
import { useState } from "react";
import { useConsultationPrices } from "../hooks/useConsultationPrices";
import type { ConsultationPrice, CreateConsultationPriceRequest, UpdateConsultationPriceRequest } from "../../domain/ConsultationPrice.entity";

interface Specialty {
  id: string;
  name: string;
}

interface Props {
  specialties: Specialty[];
}

export const ConsultationPricesSection = ({ specialties }: Props) => {
  const {
    consultationPrices,
    loading: isLoading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    createConsultationPrice,
    updateConsultationPrice,
    deleteConsultationPrice,
    isCreating,
    isUpdating,
  } = useConsultationPrices();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: limit });

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ConsultationPrice | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    consultationType: "",
    price: "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDialog = (item?: ConsultationPrice) => {
    if (item) {
      setEditingItem(item);
      setSelectedSpecialty(null);
      setFormData({
        consultationType: item.consultationType,
        price: item.price.toString(),
      });
    } else {
      setEditingItem(null);
      setSelectedSpecialty(null);
      setFormData({ consultationType: "", price: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setSelectedSpecialty(null);
    setFormData({ consultationType: "", price: "" });
  };

  const handleSave = async () => {
    try {
      const price = parseFloat(formData.price);

      if (!formData.consultationType || formData.consultationType.length < 3) {
        setSnackbar({ open: true, message: "El tipo de consulta debe tener al menos 3 caracteres", severity: "error" });
        return;
      }

      if (isNaN(price) || price < 0) {
        setSnackbar({ open: true, message: "El precio debe ser un número válido mayor o igual a 0", severity: "error" });
        return;
      }

      if (editingItem) {
        await updateConsultationPrice({ id: editingItem.id, data: { consultationType: formData.consultationType, price } });
        setSnackbar({ open: true, message: "Tipo de consulta actualizado correctamente", severity: "success" });
      } else if (selectedSpecialty) {
        await createConsultationPrice({ specialtyId: selectedSpecialty.id, consultationType: formData.consultationType, price });
        setSnackbar({ open: true, message: "Tipo de consulta creado correctamente", severity: "success" });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar:", error);
      setSnackbar({ open: true, message: "Error al guardar. Intenta nuevamente.", severity: "error" });
    }
  };

  const handleDelete = async (id: string, consultationType: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${consultationType}"?`)) return;

    try {
      await deleteConsultationPrice(id);
      setSnackbar({ open: true, message: "Tipo de consulta eliminado correctamente", severity: "success" });
    } catch (error) {
      console.error("Error al eliminar:", error);
      setSnackbar({ open: true, message: "Error al eliminar. Intenta nuevamente.", severity: "error" });
    }
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

  const columns: GridColDef[] = [
    {
      field: "consultationType",
      headerName: "Tipo de Consulta",
      flex: 2,
      minWidth: 200,
    },
    {
      field: "specialtyName",
      headerName: "Especialidad",
      flex: 1.5,
      minWidth: 150,
      valueGetter: (_value, row) => row.specialtyName || "—",
    },
    {
      field: "price",
      headerName: "Precio",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AttachMoney sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body1" fontWeight={500}>
            {params.value.toFixed(2)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(params.row)} title="Editar">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id, params.row.consultationType)}
            title="Eliminar"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Tarifas de Consulta</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (specialties.length === 0) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Tarifas de Consulta</Typography>
        <Alert severity="info">No tienes especialidades registradas. Actualiza tu perfil para agregar especialidades primero.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Tarifas de Consulta</Typography>
          <Typography variant="body2" color="text.secondary">
            Configura los diferentes tipos de consulta y sus precios
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setSelectedSpecialty(specialties[0]); handleOpenDialog(); }}>
          Nueva Tarifa
        </Button>
      </Box>

      <Box sx={{ height: 500, width: "100%", bgcolor: "white", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <DataGrid
          rows={consultationPrices}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{ border: "none" }}
        />
      </Box>

      {consultationPrices.length > 0 && (
        <Alert severity="info" icon={<AttachMoney />} sx={{ mt: 3 }}>
          Los precios se muestran en dólares estadounidenses (USD). Estos precios serán visibles para los pacientes en la aplicación móvil.
        </Alert>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? "Editar Tipo de Consulta" : "Nuevo Tipo de Consulta"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {!editingItem && specialties.length > 0 && (
              <TextField
                select
                label="Especialidad"
                value={selectedSpecialty?.id || ""}
                onChange={(e) => setSelectedSpecialty(specialties.find((s) => s.id === e.target.value) || null)}
                fullWidth
                required
                SelectProps={{ native: true }}
              >
                <option value="">Selecciona una especialidad</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </TextField>
            )}
            <TextField
              label="Tipo de Consulta"
              value={formData.consultationType}
              onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
              placeholder="Ej: Limpieza dental"
              required
              fullWidth
              helperText="Mínimo 3 caracteres"
            />
            <TextField
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment> }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={isCreating || isUpdating || !selectedSpecialty?.id}>
            {isCreating || isUpdating ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
