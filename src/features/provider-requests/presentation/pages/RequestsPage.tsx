import {
  AirportShuttle,
  Check,
  Close,
  Download,
  Inventory,
  LocalHospital,
  LocalPharmacy,
  Science,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type {
  ProviderRequest,
  ServiceType,
} from "../../domain/provider-request.entity";
import { RequestStatusBadge } from "../components/RequestStatusBadge";
import { useProviderRequests } from "../hooks/useProviderRequests";

// Mock del Admin actual
const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

// --- Configuración de las Columnas de la Tabla ---
const getColumns = (): GridColDef<ProviderRequest>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 90,
  },
  {
    field: "providerName",
    headerName: "Proveedor",
    width: 250,
    renderCell: (params: GridRenderCellParams<ProviderRequest>) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={params.row.avatarUrl} alt={params.row.providerName}>
          {params.row.providerName.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row.providerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: "serviceType",
    headerName: "Tipo de Servicio",
    width: 180,
    renderCell: (params) => {
      const type = params.value as ServiceType;
      let icon = null;
      // Asignamos íconos según el tipo (puedes mover esto a un helper separado)
      if (type === "doctor") icon = <LocalHospital color="primary" />;
      if (type === "pharmacy") icon = <LocalPharmacy color="success" />;
      if (type === "laboratory") icon = <Science color="info" />;
      if (type === "ambulance") icon = <AirportShuttle color="error" />;
      if (type === "supplies") icon = <Inventory color="warning" />;

      return (
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <span className="capitalize">{type}</span>
        </Stack>
      );
    },
  },
  { field: "submissionDate", headerName: "Fecha Solicitud", width: 130 },
  {
    field: "documentsCount",
    headerName: "Docs",
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={500}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "status",
    headerName: "Estado",
    width: 150,
    renderCell: (params: GridRenderCellParams<ProviderRequest>) => (
      <RequestStatusBadge status={params.row.status} />
    ),
  },
  {
    field: "actions",
    headerName: "Acciones",
    sortable: false,
    width: 150,
    renderCell: (params: GridRenderCellParams<ProviderRequest>) => {
      // Solo mostramos botones de aprobar/rechazar si está pendiente
      const isPending = params.row.status === "PENDING";
      return (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" title="Ver detalles" color="primary">
            <Visibility fontSize="small" />
          </IconButton>
          {isPending && (
            <>
              <IconButton size="small" title="Aprobar" color="success">
                <Check fontSize="small" />
              </IconButton>
              <IconButton size="small" title="Rechazar" color="error">
                <Close fontSize="small" />
              </IconButton>
            </>
          )}
        </Stack>
      );
    },
  },
];

export const RequestsPage = () => {
  // Usamos el hook para traer los datos
  const { data: requests, isLoading } = useProviderRequests();

  const columns = getColumns();

  return (
    <DashboardLayout
      role="ADMIN"
      userProfile={CURRENT_ADMIN}
      title="Solicitudes"
    >
      <Box sx={{ height: "100%", width: "100%", p: 1 }}>
        {/* Header de la sección con botón Exportar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Solicitudes de Proveedores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona las solicitudes de registro y verificación.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<Download />}>
            Exportar CSV
          </Button>
        </Stack>

        {/* Barra de Filtros (Visual por ahora) */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          mb={3}
          sx={{
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <TextField
            placeholder="Buscar por nombre o email..."
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Estado"
            size="small"
            defaultValue="all"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="PENDING">Pendientes</MenuItem>
            <MenuItem value="APPROVED">Aprobados</MenuItem>
          </TextField>
          <TextField
            type="date"
            size="small"
            sx={{ minWidth: 150 }}
            InputLabelProps={{ shrink: true }}
            label="Desde fecha"
          />
        </Stack>

        {/* Tabla de Datos (DataGrid) */}
        <Box
          sx={{
            height: 500,
            width: "100%",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <DataGrid
            rows={requests || []} // Pasamos los mocks
            columns={columns}
            loading={isLoading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            }}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};
