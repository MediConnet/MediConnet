import {
  Edit,
  PhotoCamera,
  Description,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { SupplyDashboard } from "../../domain/SupplyDashboard.entity";

interface ProfileSectionProps {
  data: SupplyDashboard;
  onUpdate?: (updatedData: SupplyDashboard) => void;
}

export const ProfileSection = ({ data, onUpdate }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  }, [data]);

  useEffect(() => {
    if (user?.id) {
      const savedImage = localStorage.getItem(
        `supply-profile-image-${user.id}`
      );
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [user?.id]);

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
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const updatedData: SupplyDashboard = {
      ...data,
      supply: {
        ...data.supply,
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
      },
    };

    localStorage.setItem(
      `supply-profile-${user.id}`,
      JSON.stringify(updatedData)
    );

    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedData);
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
        if (user?.id) {
          localStorage.setItem(`supply-profile-image-${user.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
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
    </Box>
  );
};
