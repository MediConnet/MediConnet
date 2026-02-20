import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { AttachMoney, Edit, Save, Cancel } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useConsultationPrices } from "../hooks/useConsultationPrices";

interface Props {
  // Ya no necesitamos recibir specialties como prop
  // Las obtenemos directamente del backend
}

export const ConsultationPricesSection = ({}: Props) => {
  const { prices: currentPrices, isLoading, updatePrices, isUpdating } = useConsultationPrices();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [tempPrice, setTempPrice] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Sincronizar precios cuando se cargan del backend
  useEffect(() => {
    if (currentPrices) {
      setPrices(currentPrices);
    }
  }, [currentPrices]);

  // Obtener especialidades del objeto de precios
  const specialties = Object.keys(prices);

  const handleEdit = (specialty: string) => {
    setEditingId(specialty);
    setTempPrice((prices[specialty] || 0).toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempPrice("");
  };

  const handleSave = async (specialty: string) => {
    const price = parseFloat(tempPrice);
    
    if (isNaN(price) || price < 0) {
      setSnackbar({
        open: true,
        message: "Por favor ingresa un precio válido",
        severity: "error",
      });
      return;
    }

    try {
      const newPrices = { ...prices, [specialty]: price };
      await updatePrices(newPrices);
      setPrices(newPrices);
      setEditingId(null);
      setTempPrice("");
      setSnackbar({
        open: true,
        message: "Precio actualizado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al guardar precio:", error);
      setSnackbar({
        open: true,
        message: "Error al actualizar el precio. Intenta nuevamente.",
        severity: "error",
      });
    }
  };

  const handlePriceChange = (value: string) => {
    // Solo permitir números y punto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setTempPrice(value);
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
          No tienes especialidades registradas. Actualiza tu perfil para agregar especialidades.
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
          Configura el precio de consulta para cada una de tus especialidades
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600 }}>Especialidad</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Precio de Consulta</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.map((specialty) => {
              const isEditing = editingId === specialty;
              const currentPrice = prices[specialty] || 0;

              return (
                <TableRow key={specialty} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {specialty}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={tempPrice}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="0.00"
                        autoFocus
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ width: 150 }}
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AttachMoney sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Typography variant="body1" fontWeight={500}>
                          {currentPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {isEditing ? (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleSave(specialty)}
                          disabled={isUpdating}
                          title="Guardar"
                        >
                          <Save fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={handleCancel}
                          disabled={isUpdating}
                          title="Cancelar"
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(specialty)}
                        title="Editar precio"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Alert severity="info" icon={<AttachMoney />}>
          Los precios se muestran en dólares estadounidenses (USD). Estos precios serán visibles para los pacientes en la aplicación móvil.
        </Alert>
      </Box>

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
