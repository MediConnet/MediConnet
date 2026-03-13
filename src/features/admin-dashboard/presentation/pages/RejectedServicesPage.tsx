import {
  AirportShuttle,
  CheckCircle,
  Close,
  History,
  Inventory,
  LocalPharmacy,
  MedicalServices,
  Science,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { ProviderRequest } from "../../domain/provider-request.entity";
import type { AdRequest } from "../../domain/ad-request.entity";
import { useHistoryRequests } from "../hooks/useHistoryRequests";
import { useAdRequests } from "../hooks/useAdRequests";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  doctor: <MedicalServices />,
  pharmacy: <LocalPharmacy />,
  laboratory: <Science />,
  ambulance: <AirportShuttle />,
  supplies: <Inventory />,
};

const SERVICE_LABELS: Record<string, string> = {
  doctor: "Médico",
  pharmacy: "Farmacia",
  laboratory: "Laboratorio",
  ambulance: "Ambulancia",
  supplies: "Insumos Médicos",
};

// Colores específicos para cada tipo de servicio
const SERVICE_COLORS: Record<string, string> = {
  doctor: "#f97316", // Naranja
  pharmacy: "#10b981", // Verde
  laboratory: "#ef4444", // Rojo
  ambulance: "#06b6d4", // Cian
  supplies: "#f59e0b", // Amarillo/Naranja
};

