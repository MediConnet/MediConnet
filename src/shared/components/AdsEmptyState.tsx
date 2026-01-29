import { Campaign } from "@mui/icons-material";
import { Box, Typography, alpha, useTheme } from "@mui/material";

interface AdsEmptyStateProps {
  title?: string;
  description?: string;
}

export const AdsEmptyState = ({
  title = "Crea tu anuncio promocional",
  description = "Completa el formulario con la información de tu anuncio. Una vez enviado, el administrador revisará y aprobará tu solicitud.",
}: AdsEmptyStateProps) => {
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
        <Campaign sx={{ fontSize: 40, opacity: 0.8 }} />
      </Box>

      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        align="center"
        color="text.primary"
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ maxWidth: 450, lineHeight: 1.6 }}
      >
        {description}
      </Typography>
    </Box>
  );
};
