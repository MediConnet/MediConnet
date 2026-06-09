import {
  Edit,
  PhotoCamera,
  Description,
  Visibility,
  VisibilityOff,
  LocationOn,
  AccessTime,
  CloudUpload,
  Close,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";
import { updateSupplyProfileAPI } from "../../infrastructure/supply.api";

interface ProfileSectionProps {
  data: SupplyDashboard;
  onUpdate?: (updatedData: SupplyDashboard) => void;
}

export const ProfileSection = ({ data, onUpdate }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const authStore = useAuthStore();
  const { user } = authStore;

  const [formData, setFormData] = useState({
    name: data?.supply?.name || "",
    description: data?.supply?.description || "",
    isActive: data?.supply?.isActive !== false,
  });

  useEffect(() => {
    if (data?.supply) {
      setFormData({
        name: data.supply.name,
        description: data.supply.description,
        isActive: data.supply.isActive !== false,
      });
      setProfileImage(data.supply.logoUrl || data.supply.profile_picture_url || null);
      setBannerImage(data.supply.imageUrl || null);
      setPreviewImages(data.supply.preview_images || []);
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (data?.supply) {
      setFormData({
        name: data.supply.name,
        description: data.supply.description,
        isActive: data.supply.isActive !== false,
      });
      setProfileImage(data.supply.logoUrl || data.supply.profile_picture_url || null);
      setBannerImage(data.supply.imageUrl || null);
      setPreviewImages(data.supply.preview_images || []);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      // ✅ 100%: persistir en backend
      const saved = await updateSupplyProfileAPI({
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        logoUrl: profileImage,
        profile_picture_url: profileImage,
        imageUrl: bannerImage,
        preview_images: previewImages,
        // mantener campos existentes si el backend requiere body completo
        address: data?.supply?.address || "",
        phone: data?.supply?.phone || "",
        whatsapp: data?.supply?.whatsapp || "",
        schedule: data?.supply?.schedule || "",
        latitude: data?.supply?.latitude ?? null,
        longitude: data?.supply?.longitude ?? null,
        google_maps_url: data?.supply?.google_maps_url ?? null,
      });

      const updatedData: SupplyDashboard = {
        ...data,
        supply: {
          ...data.supply,
          name: saved.name,
          description: saved.description,
          isActive: saved.isActive,
          address: saved.address,
          phone: saved.phone,
          whatsapp: saved.whatsapp,
          schedule: saved.schedule,
          logoUrl: saved.logoUrl || saved.profile_picture_url || null,
          profile_picture_url: saved.profile_picture_url || null,
          imageUrl: saved.imageUrl || null,
          preview_images: saved.preview_images || [],
        },
      };

      setIsEditing(false);
      if (onUpdate) onUpdate(updatedData);
    } catch (e: any) {
      console.error("Error updating supply profile:", e);
      alert(e?.message || "No se pudo guardar el perfil. Intenta de nuevo.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBannerImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) {
          alert(`La imagen ${file.name} debe ser menor a 5MB`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreviewImages((prev) => {
            if (prev.length >= 6) {
              alert("Puedes subir un máximo de 6 imágenes de vista previa");
              return prev;
            }
            return [...prev, base64String];
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteGalleryImage = (indexToDelete: number) => {
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  if (!data || !data.supply) {
    return (
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography color="text.secondary">
            Cargando información del perfil...
          </Typography>
        </Paper>
      </Box>
    );
  }

  const supply = data.supply;
  
  // Colores del tema para insumos médicos (naranja)
  const themeColor = "#f97316"; // Naranja
  const bgCardColor = "#fff7ed"; // Fondo naranja suave

  return (
    <Box>
      <Grid2 container spacing={3}>
        {/* Columna izquierda: Información del Perfil */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              height: "100%",
            }}
          >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Mi Perfil Comercial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Información visible en el perfil de tu negocio
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Editar Perfil
          </Button>
        </Box>

        <Stack spacing={3}>
          {/* Cover Banner */}
          {(bannerImage || supply.imageUrl) && (
            <Box
              sx={{
                width: "100%",
                height: 180,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box
                component="img"
                src={bannerImage || supply.imageUrl || ""}
                alt="Banner de portada"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* Logo y Nombre */}
          <Grid2 container spacing={4} alignItems="center">
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                {profileImage ? (
                  <Box
                    component="img"
                    src={profileImage}
                    alt={supply.name}
                    onClick={handleImageClick}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 150,
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      cursor: "pointer",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      p: 1,
                      bgcolor: "white",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#f97316",
                        boxShadow: "0 2px 8px rgba(249, 115, 22, 0.2)",
                      },
                    }}
                  />
                ) : (
                  <Box
                    onClick={handleImageClick}
                    sx={{
                      width: 150,
                      height: 150,
                      bgcolor: "grey.100",
                      borderRadius: 2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed",
                      borderColor: "grey.300",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#f97316",
                        bgcolor: "grey.50",
                      },
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 60, color: "grey.400" }} />
                  </Box>
                )}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
                mt={1}
                sx={{ cursor: "pointer" }}
                onClick={handleImageClick}
              >
                Click para cambiar logo
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack spacing={1}>
                <Typography variant="h4" fontWeight={700} color="#f97316">
                  {isEditing ? formData.name : supply.name}
                </Typography>
                <Chip
                  label={supply.isActive !== false ? "Publicado" : "No publicado"}
                  color={supply.isActive !== false ? "success" : "error"}
                  size="small"
                  icon={
                    supply.isActive !== false ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )
                  }
                  sx={{ width: "fit-content" }}
                />
              </Stack>
            </Grid2>
          </Grid2>

          <Divider />

          {/* Descripción */}
          <Box display="flex" gap={2}>
            <Description sx={{ color: "text.secondary", mt: 0.5 }} />
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Descripción
              </Typography>
              <Typography variant="body1" color="text.primary" mt={0.5}>
                {isEditing
                  ? formData.description
                  : supply.description || "Sin descripción definida."}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Estado del Perfil */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              mb={1}
              display="block"
            >
              Estado del Perfil
            </Typography>
            <Chip
              label={supply.isActive !== false ? "Publicado" : "No publicado"}
              color={supply.isActive !== false ? "success" : "error"}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Galería de Vista Previa */}
          {previewImages && previewImages.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  mb={1.5}
                  display="block"
                >
                  Galería de Fotos del Establecimiento / Productos
                </Typography>
                <Grid2 container spacing={2}>
                  {previewImages.map((imgUrl, idx) => (
                    <Grid2 size={{ xs: 4 }} key={idx}>
                      <Box
                        component="img"
                        src={imgUrl}
                        alt={`Vista previa ${idx}`}
                        sx={{
                          width: "100%",
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            </>
          )}
        </Stack>

        {/* Modal de Edición */}
        {isEditing && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Editar Perfil Comercial
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Nombre del Negocio"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                multiline
                rows={4}
                required
              />
              {/* Logo / Avatar del Negocio */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Logo de la Tienda
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "2px dashed",
                      borderColor: "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.100",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#f97316" },
                    }}
                    onClick={handleImageClick}
                  >
                    {profileImage ? (
                      <Box component="img" src={profileImage} alt="Logo" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <PhotoCamera sx={{ color: "grey.400" }} />
                    )}
                  </Box>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloudUpload />}
                      onClick={handleImageClick}
                      sx={{ textTransform: "none", borderColor: "#f97316", color: "#f97316", "&:hover": { borderColor: "#ea580c", bgcolor: "#fff7ed" } }}
                    >
                      {profileImage ? "Cambiar logo" : "Subir logo"}
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                      JPG, PNG. Mín. 500x500px (cuadrado). Máx. 5MB.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Banner de Portada */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Banner de Portada
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={bannerInputRef}
                    style={{ display: "none" }}
                    onChange={handleBannerChange}
                  />
                  <Box
                    sx={{
                      width: 150,
                      height: 72,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "2px dashed",
                      borderColor: "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.100",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#f97316" },
                    }}
                    onClick={handleBannerClick}
                  >
                    {bannerImage ? (
                      <Box component="img" src={bannerImage} alt="Banner" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <CloudUpload sx={{ color: "grey.400" }} />
                    )}
                  </Box>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloudUpload />}
                      onClick={handleBannerClick}
                      sx={{ textTransform: "none", borderColor: "#f97316", color: "#f97316", "&:hover": { borderColor: "#ea580c", bgcolor: "#fff7ed" } }}
                    >
                      {bannerImage ? "Cambiar banner" : "Subir banner"}
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                      Recomendado 800x180px (relación 4:1). Máx. 5MB.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Galería de Vista Previa */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Galería de Fotos de Vista Previa (Máx. 6)
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={galleryInputRef}
                  style={{ display: "none" }}
                  onChange={handleGalleryChange}
                />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                  {previewImages.map((imgUrl, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "grey.200",
                        position: "relative",
                        "&:hover .delete-btn": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={imgUrl}
                        alt={`Gallery preview ${idx}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={() => handleDeleteGalleryImage(idx)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                          color: "error.main",
                          opacity: 0,
                          transition: "opacity 0.2s",
                          p: 0.25,
                          "&:hover": {
                            bgcolor: "white",
                          },
                        }}
                      >
                        <Close sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                  {previewImages.length < 6 && (
                    <Box
                      onClick={handleGalleryClick}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        border: "2px dashed",
                        borderColor: "grey.300",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        bgcolor: "grey.50",
                        "&:hover": {
                          borderColor: "#f97316",
                          bgcolor: "grey.100",
                        },
                      }}
                    >
                      <CloudUpload sx={{ color: "grey.400", mb: 0.5, fontSize: 20 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                        Añadir
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  bgcolor: "white",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  Estado del Perfil
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <Typography variant="body2">
                    {formData.isActive
                      ? "Publicado (visible en la app)"
                      : "No publicado (oculto en la app)"}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button onClick={handleCancel} sx={{ color: "text.secondary" }}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#f97316",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#ea580c",
                    },
                  }}
                >
                  Guardar Cambios
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Paper>
        </Grid2>

        {/* Columna derecha: Vista previa en App */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          {/* Sección de carga de imagen */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Imagen de Perfil
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "grey.100",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                {profileImage ? (
                  <Box
                    component="img"
                    src={profileImage}
                    alt={supply.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <PhotoCamera sx={{ color: "grey.400" }} />
                )}
              </Box>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={handleImageClick}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {profileImage ? "Cambiar foto" : "Subir foto"}
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Se recomienda una imagen rectangular para el banner.
            </Typography>
          </Paper>

          {/* Vista previa en App */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={3}>
              Vista previa en App
            </Typography>

            <Box display="flex" justifyContent="center">
              {/* Card móvil de insumos médicos */}
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "grey.100",
                }}
              >
                {/* Imagen Superior */}
                <Box
                  sx={{
                    height: 176,
                    width: "100%",
                    bgcolor: "grey.200",
                    position: "relative",
                  }}
                >
                  {bannerImage || supply.imageUrl || profileImage ? (
                    <Box
                      component="img"
                      src={bannerImage || supply.imageUrl || profileImage || undefined}
                      alt={supply.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        color: "grey.400",
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 40, opacity: 0.5 }} />
                    </Box>
                  )}
                </Box>

                {/* Contenido (Fondo Naranja Suave) */}
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    bgcolor: bgCardColor,
                  }}
                >
                  {/* Nombre */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "grey.900",
                      lineHeight: 1.2,
                    }}
                  >
                    {isEditing ? formData.name || "Nombre del Negocio" : supply.name}
                  </Typography>

                  {/* Info: Dirección */}
                  <Box display="flex" alignItems="flex-start" gap={1} sx={{ minWidth: 0 }}>
                    <LocationOn
                      sx={{ fontSize: 18, color: "grey.600", mt: 0.5, flexShrink: 0 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {supply.address || "Dirección"}
                    </Typography>
                  </Box>

                  {/* Info: Descripción (truncada) */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: "grey.600",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {isEditing
                      ? formData.description || "Descripción"
                      : supply.description || "Sin descripción"}
                  </Typography>

                  {/* Botón Ver Información */}
                  <Box mt={1} width="100%">
                    <Box
                      sx={{
                        bgcolor: themeColor,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        px: 2,
                        py: 1.25,
                        borderRadius: 2,
                        textAlign: "center",
                        cursor: "default",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      Ver información
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
              mt={2}
            >
              Así verán tu perfil los usuarios en la app
            </Typography>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};
