import { Box, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

interface TablePageLayoutProps {
  children: ReactNode;
  /** Padding interno. Por defecto: 3 (24px) */
  p?: number | string;
  /** Ancho máximo del contenido. Por defecto: 1400 */
  maxWidth?: number | string;
  sx?: SxProps<Theme>;
}

/**
 * TablePageLayout — wrapper de página para vistas con tabla.
 *
 * Garantiza:
 * - width: 100%, max-width: 100% → sin overflow horizontal en la página.
 * - overflow: hidden en el contenedor raíz.
 * - Padding y max-width consistentes.
 */
export function TablePageLayout({
  children,
  p = 3,
  maxWidth = 1400,
  sx = {},
}: TablePageLayoutProps) {
  return (
    <Box
      sx={{
        // Evita overflow horizontal en la página completa
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        p,
        ...sx,
      }}
    >
      <Box sx={{ maxWidth, margin: "0 auto", width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
}
