import { Box, Typography } from "@mui/material";
import iconLoading from "../../assets/icon_loading.png";

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = 40, 
  fullScreen = false,
  text 
}: LoadingSpinnerProps) => {
  const containerStyles = fullScreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        gap: 2,
      }
    : {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 3,
      };

  return (
    <Box sx={containerStyles}>
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Icono blanco, transparente, con sombra y rotación */}
        <Box
          component="img"
          src={iconLoading}
          alt="Loading"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))", // Blanco + sombra
            opacity: 0.7, // Transparencia
            animation: "spin 1.5s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      </Box>
      {text && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            textAlign: "center",
            fontSize: "0.875rem",
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};
