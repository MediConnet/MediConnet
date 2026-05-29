import {
  AirportShuttle,
  Inventory,
  LocalHospital,
  LocalPharmacy,
  Science,
  CheckCircle,
} from "@mui/icons-material";
import { Avatar, Box, Chip, Paper, Stack, Typography, Skeleton, Alert } from "@mui/material";
import type { ActiveService } from "../../../admin-dashboard/domain/service-stats.entity";

interface Props {
  services: ActiveService[];
  loading?: boolean;
}

export const ActiveServicesList = ({ services, loading = false }: Props) => {
  // Helper para obtener icono según tipo
  const getIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <LocalHospital fontSize="small" />;
      case "pharmacy":
        return <LocalPharmacy fontSize="small" />;
      case "laboratory":
        return <Science fontSize="small" />;
      case "ambulance":
        return <AirportShuttle fontSize="small" />;
      case "supplies":
        return <Inventory fontSize="small" />;
      default:
        return <Inventory fontSize="small" />;
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 3 }} />
        ))}
      </Stack>
    );
  }

  // Estado vacío
  if (!services || services.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CheckCircle sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay servicios activos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Los servicios aprobados aparecerán aquí
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {services.map((service) => (
        <Paper
          key={service.id}
          elevation={0}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.100",
            transition: "background-color 0.2s",
            "&:hover": {
              bgcolor: "grey.50",
            },
          }}
        >
          {/* Lado Izquierdo: Icono + Textos */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#E0F2F1",
                color: "#009688",
                width: 40,
                height: 40,
              }}
            >
              {getIcon(service.type)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {service.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {service.location}
              </Typography>
            </Box>
          </Box>

          {/* Lado Derecho: Badge Activo */}
          <Chip
            label="Activo"
            size="small"
            sx={{
              bgcolor: "#E8F5E9",
              color: "#2E7D32",
              fontWeight: 600,
              borderRadius: 1,
              height: 24,
            }}
          />
        </Paper>
      ))}
    </Stack>
  );
};
