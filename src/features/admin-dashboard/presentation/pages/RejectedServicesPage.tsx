import {
  AirportShuttle,
  Business,
  CheckCircle,
  Close,
  History,
  Inventory,
  LocalPharmacy,
  MedicalServices,
  Refresh,
  Science,
  Spa,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { DataTable, TableToolbar, TablePageLayout } from "../../../../shared/components/DataTable";
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
  clinica: <Business />,
  aesthetic: <Spa />,
};

const SERVICE_LABELS: Record<string, string> = {
  doctor: "Médico",
  pharmacy: "Farmacia",
  laboratory: "Laboratorio",
  ambulance: "Ambulancia",
  supplies: "Insumos Médicos",
  clinica: "Clínica",
  aesthetic: "Centro Estético",
};

const SERVICE_COLORS: Record<string, string> = {
  doctor: "#f97316",
  pharmacy: "#10b981",
  laboratory: "#ef4444",
  ambulance: "#06b6d4",
  supplies: "#f59e0b",
  clinica: "#8b5cf6",
  aesthetic: "#d81b60",
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "APPROVED", label: "Aprobados" },
  { value: "REJECTED", label: "Rechazados" },
  { value: "PENDING", label: "Pendientes" },
];

const SERVICE_TYPE_OPTIONS = [
  { value: "", label: "Todos los servicios" },
  { value: "doctor", label: "Médico" },
  { value: "pharmacy", label: "Farmacia" },
  { value: "laboratory", label: "Laboratorio" },
  { value: "ambulance", label: "Ambulancia" },
  { value: "supplies", label: "Insumos Médicos" },
  { value: "aesthetic", label: "Centro Estético" },
  // Oculto: módulo de clínicas fuera de uso (no se borra)
  // { value: "clinica", label: "Clínica" },
];

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState<"providers" | "ads">("providers");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  // Debounce search input (400ms)
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchText]);

  const searchOrDefault = debouncedSearch || undefined;

  console.log(`📊 [HistoryPage] Filters: tab=${activeTab}, status=${statusFilter}, serviceType=${serviceTypeFilter}, dateFrom="${dateFrom}", dateTo="${dateTo}", search="${debouncedSearch}", page=${paginationModel.page + 1}`);

  const { data: historyResult, isLoading: isLoadingProviders, isError: isErrorProviders, error: errorProviders, refetch: refetchHistory } = useHistoryRequests({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchOrDefault,
    serviceType: serviceTypeFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const { data: adResult, isLoading: isLoadingAds, isError: isErrorAds, error: errorAds, refetch: refetchAds } = useAdRequests({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchOrDefault,
    serviceType: serviceTypeFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const historyData = historyResult?.data ?? [];
  const historyTotal = historyResult?.pagination?.total ?? 0;
  const adData = adResult?.data ?? [];
  const adTotal = adResult?.pagination?.total ?? 0;

  const isLoading = activeTab === "providers" ? isLoadingProviders : isLoadingAds;
  const currentRows = activeTab === "providers" ? historyData : adData;
  const currentTotal = activeTab === "providers" ? historyTotal : adTotal;

  const stats = useMemo(() => {
    const approved = currentRows.filter((r) => r.status === "APPROVED").length;
    const rejected = currentRows.filter((r) => r.status === "REJECTED").length;
    const pending = currentRows.filter((r) => r.status === "PENDING").length;
    return { approved, rejected, pending, total: currentTotal };
  }, [currentRows, currentTotal]);

  const resetPagination = useCallback(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleTabChange = (_: any, newValue: "providers" | "ads") => {
    setActiveTab(newValue);
    setSearchText("");
    setDebouncedSearch("");
    setServiceTypeFilter("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("all");
    resetPagination();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    resetPagination();
  };

  const handleServiceTypeFilterChange = (value: string) => {
    setServiceTypeFilter(value);
    resetPagination();
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    resetPagination();
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    resetPagination();
  };

  const handleRefresh = useCallback(() => {
    if (activeTab === "providers") {
      refetchHistory();
    } else {
      refetchAds();
    }
  }, [activeTab, refetchHistory, refetchAds]);

  const renderProviderCell = (name: string, email: string, serviceType: string) => {
    const color = SERVICE_COLORS[serviceType] || "#6b7280";
    const initial = name.charAt(0).toUpperCase();
    return (
      <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1, height: "100%" }}>
        <Avatar sx={{ bgcolor: color, width: 48, height: 48, fontSize: "1.1rem", fontWeight: 700, color: "white", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {initial}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mt: 0.5 }}>
            {email}
          </Typography>
        </Box>
      </Stack>
    );
  };

  const renderServiceTypeCell = (value: string, status: string) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: status === "APPROVED" ? "success.main" : status === "REJECTED" ? "error.main" : "warning.main" }}>
        {SERVICE_ICONS[value]}
      </Box>
      <Typography variant="body2">{SERVICE_LABELS[value]}</Typography>
    </Stack>
  );

  const renderStatusChip = (status: string) => {
    if (status === "APPROVED") return <Chip label="Aprobado" color="success" size="small" icon={<CheckCircle />} />;
    if (status === "REJECTED") return <Chip label="Rechazado" color="error" size="small" icon={<Close />} />;
    return <Chip label="Pendiente" color="warning" size="small" />;
  };

  const renderRejectionCell = (status: string, reason?: string) => (
    <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {status === "REJECTED" ? (reason || "Sin motivo especificado") : status === "APPROVED" ? "Aprobado" : "Pendiente de revisión"}
    </Typography>
  );

  const providerColumns: GridColDef<ProviderRequest>[] = [
    {
      field: "providerName",
      headerName: "Proveedor",
      flex: 1,
      minWidth: 280,
      renderCell: (params) => renderProviderCell(params.row.providerName, params.row.email, params.row.serviceType),
    },
    {
      field: "serviceType",
      headerName: "Tipo de Servicio",
      width: 180,
      renderCell: (params) => renderServiceTypeCell(params.value, params.row.status),
    },
    {
      field: "city",
      headerName: "Ciudad",
      width: 150,
      renderCell: (params) => <Typography variant="body2">{params.value || "N/A"}</Typography>,
    },
    {
      field: "submissionDate",
      headerName: "Fecha de Solicitud",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
        </Typography>
      ),
    },
    {
      field: "rejectionReason",
      headerName: "Motivo / Observaciones",
      width: 300,
      renderCell: (params) => renderRejectionCell(params.row.status, params.value),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => renderStatusChip(params.value),
    },
  ];

  const adColumns: GridColDef<AdRequest>[] = [
    {
      field: "providerName",
      headerName: "Proveedor",
      flex: 1,
      minWidth: 280,
      renderCell: (params) => renderProviderCell(params.row.providerName, params.row.providerEmail, params.row.serviceType),
    },
    {
      field: "serviceType",
      headerName: "Tipo de Servicio",
      width: 180,
      renderCell: (params) => renderServiceTypeCell(params.value, params.row.status),
    },
    {
      field: "submissionDate",
      headerName: "Fecha de Solicitud",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
        </Typography>
      ),
    },
    {
      field: "adContent",
      headerName: "Contenido del Anuncio",
      width: 250,
      renderCell: (params) => {
        if (!params.row.adContent) {
          return <Typography variant="body2" color="text.secondary">Sin contenido</Typography>;
        }
        const content = params.row.adContent;
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              {content.title || content.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {content.description}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "rejectionReason",
      headerName: "Motivo / Observaciones",
      width: 300,
      renderCell: (params) => renderRejectionCell(params.row.status, params.value),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => renderStatusChip(params.value),
    },
  ];

  const filterBarExtraFilters = useMemo(() => (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <TextField
        label="Fecha desde"
        type="date"
        size="small"
        value={dateFrom}
        onChange={(e) => handleDateFromChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 155 }}
      />
      <TextField
        label="Fecha hasta"
        type="date"
        size="small"
        value={dateTo}
        onChange={(e) => handleDateToChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 155 }}
      />
    </Stack>
  ), [dateFrom, dateTo]);

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <TablePageLayout>
        <TableToolbar
          title="Historial de Solicitudes"
          subtitle="Historial completo de solicitudes aprobadas y rechazadas"
          titleIcon={<History sx={{ fontSize: 32 }} />}
          searchValue={searchText}
          searchPlaceholder={activeTab === "providers" ? "Buscar por nombre, email o ciudad..." : "Buscar por nombre o email del proveedor..."}
          onSearchChange={handleSearchChange}
          filters={[
            {
              key: "status",
              label: "Estado",
              value: statusFilter,
              onChange: handleStatusFilterChange,
              options: STATUS_OPTIONS,
            },
            {
              key: "serviceType",
              label: "Tipo de Servicio",
              value: serviceTypeFilter,
              onChange: handleServiceTypeFilterChange,
              options: SERVICE_TYPE_OPTIONS,
            },
          ]}
          extraFilters={filterBarExtraFilters}
          actions={[
            { label: "Refrescar", icon: <Refresh />, onClick: handleRefresh, variant: "outlined" },
          ]}
          sx={{ mb: 3 }}
        />

        <Box mb={3}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.95rem" },
            }}
          >
            <Tab label="Solicitudes de Proveedores" value="providers" />
            <Tab label="Solicitudes de Anuncios" value="ads" />
          </Tabs>
        </Box>

        <Grid2 container spacing={2} mb={3}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ color: "#10b981", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Aprobados</Typography>
                  <Typography variant="h6" fontWeight={700} color="#10b981">{stats.approved}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#fef2f2", border: "1px solid #fecaca" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Close sx={{ color: "#ef4444", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Rechazados</Typography>
                  <Typography variant="h6" fontWeight={700} color="#ef4444">{stats.rejected}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <History sx={{ color: "#f59e0b", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Pendientes</Typography>
                  <Typography variant="h6" fontWeight={700} color="#f59e0b">{stats.pending}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <History sx={{ color: "#6b7280", fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="h6" fontWeight={700} color="#6b7280">{stats.total}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid2>
        </Grid2>

        {activeTab === "providers" ? (
          <DataTable<ProviderRequest>
            rows={historyData}
            columns={providerColumns}
            getRowId={(row) => row.id}
            rowCount={historyTotal}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            loading={isLoadingProviders}
            error={isErrorProviders ? String((errorProviders as any)?.message || 'Error al cargar solicitudes') : null}
            rowHeight={72}
            emptyTitle="Sin solicitudes de proveedores"
            emptyDescription="No hay solicitudes de proveedores que coincidan con los filtros."
          />
        ) : (
          <DataTable<AdRequest>
            rows={adData}
            columns={adColumns}
            getRowId={(row) => row.id}
            rowCount={adTotal}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            loading={isLoadingAds}
            error={isErrorAds ? String((errorAds as any)?.message || 'Error al cargar solicitudes de anuncios') : null}
            rowHeight={72}
            emptyTitle="Sin solicitudes de anuncios"
            emptyDescription="No hay solicitudes de anuncios que coincidan con los filtros."
          />
        )}
      </TablePageLayout>
    </DashboardLayout>
  );
};
