import {
  Box,
  Typography,
  Alert,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowIdGetter,
  type GridRowParams,
  type GridCallbackDetails,
  type MuiEvent,
} from "@mui/x-data-grid";
import { TableEmptyState } from "./TableEmptyState";

export interface DataTableProps<R extends object = object> {
  // Datos
  rows: R[];
  columns: GridColDef<R>[];
  getRowId?: GridRowIdGetter<R>;

  // Paginación server-side
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];

  // Estados
  loading?: boolean;
  error?: string | null;

  // Altura de filas
  rowHeight?: number;

  // Estado vacío personalizable
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;

  // Callbacks opcionales
  onRowClick?: (
    params: GridRowParams<R>,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails
  ) => void;

  // Estilos extra para el DataGrid
  sx?: object;
}

/**
 * DataTable — componente de tabla reutilizable.
 *
 * Características:
 * - Scroll horizontal SOLO dentro del contenedor de la tabla.
 * - Paginación server-side lista para usar.
 * - Estados de loading, error y vacío integrados.
 * - Diseño consistente con el panel de solicitudes del admin.
 */
export function DataTable<R extends object = object>({
  rows,
  columns,
  getRowId,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 20],
  loading = false,
  error = null,
  rowHeight = 72,
  emptyTitle = "Sin resultados",
  emptyDescription = "No hay datos para mostrar.",
  emptyIcon,
  onRowClick,
  sx = {},
}: DataTableProps<R>) {
  // ── Estado de error ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  // ── Estado de carga inicial (sin filas todavía) ───────────────────────────────
  if (loading && rows.length === 0) {
    return (
      <Stack spacing={1}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={rowHeight} sx={{ borderRadius: 1 }} />
        ))}
      </Stack>
    );
  }

  // ── Estado vacío ─────────────────────────────────────────────────────────────
  if (!loading && rows.length === 0) {
    return (
      <TableEmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
      />
    );
  }

  // ── Tabla ────────────────────────────────────────────────────────────────────
  return (
    /*
     * overflow: "hidden" en el wrapper externo evita que el scroll
     * se propague al body/página. El DataGrid maneja su propio scroll
     * interno de forma nativa.
     */
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "grey.100",
      }}
    >
      {/* Contenedor con scroll horizontal SOLO aquí */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          loading={loading}
          rowHeight={rowHeight}
          // Paginación server-side
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={pageSizeOptions}
          // UX
          disableRowSelectionOnClick
          disableColumnResize
          onRowClick={onRowClick}
          // Estilos base consistentes con el panel de solicitudes del admin
          sx={{
            border: "none",
            minWidth: 600, // evita que las columnas se compriman demasiado en mobile
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "grey.50",
            },
            "& .MuiDataGrid-cell:focus": { outline: "none" },
            "& .MuiDataGrid-cell:focus-within": { outline: "none" },
            "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            "& .MuiDataGrid-columnHeader:focus-within": { outline: "none" },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#fafafa",
              borderBottom: "1px solid",
              borderColor: "grey.100",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "primary.50",
              cursor: onRowClick ? "pointer" : "default",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "grey.100",
            },
            "& .MuiDataGrid-virtualScroller": {
              // Permite scroll horizontal interno sin afectar la página
              overflowX: "auto",
            },
            ...sx,
          }}
        />
      </Box>
    </Box>
  );
}

// ── Sub-componente: contador de resultados ────────────────────────────────────
export function TableResultCount({
  total,
  loading,
}: {
  total: number;
  loading?: boolean;
}) {
  if (loading) return null;
  return (
    <Typography variant="body2" color="text.secondary">
      {total === 0
        ? "Sin resultados"
        : `${total.toLocaleString()} resultado${total !== 1 ? "s" : ""}`}
    </Typography>
  );
}
