import { Add, Close, Delete, Save, Science } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { LaboratoryStudy } from "../../domain/LaboratoryDashboard.entity";
import {
  createLaboratoryExamAPI,
  deleteLaboratoryExamAPI,
  updateLaboratoryExamAPI,
} from "../../infrastructure/laboratories.repository";
import { useQueryClient } from "@tanstack/react-query";

interface EditServicesModalProps {
  open: boolean;
  onClose: () => void;
  studies: LaboratoryStudy[];
  onSave: (studies: LaboratoryStudy[]) => void;
}

export const EditServicesModal = ({
  open,
  onClose,
  studies,
  onSave,
}: EditServicesModalProps) => {
  const [formData, setFormData] = useState<LaboratoryStudy[]>([]);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const [initialIds, setInitialIds] = useState<string[]>([]);

  useEffect(() => {
    if (studies && studies.length > 0) {
      setFormData([...studies]);
      setInitialIds(studies.map((s) => s.id));
    } else {
      setFormData([]);
      setInitialIds([]);
    }
  }, [studies, open]);

  const handleAdd = () => {
    setFormData([
      ...formData,
      {
        id: `temp-${Date.now()}`,
        name: "",
        description: "",
        preparation: "",
        price: 0,
        is_available: true,
      },
    ]);
  };

  const handleChange = (id: string, field: keyof LaboratoryStudy, value: string) => {
    setFormData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemove = (id: string) => {
    setFormData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    const validStudies = formData.filter((study) => study.name.trim() !== "");
    const currentIds = new Set(validStudies.map((s) => s.id));
    const removed = initialIds.filter((id) => !currentIds.has(id) && !id.startsWith("temp-"));

    try {
      setSaving(true);

      // Delete removed
      await Promise.all(removed.map((id) => deleteLaboratoryExamAPI(id)));

      // Upsert current
      const saved: LaboratoryStudy[] = [];
      for (const s of validStudies) {
        if (s.id.startsWith("temp-")) {
          const created = await createLaboratoryExamAPI({
            name: s.name,
            description: s.description || undefined,
            preparation: s.preparation || undefined,
            price: typeof s.price === "number" ? s.price : 0,
            is_available: s.is_available !== false,
          });
          saved.push({
            id: created.id,
            name: created.name,
            description: created.description,
            preparation: created.preparation,
            price: created.price,
            is_available: created.is_available,
            type: created.type,
          });
        } else {
          const updated = await updateLaboratoryExamAPI(s.id, {
            name: s.name,
            description: s.description || undefined,
            preparation: s.preparation || undefined,
            price: typeof s.price === "number" ? s.price : 0,
            is_available: s.is_available !== false,
          });
          saved.push({
            id: updated.id,
            name: updated.name,
            description: updated.description,
            preparation: updated.preparation,
            price: updated.price,
            is_available: updated.is_available,
            type: updated.type,
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ["laboratories", "exams"] });

      onSave(saved);
      onClose();
    } catch (e) {
      console.error("Error guardando exámenes:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #eee"
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700 }}>
          Editar Servicios / Exámenes
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {formData.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Science sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
              <Typography variant="body2" color="text.secondary" mb={2}>
                No hay exámenes configurados
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{ textTransform: "none" }}
              >
                Agregar Primer Examen
              </Button>
            </Box>
          ) : (
            <>
              {formData.map((study, index) => (
                <Box
                  key={study.id}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    bgcolor: "grey.50",
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        Examen #{index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemove(study.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      label="Tipo de Examen"
                      placeholder="Ej: Hemograma completo"
                      value={study.name}
                      onChange={(e) =>
                        handleChange(study.id, "name", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Science color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Descripción"
                      placeholder="Descripción (opcional)"
                      value={study.description || ""}
                      onChange={(e) =>
                        handleChange(study.id, "description", e.target.value)
                      }
                      multiline
                      rows={2}
                    />
                    <TextField
                      fullWidth
                      label="Preparación Básica"
                      placeholder="Ej: Ayuno de 8 horas requerido"
                      value={study.preparation || ""}
                      onChange={(e) =>
                        handleChange(study.id, "preparation", e.target.value)
                      }
                      multiline
                      rows={2}
                    />
                    <TextField
                      fullWidth
                      label="Precio"
                      type="number"
                      value={typeof study.price === "number" ? study.price : 0}
                      onChange={(e) =>
                        setFormData((prev) =>
                          prev.map((item) =>
                            item.id === study.id
                              ? { ...item, price: Number(e.target.value) }
                              : item,
                          ),
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={study.is_available !== false}
                          onChange={(e) =>
                            setFormData((prev) =>
                              prev.map((item) =>
                                item.id === study.id
                                  ? { ...item, is_available: e.target.checked }
                                  : item,
                              ),
                            )
                          }
                        />
                      }
                      label={study.is_available === false ? "No disponible" : "Disponible"}
                    />
                  </Stack>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAdd}
                fullWidth
                sx={{ textTransform: "none", mt: 2 }}
              >
                Agregar Otro Examen
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          disabled={saving}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          {saving ? "Guardando..." : "Guardar Exámenes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

