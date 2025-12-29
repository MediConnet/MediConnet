import {
  AirportShuttle,
  Inventory,
  LocalHospital,
  LocalPharmacy,
  Science,
} from "@mui/icons-material";
import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { ActiveService } from "../../domain/service-stats.entity";

interface Props {
  services: ActiveService[];
}

export const ActiveServicesList = ({ services }: Props) => {
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
      default:
        return <Inventory fontSize="small" />;
    }
  };

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
