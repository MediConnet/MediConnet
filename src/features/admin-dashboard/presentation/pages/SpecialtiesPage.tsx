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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useAdminSpecialties } from "../hooks/useAdminSpecialties";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
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
  const { specialties, loading, error, createSpecialty, updateSpecialty, deleteSpecialty, clearError } = useAdminSpecialties();
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

  if (loading) {
    return (
      <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
        <LoadingSpinner text="Cargando especialidades..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box>
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

        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "grey.200" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Color</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Creada</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay especialidades registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                specialties.map((specialty) => (
                  <TableRow key={specialty.id} hover>
                    <TableCell>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: specialty.color_hex || '#ccc',
                          border: "2px solid",
                          borderColor: "grey.200",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{specialty.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {specialty.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {specialty.created_at ? new Date(specialty.created_at).toLocaleDateString() : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(specialty)}
                          sx={{ color: "primary.main" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(specialty.id)}
                          sx={{ color: "error.main" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingSpecialty ? "Editar Especialidad" : "Nueva Especialidad"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Nombre de la Especialidad *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Especialidad médica que trata..."
                multiline
                rows={3}
              />

              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Color de identificación
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {COLOR_OPTIONS.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setFormData({ ...formData, color_hex: color })}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: color,
                        cursor: "pointer",
                        border: "3px solid",
                        borderColor: formData.color_hex === color ? "grey.800" : "transparent",
                        "&:hover": { opacity: 0.8 },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingSpecialty ? "Guardar Cambios" : "Crear Especialidad"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};
