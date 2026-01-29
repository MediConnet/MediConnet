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
}

export const PromotionalBanner = ({
  label,
  discount,
  description,
  buttonText,
  imageUrl,
  endDate,
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
        border: "1px solid #e5e7eb",
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
          background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
          position: "relative",
          overflow: "hidden",
          minHeight: 200,
        }}
      >
        {/* Patrón de ondas en el fondo */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            left: -20,
            width: 150,
            height: 150,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.3)",
            opacity: 0.5,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Label */}
          <Chip
            label={label}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.9)",
              color: "#0e7490",
              fontWeight: 700,
              fontSize: "0.75rem",
              mb: 2,
              textTransform: "uppercase",
            }}
          />

          {/* Descuento */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#0e7490",
              mb: 1,
              lineHeight: 1.2,
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
            }}
          >
            {description}
          </Typography>

          {/* Botón CTA */}
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: "#0e7490",
              color: "white",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#0c5d73",
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>

        {/* Contador regresivo - Solo mostrar si no ha expirado */}
        {endDate && timeRemaining && !isExpired && (
          <Box sx={{ position: "relative", zIndex: 1, mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#0e7490",
                fontWeight: 600,
                fontSize: "0.875rem",
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
          bgcolor: "#f0f9ff",
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
              objectFit: "contain",
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
              bgcolor: "#e0f2fe",
              minHeight: 200,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Sin imagen
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
