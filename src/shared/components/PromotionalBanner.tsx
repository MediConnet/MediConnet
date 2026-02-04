import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface PromotionalBannerProps {
  label: string;
  discount: string;
  description: string;
  buttonText: string;
  imageUrl?: string;
  endDate?: string | Date;

  backgroundColor?: string;
  accentColor?: string;
}

export const PromotionalBanner = ({
  label,
  discount,
  description,
  buttonText,
  imageUrl,
  endDate,
  // Valores por defecto (Fallback Teal) si no vienen de la DB
  backgroundColor = "#E0F2F1",
  accentColor = "#009688",
}: PromotionalBannerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endDate) {
      setTimeRemaining("");
      setIsExpired(false);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeRemaining("");
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.08)",
        boxShadow: 2,
        bgcolor: "white",
        minHeight: 200,
        height: "100%",
      }}
    >
      {/* Sección izquierda - Texto y CTA */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: backgroundColor,
          position: "relative",
          overflow: "hidden",
          minHeight: 200,
        }}
      >
        {/* Patrón de ondas decorativo (Sutil) */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            bgcolor: "white",
            opacity: 0.15,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            right: -20,
            width: 140,
            height: 140,
            borderRadius: "50%",
            bgcolor: accentColor,
            opacity: 0.05,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Label */}
          <Chip
            label={label}
            sx={{
              bgcolor: "white",
              color: accentColor,
              fontWeight: 700,
              fontSize: "0.75rem",
              mb: 2,
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />

          {/* Descuento */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: accentColor,
              mb: 1,
              lineHeight: 1.2,
              filter: "brightness(0.9)",
            }}
          >
            {discount}
          </Typography>

          {/* Descripción */}
          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              mb: 3,
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {description}
          </Typography>

          {/* Botón CTA */}
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: accentColor,
              color: "white",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": {
                bgcolor: accentColor,
                filter: "brightness(0.85)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>

        {/* Contador regresivo */}
        {endDate && timeRemaining && !isExpired && (
          <Box sx={{ position: "relative", zIndex: 1, mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: accentColor,
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              ⏱️ Expira en: {timeRemaining}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sección derecha - Imagen */}
      <Box
        sx={{
          width: { xs: "40%", md: "45%" },
          minWidth: 200,
          position: "relative",
          bgcolor: "#f8fafc", // Gris muy suave de fondo para la imagen
          display: { xs: "none", sm: "flex" },
          alignItems: "stretch",
          minHeight: 200,
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt="Profesionales"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: backgroundColor,
              opacity: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Sin imagen
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
