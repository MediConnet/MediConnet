import {
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  AttachMoney,
} from "@mui/icons-material";
import { useState } from "react";
import { useConsultationPrices } from "../hooks/useConsultationPrices";
import type { ConsultationPrice, CreateConsultationPriceRequest, UpdateConsultationPriceRequest } from "../../domain/ConsultationPrice.entity";

interface Specialty {
  id: string;
  name: string;
}

interface Props {
  specialties: Specialty[]; // Especialidades del perfil del médico
}

interface GroupedPrices {
  [specialtyId: string]: {
    specialtyName: string;
    consultationTypes: ConsultationPrice[];
  };
}

export const ConsultationPricesSection = ({ specialties }: Props) => {
  const {
    consultationPrices,
    isLoading,
    createConsultationPrice,
    updateConsultationPrice,
    deleteConsultationPrice,
    isCreating,
    isUpdating,
    isDeleting,
  } = useConsultationPrices();

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

  // Agrupar tipos de consulta por especialidad
  const groupedPrices: GroupedPrices = consultationPrices.reduce((acc, item) => {
    if (!acc[item.specialtyId]) {
      acc[item.specialtyId] = {
        specialtyName: item.specialtyName,
        consultationTypes: [],
      };
    }
    acc[item.specialtyId].consultationTypes.push(item);
    return acc;
  }, {} as GroupedPrices);

  // Asegurar que todas las especialidades del perfil aparezcan
  specialties.forEach((specialty) => {
    if (!groupedPrices[specialty.id]) {
      groupedPrices[specialty.id] = {
        specialtyName: specialty.name,
        consultationTypes: [],
      };
    }
  });

  const handleOpenDialog = (specialty?: { id: string; name: string }, item?: ConsultationPrice) => {
    if (item) {
      // Modo edición
      setEditingItem(item);
      setFormData({
        consultationType: item.consultationType,
        price: item.price.toString(),
      });
    } else if (specialty) {
      // Modo creación
      setEditingItem(null);
      setSelectedSpecialty(specialty);
      setFormData({
        consultationType: "",
        price: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setSelectedSpecialty(null);
    setFormData({
      consultationType: "",
      price: "",
    });
  };

  const handleSave = async () => {
    try {
      const price = parseFloat(formData.price);
      
      if (!formData.consultationType || formData.consultationType.length < 3) {
        setSnackbar({
          open: true,
          message: "El tipo de consulta debe tener al menos 3 caracteres",
          severity: "error",
        });
        return;
      }

      if (isNaN(price) || price < 0) {
        setSnackbar({
          open: true,
          message: "El precio debe ser un número válido mayor o igual a 0",
          severity: "error",
        });
        return;
      }

      if (editingItem) {
        // Actualizar
        const updateData: UpdateConsultationPriceRequest = {
          consultationType: formData.consultationType,
          price,
        };
        await updateConsultationPrice({ id: editingItem.id, data: updateData });
        setSnackbar({
          open: true,
          message: "Tipo de consulta actualizado correctamente",
          severity: "success",
        });
      } else if (selectedSpecialty) {
        // Crear
        const createData: CreateConsultationPriceRequest = {
          specialtyId: selectedSpecialty.id,
          consultationType: formData.consultationType,
          price,
        };
        await createConsultationPrice(createData);
        setSnackbar({
          open: true,
          message: "Tipo de consulta creado correctamente",
          severity: "success",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar. Intenta nuevamente.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: string, consultationType: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${consultationType}"?`)) {
      return;
    }

    try {
      await deleteConsultationPrice(id);
      setSnackbar({
        open: true,
        message: "Tipo de consulta eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      setSnackbar({
        open: true,
        message: "Error al eliminar. Intenta nuevamente.",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Tarifas de Consulta
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (specialties.length === 0) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Tarifas de Consulta
        </Typography>
        <Alert severity="info">
          No tienes especialidades registradas. Actualiza tu perfil para agregar especialidades primero.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Tarifas de Consulta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configura los diferentes tipos de consulta y sus precios para cada especialidad
        </Typography>
      </Box>

      {/* Acordeones por especialidad */}
      {Object.entries(groupedPrices).map(([specialtyId, { specialtyName, consultationTypes }]) => (
        <Accordion key={specialtyId} defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: "grey.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {specialtyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({consultationTypes.length} {consultationTypes.length === 1 ? "tipo" : "tipos"})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {consultationTypes.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Tipo de Consulta</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Precio</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {consultationTypes.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography variant="body1" fontWeight={500}>
                              {item.consultationType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <AttachMoney sx={{ fontSize: 18, color: "text.secondary" }} />
                              <Typography variant="body1" fontWeight={500}>
                                {item.price.toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(undefined, item)}
                              title="Editar"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(item.id, item.consultationType)}
                              title="Eliminar"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>
                No hay tipos de consulta configurados para esta especialidad. Haz clic en el botón de abajo para agregar uno.
              </Alert>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                startIcon={<Add />}
                variant="outlined"
                size="small"
                onClick={() => handleOpenDialog({ id: specialtyId, name: specialtyName })}
              >
                Agregar tipo de consulta
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Información */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info" icon={<AttachMoney />}>
          Los precios se muestran en dólares estadounidenses (USD). Estos precios serán visibles
          para los pacientes en la aplicación móvil.
        </Alert>
      </Box>

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? "Editar Tipo de Consulta" : "Nuevo Tipo de Consulta"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
