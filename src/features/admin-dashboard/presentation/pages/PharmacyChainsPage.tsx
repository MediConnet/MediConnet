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
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useState, useRef } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { usePharmacyChains } from "../hooks/usePharmacyChains";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import type { PharmacyChain } from "../../domain/pharmacy-chain.entity";

const CURRENT_ADMIN = {
  name: "Administrador",
  roleLabel: "Administrador",
  initials: "AD",
  isActive: true,
};

export const PharmacyChainsPage = () => {
  const { chains, loading, error, createChain, updateChain, deleteChain, clearError } = usePharmacyChains();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChain, setEditingChain] = useState<PharmacyChain | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    isActive: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    setEditingChain(null);
    setFormData({ name: "", logoUrl: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleEdit = (chain: PharmacyChain) => {
    setEditingChain(chain);
    setFormData({
      name: chain.name,
      logoUrl: chain.logoUrl,
      isActive: chain.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta cadena?")) {
      try {
        await deleteChain(id);
      } catch (err) {
        alert("Error al eliminar la cadena. Por favor, intenta nuevamente.");
      }
    }
  };

  const handleToggleActive = async (chain: PharmacyChain) => {
    try {
      await updateChain(chain.id, { isActive: !chain.isActive });
    } catch (err) {
      alert("Error al cambiar el estado. Por favor, intenta nuevamente.");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("El nombre es requerido");
      return;
    }

    try {
      setSaving(true);
      if (editingChain) {
        // Editar
        await updateChain(editingChain.id, {
          name: formData.name,
          logoUrl: formData.logoUrl,
          isActive: formData.isActive,
        });
      } else {
        // Crear
        await createChain({
          name: formData.name,
          logoUrl: formData.logoUrl,
          isActive: formData.isActive,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      // El error ya se maneja en el hook
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

  if (loading) {
    return (
      <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
        <LoadingSpinner text="Cargando cadenas de farmacias..." />
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

        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "grey.200" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Logo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha de Creación</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay cadenas registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                chains.map((chain) => (
                  <TableRow key={chain.id} hover>
                    <TableCell>
                      {chain.logoUrl ? (
                        <Box
                          component="img"
                          src={chain.logoUrl}
                          alt={chain.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                            borderRadius: "50%",
                            border: "1px solid",
                            borderColor: "grey.200",
                            bgcolor: "white",
                            p: 0.5,
                          }}
                        />
                      ) : (
                        <Avatar sx={{ width: 50, height: 50 }}>
                          <Business />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{chain.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={chain.isActive ? "Activa" : "Inactiva"}
                        color={chain.isActive ? "success" : "default"}
                        size="small"
                        icon={chain.isActive ? <CheckCircle /> : <Block />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(chain.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={chain.isActive}
                              onChange={() => handleToggleActive(chain)}
                              size="small"
                            />
                          }
                          label=""
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(chain)}
                          sx={{ color: "primary.main" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(chain.id)}
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

        {/* Modal de Crear/Editar */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingChain ? "Editar Cadena" : "Nueva Cadena"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Nombre de la Cadena *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Logo de la Cadena
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <Box
                  onClick={handleUploadClick}
                  sx={{
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "grey.50",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  {formData.logoUrl ? (
                    <Box
                      component="img"
                      src={formData.logoUrl}
                      alt="Logo"
                      sx={{
                        maxHeight: 120,
                        maxWidth: "100%",
                        objectFit: "contain",
                        mb: 1,
                      }}
                    />
                  ) : (
                    <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {formData.logoUrl
                      ? "Click para cambiar logo"
                      : "Click para subir logo"}
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="URL del Logo (alternativa)"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  placeholder="https://..."
                  sx={{ mt: 2 }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                }
                label="Cadena activa (visible para farmacias)"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingChain ? "Guardar Cambios" : "Crear Cadena"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

