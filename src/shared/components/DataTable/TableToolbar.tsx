import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import type { ReactNode } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableFilterConfig {
  /** Clave única del filtro */
  key: string;
  /** Etiqueta visible */
  label: string;
  /** Opciones del select */
  options: FilterOption[];
  /** Valor actual */
  value: string;
  /** Callback al cambiar */
  onChange: (value: string) => void;
  /** Ancho mínimo del select */
  minWidth?: number;
}

export interface TableActionConfig {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success" | "inherit";
  disabled?: boolean;
}

export interface TableToolbarProps {
  /** Título principal */
  title?: string;
  /** Subtítulo / descripción */
  subtitle?: string;
  /** Icono junto al título */
  titleIcon?: ReactNode;
  /** Valor del input de búsqueda */
  searchValue?: string;
  /** Placeholder del input de búsqueda */
  searchPlaceholder?: string;
  /** Callback al escribir en búsqueda */
  onSearchChange?: (value: string) => void;
  /** Filtros select adicionales */
  filters?: TableFilterConfig[];
  /** Botones de acción (Crear, Exportar, etc.) */
  actions?: TableActionConfig[];
  /** Contenido extra en la barra de filtros */
  extraFilters?: ReactNode;
  /** Ocultar la barra de filtros completa */
  hideFilterBar?: boolean;
  /** sx para el contenedor raíz */
  sx?: SxProps<Theme>;
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * TableToolbar — barra superior reutilizable para tablas.
 *
 * Incluye:
 * - Título + subtítulo + icono
 * - Botones de acción (derecha)
 * - Barra de filtros: búsqueda + selects + extras
 */
export function TableToolbar({
  title,
  subtitle,
  titleIcon,
  searchValue = "",
  searchPlaceholder = "Buscar...",
  onSearchChange,
  filters = [],
  actions = [],
  extraFilters,
  hideFilterBar = false,
  sx = {},
}: TableToolbarProps) {
  const hasFilterBar =
    !hideFilterBar &&
    (onSearchChange !== undefined || filters.length > 0 || extraFilters !== undefined);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", ...sx }}>
      {/* ── Encabezado ── */}
      {(title || actions.length > 0) && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={hasFilterBar ? 3 : 0}
        >
          {/* Título */}
          {title && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              {titleIcon && (
                <Box sx={{ display: "flex", alignItems: "center", color: "primary.main" }}>
                  {titleIcon}
                </Box>
              )}
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary" lineHeight={1.2}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>
          )}

          {/* Acciones */}
          {actions.length > 0 && (
            <Stack direction="row" spacing={1} flexShrink={0}>
              {actions.map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant ?? "outlined"}
                  color={action.color ?? "primary"}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size="small"
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      {/* ── Barra de filtros ── */}
      {hasFilterBar && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor: "grey.100",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Búsqueda */}
          {onSearchChange && (
            <TextField
              placeholder={searchPlaceholder}
              size="small"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" sx={{ color: "text.disabled" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ flexGrow: 1, minWidth: 180 }}
            />
          )}

          {/* Filtros select */}
          {filters.map((filter) => (
            <TextField
              key={filter.key}
              select
              label={filter.label}
              size="small"
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              sx={{ minWidth: filter.minWidth ?? 150 }}
            >
              {filter.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          ))}

          {/* Extras (date pickers, chips, etc.) */}
          {extraFilters}
        </Stack>
      )}
    </Box>
  );
}
