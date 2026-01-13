import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";

interface DashboardContentProps {
  profile: AmbulanceProfile;
}

export const DashboardContent = ({ profile }: DashboardContentProps) => {
  const stats = profile.stats || {
    profileViews: 0,
    contactClicks: 0,
    totalReviews: 0,
    averageRating: 0,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Resumen de la Ambulancia
      </Typography>

      {/* Información Adicional */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Resumen de Actividad
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Visitas al Perfil
            </Typography>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {stats.profileViews}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Contactos
            </Typography>
            <Typography variant="h5" fontWeight={700} color="info.main">
              {stats.contactClicks}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Total Reseñas
            </Typography>
            <Typography variant="h5" fontWeight={700} color="warning.main">
              {stats.totalReviews}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Calificación Promedio
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#FFC107">
              {stats.averageRating.toFixed(1)} ⭐
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.100",
          mt: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Información Adicional
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aquí se podría añadir más información relevante para la ambulancia, como próximos eventos,
          noticias del sector, etc.
        </Typography>
      </Paper>
    </Box>
  );
};

