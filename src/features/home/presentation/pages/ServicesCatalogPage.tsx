import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ServiceCategoryCard } from "../components/ServiceCategoryCard";
import { useServiceCategories } from "../hooks/useHome";

export const ServicesCatalogPage = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useServiceCategories();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f0fdfa", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header con botón volver */}
        <Box sx={{ mb: 6, textAlign: "center", position: "relative" }}>
          <Box
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ArrowBack />
            <Typography variant="body2" fontWeight={500}>
              Volver
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}
          >
            Explora Nuestros Servicios
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              fontWeight: 400,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Selecciona el tipo de servicio que necesitas y encuentra los mejores
            profesionales cerca de ti
          </Typography>
        </Box>

        <Grid2 container spacing={4}>
          {categories?.map((category) => (
            <Grid2 key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ServiceCategoryCard category={category} />
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};
