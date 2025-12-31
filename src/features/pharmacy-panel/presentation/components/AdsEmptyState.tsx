import { Campaign } from "@mui/icons-material";
import { Box, Typography, alpha, useTheme } from "@mui/material";

export const AdsEmptyState = () => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={2}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Campaign sx={{ fontSize: 40, opacity: 0.5 }} />
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        No tienes anuncios activos
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Crea un anuncio para promocionar tus servicios o productos destacados.
      </Typography>
    </Box>
  );
};
