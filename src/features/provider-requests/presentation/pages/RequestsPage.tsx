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
    width: 300,
    renderCell: (params: GridRenderCellParams<ProviderRequest>) => (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Avatar src={params.row.avatarUrl} alt={params.row.providerName}>
          {params.row.providerName.charAt(0)}
        </Avatar>

        {/* Contenedor de texto ajustado */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ lineHeight: 1.2 }}
          >
            {params.row.providerName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.2 }}
          >
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

      // Mapeo de íconos
      if (type === "doctor")
        icon = <LocalHospital color="primary" fontSize="small" />;
      if (type === "pharmacy")
        icon = <LocalPharmacy color="success" fontSize="small" />;
      if (type === "laboratory")
        icon = <Science color="info" fontSize="small" />;
      if (type === "ambulance")
        icon = <AirportShuttle color="error" fontSize="small" />;
      if (type === "supplies")
        icon = <Inventory color="warning" fontSize="small" />;

      return (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ height: "100%" }}
        >
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
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <RequestStatusBadge status={params.row.status} />
      </Box>
    ),
  },
  {
    field: "actions",
    headerName: "Acciones",
    sortable: false,
    width: 150,
    renderCell: (params: GridRenderCellParams<ProviderRequest>) => {
      const isPending = params.row.status === "PENDING";
      return (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ height: "100%" }}
        >
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

        {/* Barra de Filtros */}
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
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            label="Desde fecha"
          />
        </Stack>

        {/* Tabla de Datos (DataGrid) */}
        <Box
          sx={{
            height: 600,
            width: "100%",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <DataGrid
            rows={requests || []}
            columns={columns}
            loading={isLoading}
            rowHeight={80}
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
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            }}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};
