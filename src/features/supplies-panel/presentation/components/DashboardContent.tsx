import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { 
  Inventory, 
  Visibility, 
  StarRate, 
  TrendingUp 
} from "@mui/icons-material";

interface DashboardContentProps {
  visits: number;
  reviews: number;
  rating: number;
}

export const DashboardContent = ({
  visits,
  reviews,
  rating,
}: DashboardContentProps) => {
  // Calcular el máximo para las barras
  const maxValue = Math.max(visits, reviews * 100, rating * 100);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid2 container spacing={3}>
        {/* Gráfico de Barras Principal */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "rgba(20, 184, 166, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp sx={{ fontSize: 24, color: "#14b8a6" }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Estadísticas de Rendimiento
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Métricas principales de tu tienda
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={4}>
                {/* Visitas */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Visibility sx={{ fontSize: 20, color: "#14b8a6" }} />
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Visitas al perfil
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={700} color="#14b8a6">
                      {visits.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: "100%",
                      height: 12,
                      bgcolor: "#f3f4f6",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(visits / maxValue) * 100}%`,
                        height: "100%",
                        bgcolor: "#14b8a6",
                        borderRadius: 2,
                        transition: "width 1s ease",
                      }}
                    />
                  </Box>
                </Box>

                {/* Reseñas */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <StarRate sx={{ fontSize: 20, color: "#f59e0b" }} />
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Reseñas recibidas
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={700} color="#f59e0b">
                      {reviews.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: "100%",
                      height: 12,
                      bgcolor: "#f3f4f6",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(reviews * 100 / maxValue) * 100}%`,
                        height: "100%",
                        bgcolor: "#f59e0b",
                        borderRadius: 2,
                        transition: "width 1s ease",
                      }}
                    />
                  </Box>
                </Box>

                {/* Calificación */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <StarRate sx={{ fontSize: 20, color: "#3b82f6" }} />
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Calificación promedio
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={700} color="#3b82f6">
                        {rating.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        / 5.0
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      width: "100%",
                      height: 12,
                      bgcolor: "#f3f4f6",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(rating / 5) * 100}%`,
                        height: "100%",
                        bgcolor: "#3b82f6",
                        borderRadius: 2,
                        transition: "width 1s ease",
                      }}
                    />
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarRate
                        key={i}
                        sx={{
                          fontSize: 18,
                          color: i < Math.floor(rating) ? "#3b82f6" : "#e5e7eb",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Panel Lateral con Resumen */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Tarjeta de Resumen Rápido */}
            <Card
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Inventory sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="white">
                      Gestiona tu Catálogo
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ mt: 1 }}>
                      Agrega y organiza tus productos desde la pestaña "Productos"
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Tarjeta de Estadísticas Rápidas */}
            <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Resumen Rápido
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Total de visitas
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {visits.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Reseñas totales
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#f59e0b">
                      {reviews.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Satisfacción
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#3b82f6">
                      {((rating / 5) * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
};

