import {
  Business,
  CheckCircle,
  Close,
  CloudUpload,
  Description,
  Language,
  LocationOn,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import type { PharmacyProfile } from "../../domain/pharmacy-profile.entity";
import { getPharmacyChains } from "../../../../shared/lib/pharmacy-chains";
import type { PharmacyChain } from "../../../../admin-dashboard/domain/pharmacy-chain.entity";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: PharmacyProfile | null;
  onSave: (data: PharmacyProfile) => void;
}

export const EditPharmacyModal = ({
  open,
  onClose,
  initialData,
  onSave,
}: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado: Identidad de marca + dirección + estado
  const [formData, setFormData] = useState<Partial<PharmacyProfile>>({
    commercialName: "",
    ruc: "",
    description: "",
    websiteUrl: "",
    logoUrl: "",
    address: "",
    status: "draft",
    isActive: true,
    chainId: "",
  });

  const [hasNewImage, setHasNewImage] = useState(false);
  const [chains, setChains] = useState<PharmacyChain[]>([]);
  const [selectedChain, setSelectedChain] = useState<PharmacyChain | null>(null);

  useEffect(() => {
    const loadedChains = getPharmacyChains();
    const activeChains = loadedChains.filter((c) => c.isActive);
    setChains(activeChains);
    
    // Si hay initialData, buscar la cadena correspondiente y configurar logo/nombre
    if (initialData && initialData.chainId) {
      const chain = activeChains.find((c) => c.id === initialData.chainId);
      if (chain) {
        setSelectedChain(chain);
        // Actualizar logo y nombre inmediatamente desde la cadena
        setFormData((prev) => ({
          ...prev,
          logoUrl: chain.logoUrl || prev.logoUrl || "",
          commercialName: chain.name,
          chainId: chain.id,
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (initialData && open) {
      const chainId = initialData.chainId || "";
      const chain = chains.find((c) => c.id === chainId);
      
      // Si hay cadena, SIEMPRE usar el nombre y logo de la cadena (no del initialData)
      if (chain) {
        setSelectedChain(chain);
        setFormData({
          commercialName: chain.name, // SIEMPRE usar nombre de la cadena
          ruc: initialData.ruc || "",
          description: initialData.description || "",
          websiteUrl: initialData.websiteUrl || "",
          logoUrl: chain.logoUrl || "", // SIEMPRE usar logo de la cadena
          address: initialData.address || "",
          status: initialData.status || "draft",
          isActive: initialData.isActive !== false,
          chainId: chainId,
        });
      } else {
        // Si no hay cadena, usar los datos iniciales normalmente
        setFormData({
          commercialName: initialData.commercialName,
          ruc: initialData.ruc || "",
          description: initialData.description || "",
          websiteUrl: initialData.websiteUrl || "",
          logoUrl: initialData.logoUrl || "",
          address: initialData.address || "",
          status: initialData.status || "draft",
          isActive: initialData.isActive !== false,
          chainId: chainId,
        });
      }
      
      if (chain) {
        setSelectedChain(chain);
        // Si hay una cadena seleccionada, usar su nombre y logo
        if (!initialData.logoUrl && chain.logoUrl) {
          setFormData((prev) => ({
            ...prev,
            logoUrl: chain.logoUrl,
            commercialName: chain.name,
          }));
        }
      }
      
      setHasNewImage(false);
    } else if (!initialData && open) {
      // Resetear formulario cuando se abre sin datos iniciales
      setFormData({
        commercialName: "",
        ruc: "",
        description: "",
        websiteUrl: "",
        logoUrl: "",
        address: "",
        status: "draft",
        isActive: true,
        chainId: "",
      });
      setSelectedChain(null);
      setHasNewImage(false);
    }
  }, [initialData, open, chains]);

  const handleChange = (field: string, value: string) => {
    // Si hay cadena seleccionada, NO permitir cambiar el nombre comercial ni el logo
    if (selectedChain && (field === "commercialName" || field === "logoUrl")) {
      return; // Ignorar cambios a estos campos
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChainChange = (chainId: string) => {
    const chain = chains.find((c) => c.id === chainId);
    if (chain) {
      setSelectedChain(chain);
      // El nombre y logo SIEMPRE vienen de la cadena seleccionada
      setFormData((prev) => ({
        ...prev,
        chainId: chain.id,
        commercialName: chain.name, // Siempre usar el nombre de la cadena
        logoUrl: chain.logoUrl || "", // Siempre usar el logo de la cadena
      }));
      setHasNewImage(false); // Resetear si había imagen personalizada
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Si hay cadena seleccionada, NO permitir cambiar el logo
    if (selectedChain) {
      return;
    }
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoUrl: objectUrl }));
      setHasNewImage(true);
    }
  };

  const handleSave = () => {
    // Si hay cadena seleccionada, FORZAR el logo y nombre de la cadena (NO se pueden editar)
    if (selectedChain) {
      const savedData = {
        ...formData,
        commercialName: selectedChain.name, // SIEMPRE usar el nombre de la cadena
        logoUrl: selectedChain.logoUrl || "", // SIEMPRE usar el logo de la cadena
        chainId: selectedChain.id, // Asegurar que el chainId esté correcto
      };
      onSave(savedData as PharmacyProfile);
    } else {
      // Si no hay cadena, usar los datos del formulario normalmente
      onSave(formData as PharmacyProfile);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // Hacemos el modal más angosto, ya no necesitamos tanto espacio
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
          Identidad de la Farmacia
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* --- 0. CADENA ASIGNADA (Solo lectura si hay cadena) --- */}
          {selectedChain && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Cadena de Farmacias
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: "2px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {selectedChain.logoUrl ? (
                    <Box
                      component="img"
                      src={selectedChain.logoUrl}
                      alt={selectedChain.name}
                      sx={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                  ) : (
                    <Avatar sx={{ width: 50, height: 50 }}>
                      <Business />
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {selectedChain.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Esta cadena está asignada a tu farmacia y no se puede cambiar
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Typography variant="caption" color="error.main" mt={1} display="block" fontWeight={600}>
                ⚠️ El nombre y logo de la cadena son controlados únicamente por el administrador. No puedes editarlos ni cambiarlos.
              </Typography>
            </Box>
          )}

          {/* --- 1. LOGO DE LA MARCA (SI hay cadena, SOLO mostrar, NO editar) --- */}
          {selectedChain ? (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Logo de la Cadena (Solo lectura)
              </Typography>
              <Box
                sx={{
                  border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  bgcolor: alpha(theme.palette.error.main, 0.02),
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "not-allowed",
                  pointerEvents: "none",
                }}
              >
                {(selectedChain?.logoUrl || formData.logoUrl) ? (
                  <Box
                    component="img"
                    src={selectedChain?.logoUrl || formData.logoUrl || ""}
                    alt={`Logo de ${selectedChain?.name || "Cadena"}`}
                    onError={(e) => {
                      // Si la imagen falla, mostrar icono
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                    sx={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  />
                ) : null}
                {(!selectedChain?.logoUrl && !formData.logoUrl) && (
                  <Business
                    sx={{
                      fontSize: 60,
                      color: theme.palette.text.disabled,
                      mb: 1,
                    }}
                  />
                )}
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Logo de {selectedChain.name}
                </Typography>
                <Typography variant="caption" color="error.main" mt={1} fontWeight={600}>
                  ⚠️ Este logo NO se puede editar. Solo el administrador puede modificarlo.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Logotipo / Imagen de Marca
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
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
                  borderRadius: 3,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {formData.logoUrl ? (
                  <Box
                    component="img"
                    src={formData.logoUrl}
                    alt="Logo Preview"
                    sx={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <CloudUpload
                    sx={{
                      fontSize: 40,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  />
                )}
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {formData.logoUrl
                    ? "Click para cambiar logo"
                    : "Subir Logo de la Farmacia"}
                </Typography>
                {hasNewImage && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    mt={1}
                    sx={{ color: "success.main" }}
                  >
                    <CheckCircle fontSize="small" />
                    <Typography variant="caption" fontWeight={600}>
                      Nueva imagen lista
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          )}

          {/* --- 2. DATOS DE IDENTIDAD --- */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              {selectedChain ? (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Nombre Comercial (Solo lectura - Controlado por Administrador)
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: "2px solid",
                      borderColor: "error.main",
                      borderRadius: 2,
                      bgcolor: "rgba(211, 47, 47, 0.05)",
                      cursor: "not-allowed",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Business color="disabled" />
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {selectedChain.name}
                      </Typography>
                    </Stack>
                  </Box>
                  <Typography variant="caption" color="error.main" mt={1} display="block" fontWeight={600}>
                    ⚠️ Este nombre NO se puede editar. Solo el administrador puede modificarlo desde el panel de administración.
                  </Typography>
                </Box>
              ) : (
                <TextField
                  fullWidth
                  label="Nombre Comercial"
                  placeholder="Solo si no perteneces a ninguna cadena"
                  value={formData.commercialName}
                  onChange={(e) => handleChange("commercialName", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Solo si tu farmacia es independiente (no pertenece a ninguna cadena)"
                />
              )}
            </Grid2>

            {/* RUC y Descripción - Siempre editables */}
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="RUC / Razón Social"
                placeholder="Ej: 1790000000001"
                value={formData.ruc}
                onChange={(e) => handleChange("ruc", e.target.value)}
                helperText="Información interna para facturación"
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Slogan o Descripción Corta"
                placeholder="Ej: Cuidamos tu salud las 24 horas"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <Description color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
          </Grid2>

          {/* Divider antes de Dirección y Sitio Web */}
          <Divider sx={{ my: 2 }} />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Dirección"
                placeholder="Av. Amazonas N25 y Colón, Quito, Ecuador"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1.5 }}>
                      <LocationOn color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Sitio Web (Opcional)"
                placeholder="www.mifarmacia.com"
                value={formData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
          </Grid2>
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
          disabled={selectedChain ? false : (!formData.commercialName && !formData.chainId)}
          sx={{
            borderRadius: 2,
            px: 3,
            color: "white",
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Guardar Perfil
        </Button>
      </DialogActions>
    </Dialog>
  );
};
