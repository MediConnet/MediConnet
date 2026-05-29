import { Box, Typography } from "@mui/material";
import { TableChart } from "@mui/icons-material";
import type { ReactNode } from "react";

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

/**
 * TableEmptyState — estado vacío estándar para tablas.
 */
export function TableEmptyState({
  title = "Sin resultados",
  description = "No hay datos para mostrar.",
  icon,
}: TableEmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        bgcolor: "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.100",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <Box sx={{ color: "grey.300", mb: 2 }}>
        {icon ?? <TableChart sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" mt={0.5} maxWidth={320}>
        {description}
      </Typography>
    </Box>
  );
}
