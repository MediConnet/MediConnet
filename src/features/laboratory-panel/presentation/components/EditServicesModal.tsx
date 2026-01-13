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
} from "@mui/material";
import { useState, useEffect } from "react";
import type { LaboratoryStudy } from "../../domain/LaboratoryDashboard.entity";

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

  useEffect(() => {
    if (studies && studies.length > 0) {
      setFormData([...studies]);
    } else {
      setFormData([]);
    }
  }, [studies, open]);

  const handleAdd = () => {
    setFormData([
      ...formData,
      {
        id: `study-${Date.now()}`,
        name: "",
        preparation: "",
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

  const handleSave = () => {
    // Filtrar estudios vacíos
    const validStudies = formData.filter(
      (study) => study.name.trim() !== ""
    );
    onSave(validStudies);
    onClose();
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
                      label="Preparación Básica"
                      placeholder="Ej: Ayuno de 8 horas requerido"
                      value={study.preparation}
                      onChange={(e) =>
                        handleChange(study.id, "preparation", e.target.value)
                      }
                      multiline
                      rows={2}
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
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Guardar Exámenes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

