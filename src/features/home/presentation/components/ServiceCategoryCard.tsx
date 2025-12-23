import { ArrowForward } from "@mui/icons-material";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ServiceCategory } from "../../domain/ServiceCategory.entity";
import { IconMapper } from "./IconMapper";

interface ServiceCategoryCardProps {
  category: ServiceCategory;
}

export const ServiceCategoryCard = ({ category }: ServiceCategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 20px 40px ${category.shadowColor}`,
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(category.route)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          p: 0,
        }}
      >
        {/* --- SECCIÓN SUPERIOR (COLOR + ÍCONO) --- */}
        <Box
          sx={{
            backgroundColor: category.color,
            py: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconMapper
            iconName={category.icon}
            sx={{ fontSize: 60, color: "white" }}
          />
        </Box>

        {/* --- SECCIÓN INFERIOR (BLANCO + TEXTO) --- */}
        <Box
          sx={{
            p: 4,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          {/* Título (Texto oscuro) */}
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            {category.title}
          </Typography>

          {/* Descripción (Texto gris) */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
              maxWidth: "90%",
            }}
          >
            {category.description}
          </Typography>

          {/* Link "Explorar" (Color de la categoría) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: category.color,
              fontWeight: 600,
              mt: "auto",
            }}
          >
            <Typography
              variant="button"
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Explorar
            </Typography>
            <ArrowForward fontSize="small" />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};
