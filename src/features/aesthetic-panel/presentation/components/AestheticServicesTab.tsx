import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import { Add, Edit, Delete, AttachMoney, InfoOutlined, AccessTime } from "@mui/icons-material";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { useAestheticServices } from "../hooks/useAestheticServices";
import type { AestheticServiceItem } from "../../infrastructure/aesthetic-services.api";

export const AestheticServicesTab = () => {
  const {
    services,
    total,
    page,
    setPage,
    limit,
    setLimit,
    isLoading,
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
  } = useAestheticServices();

  const feedback = useFeedbackStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<AestheticServiceItem | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: 60,
    is_available: true,
  });



  const handleOpenDialog = (item?: AestheticServiceItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        duration: item.duration || 60,
        is_available: item.is_available ?? true,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: 60,
        is_available: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: 60,
      is_available: true,
    });
  };

  const handleSave = async () => {
    const priceNum = parseFloat(formData.price);

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      feedback.showFeedback("error", "Información incompleta", "El nombre del tratamiento debe tener al menos 3 caracteres.");
      return;
    }

    if (isNaN(priceNum) || priceNum < 0) {
      feedback.showFeedback("error", "Información incompleta", "El precio debe ser un número válido mayor o igual a 0.");
      return;
    }

    try {
      if (editingItem) {
        await updateService({
          id: editingItem.id,
          dto: {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: priceNum,
            duration: Number(formData.duration),
            is_available: formData.is_available,
          },
        });
      } else {
        await createService({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: priceNum,
          duration: Number(formData.duration),
          is_available: formData.is_available,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar tratamiento:", error);
    }
  };

  const handleDelete = (id: string, name: string) => {
    feedback.showDelete(
      "Eliminar tratamiento",
      `¿Estás seguro de eliminar "${name}" del catálogo de servicios?`,
      async () => {
        try {
          await deleteService(id);
        } catch (error) {
          console.error("Error al eliminar tratamiento:", error);
        }
      }
    );
  };

  const handleToggleStatus = async (item: AestheticServiceItem) => {
    try {
      await updateService({
        id: item.id,
        dto: { is_available: !item.is_available },
        showFeedback: false,
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid #e5e7eb" }} elevation={0}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#831843", mb: 0.5 }}>
            Tarifas de Tratamientos y Servicios Estéticos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configura los diferentes tipos de servicios, duraciones y sus precios referenciales
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: "#db2777",
            "&:hover": { backgroundColor: "#be185d" },
            fontWeight: 700,
            textTransform: "uppercase",
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          NUEVA TARIFA
        </Button>
      </Box>

      {/* Tabla de Servicios */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#db2777" }} />
        </Box>
      ) : services.length === 0 ? (
        <Box sx={{ p: 6, textAlign: "center", bgcolor: "#fdf2f8", borderRadius: 2, border: "1px dashed #fbcfe8" }}>
          <Typography variant="subtitle1" fontWeight={600} color="#831843" mb={1}>
            No tienes tratamientos registrados en tu catálogo
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Agrega tus servicios para que los usuarios puedan consultarlos y agendar citas desde la aplicación móvil.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: "#db2777", "&:hover": { backgroundColor: "#be185d" }, fontWeight: 700 }}
          >
            Agregar Primer Tratamiento
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #F3F4F6", borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#FDF2F8" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Servicio / Tratamiento</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Duración Estimada</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Precio Referencial</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Modalidad Pago</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#374151", textAlign: "right" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#831843" }}>
                        {row.name}
                      </Typography>
                      {row.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, lineClamp: 1 }}>
                          {row.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#4b5563" }}>
                        <AccessTime sx={{ fontSize: 16, color: "#9ca3af" }} />
                        <Typography variant="body2" fontWeight={500}>
                          {row.duration || 60} min
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#111827" }}>
                        ${row.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Presencial"
                        size="small"
                        sx={{ backgroundColor: "#D1FAE5", color: "#065F46", fontWeight: 600, fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={row.is_available}
                        onChange={() => handleToggleStatus(row)}
                        size="small"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#db2777" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#fbcfe8" },
                        }}
                      />
                      <Typography variant="caption" sx={{ ml: 1, fontWeight: 500, color: row.is_available ? "#15803d" : "#6b7280" }}>
                        {row.is_available ? "Disponible" : "Pausado"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(row)} sx={{ color: "#0284c7" }} title="Editar">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(row.id, row.name)} sx={{ color: "#ef4444" }} title="Eliminar">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            sx={{ mt: 1 }}
          />
        </>
      )}

      {/* Banner Informativo Inferior */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <InfoOutlined sx={{ color: "#2563EB" }} />
        <Typography variant="body2" sx={{ color: "#1E40AF" }}>
          Los precios se muestran en dólares estadounidenses (USD). Estos servicios y tarifas serán visibles para los pacientes en la aplicación móvil.
        </Typography>
      </Box>

      {/* Modal Dialog para Crear / Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#831843", borderBottom: "1px solid #f3f4f6" }}>
          {editingItem ? "Editar Tratamiento / Servicio" : "Nuevo Tratamiento o Tarifa"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
            <TextField
              label="Nombre del Tratamiento / Servicio"
              placeholder="Ejemplo: Limpieza Facial Profunda + Mascarilla"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Precio Referencial ($)"
                placeholder="0.00"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />

              <FormControl fullWidth>
                <InputLabel id="duration-label">Duración Estimada</InputLabel>
                <Select
                  labelId="duration-label"
                  value={formData.duration}
                  label="Duración Estimada"
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                >
                  <MenuItem value={30}>30 minutos</MenuItem>
                  <MenuItem value={45}>45 minutos</MenuItem>
                  <MenuItem value={60}>60 minutos (1 hora)</MenuItem>
                  <MenuItem value={90}>90 minutos (1h 30m)</MenuItem>
                  <MenuItem value={120}>120 minutos (2 horas)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Descripción o Beneficios (Opcional)"
              placeholder="Describe en qué consiste el tratamiento, productos usados o recomendaciones..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_available}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_available: e.target.checked }))}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#db2777" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#fbcfe8" },
                  }}
                />
              }
              label="Disponible para reservas en la aplicación móvil"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid #f3f4f6" }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isCreating || isUpdating}
            sx={{
              backgroundColor: "#db2777",
              "&:hover": { backgroundColor: "#be185d" },
              fontWeight: 700,
              px: 3,
            }}
          >
            {isCreating || isUpdating ? "Guardando..." : "Guardar Tratamiento"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
