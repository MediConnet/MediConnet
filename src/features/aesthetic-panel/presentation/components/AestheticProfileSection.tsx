import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Edit,
  Save,
  Close,
  CloudUpload,
  AddPhotoAlternate,
  Delete,
  Visibility,
  VisibilityOff,
  Storefront,
  AccessTime,
  CheckCircle,
} from "@mui/icons-material";
import { useAuthStore } from "../../../../app/store/auth.store";

interface WorkScheduleDay {
  dayKey: string;
  label: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  hasBreak: boolean;
}

const DEFAULT_SCHEDULES: WorkScheduleDay[] = [
  { dayKey: "monday", label: "Lunes", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", hasBreak: false },
  { dayKey: "tuesday", label: "Martes", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", hasBreak: false },
  { dayKey: "wednesday", label: "Miércoles", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", hasBreak: false },
  { dayKey: "thursday", label: "Jueves", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", hasBreak: false },
  { dayKey: "friday", label: "Viernes", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", hasBreak: false },
  { dayKey: "saturday", label: "Sábado", enabled: false, startTime: "09:00", endTime: "14:00", breakStart: "", breakEnd: "", hasBreak: false },
  { dayKey: "sunday", label: "Domingo", enabled: false, startTime: "09:00", endTime: "14:00", breakStart: "", breakEnd: "", hasBreak: false },
];

export const AestheticProfileSection: React.FC = () => {
  const authStore = useAuthStore();
  const { user } = authStore;

  const [isEditing, setIsEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"published" | "draft">("published");

  // Profile Form State (Matching Doctor Profile Edit fields)
  const [formData, setFormData] = useState({
    name: user?.name || "Centro Estético Glow & Spa",
    category: "Centro Estético & Spa",
    email: user?.email || "estetica@medicones.com",
    phone: "0987654321",
    address: "Av. de los Shyris y NNUU, Quito",
    googleMapsUrl: "",
    latitude: "-0.180653",
    longitude: "-78.467834",
    price: "35",
    experience: "5",
    description:
      "Especialistas en tratamientos faciales, corporales, limpieza profunda y bienestar integral. Ofrecemos atención personalizada con la tecnología estética más avanzada.",
    paymentMethod: "cash",
    logoUrl: "",
  });

  const [schedules, setSchedules] = useState<WorkScheduleDay[]>(DEFAULT_SCHEDULES);

  // Preview Images State (Gallery)
  const [previewImages, setPreviewImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512290900673-7002b5428482?auto=format&fit=crop&w=600&q=80",
  ]);

  const [hasUnsavedImages, setHasUnsavedImages] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleSaveImages = () => {
    setHasUnsavedImages(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData((prev) => ({ ...prev, logoUrl: uploadEvent.target!.result as string }));
          setHasUnsavedImages(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPreviewImages((prev) => [...prev, uploadEvent.target!.result as string]);
          setHasUnsavedImages(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedImages(true);
  };

  const handleScheduleToggle = (index: number, enabled: boolean) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled } : item))
    );
  };

  const handleScheduleTimeChange = (
    index: number,
    field: "startTime" | "endTime" | "breakStart" | "breakEnd",
    value: string
  ) => {
    setSchedules((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === "breakStart" || field === "breakEnd") {
            updated.hasBreak = Boolean(updated.breakStart || updated.breakEnd);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleClearLunch = (index: number) => {
    setSchedules((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, breakStart: "", breakEnd: "", hasBreak: false } : item
      )
    );
  };

  return (
    <Grid container spacing={3}>
      {/* ── LEFT COLUMN: INFORMACIÓN DEL PERFIL (2/3 width) ── */}
      <Grid item xs={12} lg={8}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e5e7eb" }}>
          {/* HEADER DEL PERFIL */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1f2937">
                Información del Perfil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona los datos de tu servicio
              </Typography>
            </Box>

            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{
                  borderColor: "#10b981",
                  color: "#059669",
                  fontWeight: 600,
                  "&:hover": { borderColor: "#059669", backgroundColor: "#ecfdf5" },
                }}
              >
                Editar
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setIsEditing(false)}
                  startIcon={<Close />}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  startIcon={<Save />}
                  sx={{ backgroundColor: "#10b981", "&:hover": { backgroundColor: "#059669" }, fontWeight: 700 }}
                >
                  Guardar cambios
                </Button>
              </Box>
            )}
          </Box>

          {!isEditing ? (
            /* ── VIEW MODE ── */
            <Box display="flex" flexDirection="column" gap={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Nombre completo
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="#1f2937">
                    {formData.name}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Especialidad(es) / Categoría
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={formData.category}
                      size="small"
                      sx={{ bgcolor: "#fce4ec", color: "#be185d", fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Email
                  </Typography>
                  <Typography variant="body1" color="#374151">
                    {formData.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    WhatsApp
                  </Typography>
                  <Typography variant="body1" color="#374151">
                    {formData.phone}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Dirección
                  </Typography>
                  <Typography variant="body1" color="#374151">
                    {formData.address}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Tarifa promedio de servicio
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="#1f2937">
                    ${formData.price}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Años de Experiencia
                  </Typography>
                  <Typography variant="body1" color="#374151">
                    {formData.experience} años
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Formas de pago aceptadas
                  </Typography>
                  <Box display="flex" gap={1} mt={0.5}>
                    <Chip
                      label="Presencial en Local"
                      size="small"
                      sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Descripción
                </Typography>
                <Typography variant="body2" color="#4b5563" mt={0.5} lineHeight={1.6}>
                  {formData.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Estado del perfil
                </Typography>
                <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                  <Chip
                    label={profileStatus === "published" ? "Publicado" : "Oculto"}
                    color={profileStatus === "published" ? "success" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    color={profileStatus === "published" ? "error" : "success"}
                    startIcon={profileStatus === "published" ? <VisibilityOff /> : <Visibility />}
                    onClick={() =>
                      setProfileStatus(profileStatus === "published" ? "draft" : "published")
                    }
                  >
                    {profileStatus === "published" ? "Ocultar en la app" : "Publicar perfil"}
                  </Button>
                </Box>
              </Box>

              {/* SECCIÓN HORARIO LABORAL (VIEW MODE) */}
              <Box mt={1} pt={3} borderTop="1px solid #f3f4f6">
                <Typography variant="subtitle1" fontWeight={700} color="#1f2937" mb={1.5}>
                  Horario Laboral
                </Typography>
                <Grid container spacing={1.5}>
                  {schedules.map((sched, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1.5}
                        bgcolor="#f9fafb"
                        borderRadius={2}
                      >
                        <Typography variant="body2" fontWeight={600} color="#374151">
                          {sched.label}
                        </Typography>
                        {sched.enabled ? (
                          <Box textAlign="right">
                            <Typography variant="body2" color="#059669" fontWeight={600}>
                              {sched.startTime} - {sched.endTime}
                            </Typography>
                            {sched.hasBreak && (
                              <Typography variant="caption" color="text.secondary">
                                Receso: {sched.breakStart} - {sched.breakEnd}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Cerrado
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          ) : (
            /* ── EDIT MODE (MATCHING DOCTOR FORM EXACTLY) ── */
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Row 1: Nombre completo & Especialidad */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Nombre completo
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Solo letras y espacios — Máx. 100 caracteres
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Especialidad(es) / Categoría
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <MenuItem value="Centro Estético & Spa">Centro Estético & Spa</MenuItem>
                      <MenuItem value="Estética Facial & Cosmiatría">Estética Facial & Cosmiatría</MenuItem>
                      <MenuItem value="Dermatología Estética">Dermatología Estética</MenuItem>
                      <MenuItem value="Masajes & Bienestar">Masajes & Bienestar</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Puedes seleccionar múltiples opciones
                  </Typography>
                </Grid>
              </Grid>

              {/* Row 2: Email & WhatsApp */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Formato: ejemplo@correo.com — Máx. 255 caracteres
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    WhatsApp
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Exactamente 10 dígitos
                  </Typography>
                </Grid>
              </Grid>

              {/* Row 3: Dirección */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Dirección
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  sx={{ mt: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  Dirección del establecimiento — Máx. 200 caracteres
                </Typography>
              </Box>

              {/* Row 4: Google Maps Link */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Link de Google Maps (opcional)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://maps.app.goo.gl/..."
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  sx={{ mt: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  Las coordenadas se extraerán automáticamente — Máx. 500 caracteres
                </Typography>
              </Box>

              {/* Row 5: Latitud & Longitud */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Latitud (opcional)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ejemplo: -0.180653"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Entre -90 y 90
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Longitud (opcional)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ejemplo: -78.467834"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Entre -180 y 180
                  </Typography>
                </Grid>
              </Grid>

              {/* Row 6: Tarifa & Experiencia */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Tarifa de servicio referencial ($)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Solo números — Máx. $999,999.99
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Años de Experiencia
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    Máx. 99 años
                  </Typography>
                </Grid>
              </Grid>

              {/* Row 7: Descripción */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Descripción
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={{ mt: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  Máx. 2000 caracteres
                </Typography>
              </Box>

              {/* Row 8: Formas de pago aceptadas */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Formas de pago aceptadas
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <MenuItem value="cash">Solo Presencial (Local)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Row 9: Estado del perfil */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Estado del perfil
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select
                    value={profileStatus}
                    onChange={(e) => setProfileStatus(e.target.value as any)}
                  >
                    <MenuItem value="published">Publicado</MenuItem>
                    <MenuItem value="draft">Borrador / Oculto</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  {profileStatus === "published" ? "Tu perfil es visible en la app" : "Tu perfil no es visible en la app"}
                </Typography>
              </Box>

              {/* ── INTERACTIVE HORARIO LABORAL BUILDER ── */}
              <Box mt={1} pt={3} borderTop="1px solid #e5e7eb">
                <Typography variant="subtitle1" fontWeight={700} color="#1f2937" mb={2}>
                  Horario Laboral
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {schedules.map((sched, idx) => (
                    <Paper
                      key={sched.dayKey}
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                        {/* Checkbox + Day Label */}
                        <Box display="flex" alignItems="center" gap={1} minWidth={110}>
                          <input
                            type="checkbox"
                            checked={sched.enabled}
                            onChange={(e) => handleScheduleToggle(idx, e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: "#059669" }}
                          />
                          <Typography variant="body2" fontWeight={700} color="#374151">
                            {sched.label}
                          </Typography>
                        </Box>

                        {sched.enabled ? (
                          <Box display="flex" flexDirection="column" gap={1.5} flex={1}>
                            {/* Turno Principal */}
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <input
                                type="time"
                                step="1800"
                                value={sched.startTime}
                                onChange={(e) =>
                                  handleScheduleTimeChange(idx, "startTime", e.target.value)
                                }
                                style={{
                                  padding: "6px 12px",
                                  border: "1px solid #d1d5db",
                                  borderRadius: 6,
                                  fontSize: "0.875rem",
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                              <input
                                type="time"
                                step="1800"
                                value={sched.endTime}
                                onChange={(e) =>
                                  handleScheduleTimeChange(idx, "endTime", e.target.value)
                                }
                                style={{
                                  padding: "6px 12px",
                                  border: "1px solid #d1d5db",
                                  borderRadius: 6,
                                  fontSize: "0.875rem",
                                }}
                              />
                            </Box>

                            {/* Almuerzo / Receso */}
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
                                Almuerzo
                              </Typography>
                              <input
                                type="time"
                                step="1800"
                                value={sched.breakStart}
                                onChange={(e) =>
                                  handleScheduleTimeChange(idx, "breakStart", e.target.value)
                                }
                                style={{
                                  padding: "4px 8px",
                                  border: "1px solid #d1d5db",
                                  borderRadius: 6,
                                  fontSize: "0.8rem",
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                -
                              </Typography>
                              <input
                                type="time"
                                step="1800"
                                value={sched.breakEnd}
                                onChange={(e) =>
                                  handleScheduleTimeChange(idx, "breakEnd", e.target.value)
                                }
                                style={{
                                  padding: "4px 8px",
                                  border: "1px solid #d1d5db",
                                  borderRadius: 6,
                                  fontSize: "0.8rem",
                                }}
                              />
                              <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => handleClearLunch(idx)}
                                sx={{ textTransform: "none", fontSize: "0.75rem", ml: 1 }}
                              >
                                Sin almuerzo
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Cerrado
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button variant="outlined" color="inherit" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  startIcon={<Save />}
                  sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" }, fontWeight: 700 }}
                >
                  Guardar cambios
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* ── RIGHT COLUMN: LOGO, GALERÍA & VISTA PREVIA MOBILE (1/3 width) ── */}
      <Grid item xs={12} lg={4}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Card 1: Logo del Centro */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              Imagen de Perfil
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Foto principal que aparece en tu perfil.
            </Typography>

            <Box display="flex" flexDirection="column" alignItems="center" my={1}>
              <Box
                sx={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  bgcolor: "#fce4ec",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "3px solid #db2777",
                  mb: 2,
                }}
              >
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo Centro Estético"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Storefront sx={{ fontSize: 56, color: "#be185d" }} />
                )}
              </Box>

              {/* Banner Tamaño Recomendado */}
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#eff6ff",
                  borderRadius: 2,
                  border: "1px solid #bfdbfe",
                  width: "100%",
                  mb: 2,
                }}
              >
                <Typography variant="caption" color="#1e40af" fontWeight={700} display="block">
                  📐 Tamaño recomendado
                </Typography>
                <Typography variant="caption" color="#1e3a8a">
                  400 × 400 px — Proporción 1:1
                </Typography>
              </Box>

              <input
                type="file"
                ref={logoInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleLogoUpload}
              />

              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => logoInputRef.current?.click()}
                sx={{
                  width: "100%",
                  borderColor: "#ec4899",
                  color: "#be185d",
                  fontWeight: 600,
                  "&:hover": { borderColor: "#be185d", bgcolor: "#fdf2f8" },
                }}
              >
                Cambiar foto de perfil
              </Button>
            </Box>
          </Paper>

          {/* Card 2: Imágenes de Vista Previa (Galería) */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="h6" fontWeight={700}>
                Imágenes de Vista Previa
              </Typography>
              <Chip label={`${previewImages.length}/10`} size="small" color="secondary" />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Galería deslizante que los pacientes ven en tu perfil.
            </Typography>

            {/* Banner Tamaño Recomendado Galería */}
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#eff6ff",
                borderRadius: 2,
                border: "1px solid #bfdbfe",
                width: "100%",
                mb: 2,
              }}
            >
              <Typography variant="caption" color="#1e40af" fontWeight={700} display="block">
                📐 Tamaño recomendado
              </Typography>
              <Typography variant="caption" color="#1e3a8a">
                800 × 400 px — Proporción 2:1
              </Typography>
            </Box>

            <Grid container spacing={1.5} mb={2}>
              {previewImages.map((img, idx) => (
                <Grid item xs={6} key={idx}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 90,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Galeria ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        left: 4,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(220, 38, 38, 0.9)" },
                      }}
                    >
                      <Delete sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <input
              type="file"
              ref={galleryInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleGalleryUpload}
            />

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddPhotoAlternate />}
              onClick={() => galleryInputRef.current?.click()}
              sx={{
                py: 1.5,
                border: "2px dashed #ec4899",
                borderRadius: 2,
                color: "#be185d",
                fontWeight: 600,
                "&:hover": { bgcolor: "#fdf2f8", borderColor: "#db2777" },
              }}
            >
              Agregar imagen a galería
            </Button>
          </Paper>

          {/* BOTÓN GUARDAR FOTOS - Visible cuando hay cambios de imagen */}
          {hasUnsavedImages && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #fbcfe8",
                bgcolor: "#fff5f8",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Save sx={{ color: "#db2777" }} />
                <Typography variant="subtitle2" fontWeight={700} color="#be185d">
                  Cambios de imagen sin guardar
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Has realizado modificaciones en tus fotos o galería de vista previa.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSaveImages}
                startIcon={<Save />}
                sx={{ bgcolor: "#db2777", "&:hover": { bgcolor: "#be185d" }, fontWeight: 700 }}
              >
                Guardar fotos
              </Button>
            </Paper>
          )}

          {/* Card 3: VISTA PREVIA EN APP (Mockup de celular) */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Vista previa en App
            </Typography>

            <Box display="flex" justifyContent="center">
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
              >
                {/* Carrusel de Galería en Celular */}
                <Box sx={{ height: 160, bgcolor: "#f3f4f6", position: "relative" }}>
                  {previewImages.length > 0 ? (
                    <img
                      src={previewImages[carouselIndex % previewImages.length]}
                      alt="Preview app"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                      <Typography variant="caption" color="text.secondary">
                        Sin imágenes
                      </Typography>
                    </Box>
                  )}

                  {previewImages.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {previewImages.map((_, i) => (
                        <Box
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          sx={{
                            width: i === carouselIndex ? 16 : 6,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: i === carouselIndex ? "#ffffff" : "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            transition: "all 0.3s",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Contenido de la Card en Celular */}
                <Box p={2}>
                  <Typography variant="subtitle1" fontWeight={700} color="#1f2937">
                    {formData.name}
                  </Typography>
                  <Chip
                    label={formData.category}
                    size="small"
                    sx={{ mt: 0.5, mb: 1, bgcolor: "#fce4ec", color: "#be185d", fontWeight: 600, fontSize: "0.65rem" }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }} noWrap>
                    {formData.address}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    sx={{ mt: 2, bgcolor: "#db2777", "&:hover": { bgcolor: "#be185d" }, fontWeight: 700 }}
                  >
                    Ver Centro Estético
                  </Button>
                </Box>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" align="center" display="block" mt={2}>
              Así verán tu perfil los clientes en la app
            </Typography>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};