export const HistoryPage = () => {
  // Usar el endpoint optimizado GET /api/admin/history para historial de proveedores
  const { data: historyRequests, isLoading: isLoadingProviders } = useHistoryRequests();
  const { data: allAdRequests, isLoading: isLoadingAds } = useAdRequests();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "APPROVED" | "REJECTED" | "PENDING">("all");
  const [activeTab, setActiveTab] = useState<"providers" | "ads">("providers");

  // Filtrar servicios según el estado seleccionado
  // Nota: El endpoint /admin/history ya devuelve solo APPROVED y REJECTED, pero mantenemos el filtro por si acaso
  const filteredByStatus = useMemo(() => {
    if (activeTab === "providers") {
      if (!historyRequests) return [];
      // El endpoint /admin/history ya devuelve solo aprobadas y rechazadas, pero filtramos por si acaso
      if (statusFilter === "all") return historyRequests;
      // Si el filtro es PENDING, no debería haber resultados del historial, pero lo manejamos
      if (statusFilter === "PENDING") return [];
      return historyRequests.filter((req) => req.status === statusFilter);
    } else {
      if (!allAdRequests) return [];
      if (statusFilter === "all") return allAdRequests;
      return allAdRequests.filter((req) => req.status === statusFilter);
    }
  }, [historyRequests, allAdRequests, statusFilter, activeTab]);

  const filteredRequests = useMemo(() => {
    if (!searchText) return filteredByStatus;

    const searchLower = searchText.toLowerCase();
    if (activeTab === "providers") {
      return (filteredByStatus as ProviderRequest[]).filter(
        (req) =>
          req.providerName.toLowerCase().includes(searchLower) ||
          req.email.toLowerCase().includes(searchLower) ||
          (req.city && req.city.toLowerCase().includes(searchLower))
      );
    } else {
      return (filteredByStatus as AdRequest[]).filter(
        (req) =>
          req.providerName.toLowerCase().includes(searchLower) ||
          req.providerEmail.toLowerCase().includes(searchLower)
      );
    }
  }, [filteredByStatus, searchText, activeTab]);

  // Estadísticas
  const stats = useMemo(() => {
    const approved = filteredRequests.filter((r: any) => r.status === "APPROVED").length;
    const rejected = filteredRequests.filter((r: any) => r.status === "REJECTED").length;
    const pending = filteredRequests.filter((r: any) => r.status === "PENDING").length;
    return { approved, rejected, pending, total: filteredRequests.length };
  }, [filteredRequests]);

  const isLoading = isLoadingProviders || isLoadingAds;

  // Columnas para solicitudes de proveedores
  const providerColumns: GridColDef<ProviderRequest>[] = [
    {
      field: "providerName",
      headerName: "Proveedor",
      width: 250,
      renderCell: (params: any) => {
        const serviceType = params.row.serviceType || "doctor";
        const serviceColor = SERVICE_COLORS[serviceType] || "#6b7280";
        const initial = params.row.providerName.charAt(0).toUpperCase();
        
        return (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1, height: "100%" }}>
            <Avatar
              sx={{
                bgcolor: serviceColor,
                width: 48,
                height: 48,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {initial}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {params.row.providerName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mt: 0.5,
                }}
              >
                {params.row.email}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "serviceType",
      headerName: "Tipo de Servicio",
      width: 180,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              color:
                params.row.status === "APPROVED"
                  ? "success.main"
                  : params.row.status === "REJECTED"
                  ? "error.main"
                  : "warning.main",
            }}
          >
            {SERVICE_ICONS[params.value]}
          </Box>
          <Typography variant="body2">{SERVICE_LABELS[params.value]}</Typography>
        </Stack>
      ),
    },
    {
      field: "city",
      headerName: "Ciudad",
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">{params.value || "N/A"}</Typography>
      ),
    },
    {
      field: "submissionDate",
      headerName: "Fecha de Solicitud",
      width: 180,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Typography>
      ),
    },
    {
      field: "rejectionReason",
      headerName: "Motivo / Observaciones",
      width: 300,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.row.status === "REJECTED"
            ? params.value || "Sin motivo especificado"
            : params.row.status === "APPROVED"
            ? "Aprobado"
            : "Pendiente de revisión"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      renderCell: (params: any) => {
        const status = params.value;
        if (status === "APPROVED") {
          return (
            <Chip
              label="Aprobado"
              color="success"
              size="small"
              icon={<CheckCircle />}
            />
          );
        } else if (status === "REJECTED") {
          return (
            <Chip
              label="Rechazado"
              color="error"
              size="small"
              icon={<Close />}
            />
          );
        } else {
          return (
            <Chip
              label="Pendiente"
              color="warning"
              size="small"
            />
          );
        }
      },
    },
  ];

  // Columnas para solicitudes de anuncios
  const adColumns: GridColDef<AdRequest>[] = [
    {
      field: "providerName",
      headerName: "Proveedor",
      width: 250,
      renderCell: (params: any) => {
        const serviceType = params.row.serviceType || "doctor";
        const serviceColor = SERVICE_COLORS[serviceType] || "#6b7280";
        const initial = params.row.providerName.charAt(0).toUpperCase();
        
        return (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1, height: "100%" }}>
            <Avatar
              sx={{
                bgcolor: serviceColor,
                width: 48,
                height: 48,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {initial}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {params.row.providerName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mt: 0.5,
                }}
              >
                {params.row.providerEmail}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "serviceType",
      headerName: "Tipo de Servicio",
      width: 180,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              color:
                params.row.status === "APPROVED"
                  ? "success.main"
                  : params.row.status === "REJECTED"
                  ? "error.main"
                  : "warning.main",
            }}
          >
            {SERVICE_ICONS[params.value]}
          </Box>
          <Typography variant="body2">{SERVICE_LABELS[params.value]}</Typography>
        </Stack>
      ),
    },
    {
      field: "submissionDate",
      headerName: "Fecha de Solicitud",
      width: 180,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Typography>
      ),
    },
    {
      field: "adContent",
      headerName: "Contenido del Anuncio",
      width: 250,
      renderCell: (params: any) => {
        if (!params.row.adContent) {
          return <Typography variant="body2" color="text.secondary">Sin contenido</Typography>;
        }
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              {params.row.adContent.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.row.adContent.description}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "rejectionReason",
      headerName: "Motivo / Observaciones",
      width: 300,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.row.status === "REJECTED"
            ? params.value || "Sin motivo especificado"
            : params.row.status === "APPROVED"
            ? "Aprobado"
            : "Pendiente de revisión"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      renderCell: (params: any) => {
        const status = params.value;
        if (status === "APPROVED") {
          return (
            <Chip
              label="Aprobado"
              color="success"
              size="small"
              icon={<CheckCircle />}
            />
          );
        } else if (status === "REJECTED") {
          return (
            <Chip
              label="Rechazado"
              color="error"
              size="small"
              icon={<Close />}
            />
          );
        } else {
          return (
            <Chip
              label="Pendiente"
              color="warning"
              size="small"
            />
          );
        }
      },
    },
  ];

  const columns = activeTab === "providers" ? providerColumns : adColumns;

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <History sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Historial de Solicitudes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Historial completo de solicitudes aprobadas y rechazadas
            </Typography>
          </Box>
        </Stack>

        {/* Pestañas */}
        <Box mb={3}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              },
            }}
          >
            <Tab label="Solicitudes de Proveedores" value="providers" />
            <Tab label="Solicitudes de Anuncios" value="ads" />
          </Tabs>
        </Box>

        {/* Filtros */}
        <Box mb={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              placeholder={
                activeTab === "providers"
                  ? "Buscar por nombre, email o ciudad..."
                  : "Buscar por nombre o email del proveedor..."
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="APPROVED">Aprobados</MenuItem>
                <MenuItem value="REJECTED">Rechazados</MenuItem>
                <MenuItem value="PENDING">Pendientes</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Resumen de Estadísticas */}
        <Grid2 container spacing={2} mb={3}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ color: "#10b981", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Aprobados
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#10b981">
                    {stats.approved}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#fef2f2", border: "1px solid #fecaca" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Close sx={{ color: "#ef4444", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Rechazados
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#ef4444">
                    {stats.rejected}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <History sx={{ color: "#f59e0b", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pendientes
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#f59e0b">
                    {stats.pending}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <History sx={{ color: "#6b7280", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#6b7280">
                    {stats.total}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Tabla */}
        <Paper elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
          <DataGrid
            rows={filteredRequests as any}
            columns={columns as any}
            getRowId={(row) => row.id}
            loading={isLoading}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#f9fafb",
                borderBottom: "2px solid #e5e7eb",
              },
            }}
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

