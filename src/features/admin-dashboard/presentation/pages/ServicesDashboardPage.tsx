import {
  Business, Category, FileDownload, LocalPharmacy, LocationOn, Science, AirportShuttle,
  Inventory, MedicalServices, Refresh, Spa,
  CheckCircle,
} from "@mui/icons-material";
import { Box, Typography, Avatar, Stack, Chip } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { type GridColDef, type GridPaginationModel, type GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { ActiveService } from "../../domain/service-stats.entity";
import { ServiceStatCard } from "../components/ServiceStatCard";
import { useServiceStats } from "../hooks/useServiceStats";
import { useActiveServices } from "../hooks/useActiveServices";
import { DataTable, TableToolbar, TablePageLayout } from "../../../../shared/components/DataTable";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
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

export const ServicesDashboardPage = () => {
  const { stats, isLoading: statsLoading } = useServiceStats();
  
  // Estados para la tabla
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Hook para obtener servicios activos con paginación
  const { data: result, isLoading, refetch } = useActiveServices({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const services = useMemo(() => result?.data ?? [], [result]);
  const pagination = useMemo(() => result?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 0 }, [result]);

  // Filtrado client-side por búsqueda
  const filteredServices = useMemo(() => {
    if (!searchText) return services;
    const q = searchText.toLowerCase();
    return services.filter(
      (s) => 
        s.name.toLowerCase().includes(q) || 
        s.location.toLowerCase().includes(q) ||
        SERVICE_LABELS[s.type].toLowerCase().includes(q)
    );
  }, [services, searchText]);

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // Implementar exportación a CSV
    const csvContent = [
      ['ID', 'Nombre', 'Ubicación', 'Tipo'],
      ...filteredServices.map(s => [s.id, s.name, s.location, SERVICE_LABELS[s.type]])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `servicios-activos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const columns: GridColDef<ActiveService>[] = [
    {
      field: "name",
      headerName: "Servicio",
      flex: 1.5,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<ActiveService>) => {
        const serviceColor = SERVICE_COLORS[params.row.type] || "#6b7280";
        const initial = params.row.name.charAt(0).toUpperCase();
        
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
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {params.row.name}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {params.row.location}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "type",
      headerName: "Tipo de Servicio",
      width: 200,
      renderCell: (params: GridRenderCellParams<ActiveService>) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          <Box sx={{ color: SERVICE_COLORS[params.row.type], display: "flex", alignItems: "center" }}>
            {SERVICE_ICONS[params.row.type]}
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {SERVICE_LABELS[params.row.type]}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "location",
      headerName: "Ubicación",
      width: 200,
      renderCell: (params: GridRenderCellParams<ActiveService>) => (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: "100%" }}>
          <LocationOn sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body2">{params.row.location}</Typography>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 130,
      renderCell: () => (
        <Chip
          label="Activo"
          color="success"
          size="small"
          icon={<CheckCircle />}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const themeColors = {
    tealBg: "#E0F2F1",
    tealText: "#009688",
  };

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <TablePageLayout>
        {/* --- SECCIÓN 1: Tarjetas de Estadísticas --- */}
        <Box mb={4}>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <ServiceStatCard
                title="Médico"
                count={stats?.doctorCount}
                isLoading={statsLoading}
                icon={<MedicalServices />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <ServiceStatCard
                title="Farmacia"
                count={stats?.pharmacyCount}
                isLoading={statsLoading}
                icon={<LocalPharmacy />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <ServiceStatCard
                title="Laboratorio"
                count={stats?.laboratoryCount}
                isLoading={statsLoading}
                icon={<Science />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <ServiceStatCard
                title="Ambulancia"
                count={stats?.ambulanceCount}
                isLoading={statsLoading}
                icon={<AirportShuttle />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <ServiceStatCard
                title="Insumos Médicos"
                count={stats?.suppliesCount}
                isLoading={statsLoading}
                icon={<Inventory />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <ServiceStatCard
                title="Centros Estéticos"
                count={stats?.aestheticCount}
                isLoading={statsLoading}
                icon={<Spa />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
          </Grid2>
        </Box>

        {/* --- SECCIÓN 2: Tabla de Servicios Activos --- */}
        <TableToolbar
          title="Servicios Activos"
          subtitle="Lista completa de todos los servicios aprobados y activos en la plataforma"
          titleIcon={<Category sx={{ fontSize: 32 }} />}
          searchValue={searchText}
          searchPlaceholder="Buscar por nombre, ubicación o tipo..."
          onSearchChange={setSearchText}
          filters={[
            {
              key: "type",
              label: "Tipo de Servicio",
              value: typeFilter,
              onChange: setTypeFilter,
              options: [
                { value: "all", label: "Todos" },
                { value: "doctor", label: "Médico" },
                { value: "pharmacy", label: "Farmacia" },
                { value: "laboratory", label: "Laboratorio" },
                { value: "ambulance", label: "Ambulancia" },
                { value: "supplies", label: "Insumos Médicos" },
                { value: "aesthetic", label: "Centro Estético" },
                // Oculto: módulo de clínicas fuera de uso (no se borra)
                // { value: "clinica", label: "Clínica" },
              ],
              minWidth: 180,
            },
          ]}
          actions={[
            {
              label: "Refrescar",
              icon: <Refresh />,
              onClick: handleRefresh,
              variant: "outlined",
            },
            {
              label: "Exportar",
              icon: <FileDownload />,
              onClick: handleExport,
              variant: "outlined",
            },
          ]}
          sx={{ mb: 3 }}
        />

        <DataTable<ActiveService>
          rows={filteredServices}
          columns={columns}
          rowCount={pagination.total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          loading={isLoading}
          rowHeight={80}
          emptyTitle="No hay servicios activos"
          emptyDescription="Los servicios aprobados aparecerán aquí automáticamente."
          emptyIcon={<CheckCircle sx={{ fontSize: 64, color: "text.disabled" }} />}
        />
      </TablePageLayout>
    </DashboardLayout>
  );
};
