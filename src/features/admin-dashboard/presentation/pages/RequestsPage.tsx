import {
  AirportShuttle,
  Assignment,
  Business,
  Check,
  CheckCircle,
  Close,
  Download,
  HourglassEmpty,
  Inventory,
  LocalHospital,
  LocalPharmacy,
  Science,
  Spa,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import Grid2 from "@mui/material/Grid2";
import { useMemo, useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type {
  ProviderRequest,
  ServiceType,
} from "../../domain/provider-request.entity";
import { RequestDetailModal } from "../components/RequestDetailModal";
import { RejectProviderRequestModal } from "../components/RejectProviderRequestModal";
import { RequestStatusBadge } from "../components/RequestStatusBadge";
import { ServiceStatCard } from "../components/ServiceStatCard";
import { useProviderRequests } from "../hooks/useProviderRequests";
import { useRequestFiltering } from "../hooks/useRequestFiltering";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import {
  DataTable,
  TableToolbar,
  TablePageLayout,
} from "../../../../shared/components/DataTable";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { FEEDBACK } from "../../../../shared/constants/feedback-messages";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

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

export const RequestsPage = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [serverStatusFilter, setServerStatusFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [serverSearchText, setServerSearchText] = useState("");
  const [serverServiceType, setServerServiceType] = useState("");
  const [serverDateFilter, setServerDateFilter] = useState("");
  const [serverDateToFilter, setServerDateToFilter] = useState("");
  const { data: result, isLoading } = useProviderRequests({
    status: serverStatusFilter,
    search: serverSearchText || undefined,
    serviceType: serverServiceType || undefined,
    dateFrom: serverDateFilter || undefined,
    dateTo: serverDateToFilter || undefined,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const requests = useMemo(() => result?.data ?? [], [result]);
  const pagination = useMemo(() => result?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 0 }, [result]);
  const stats = result?.stats;

  const queryClient = useQueryClient();
  const { appointments: adminAppointments, notificationsViewAllPath } = useAdminNotificationsLayout();
  const feedback = useFeedbackStore();

  const {
    filters,
    setSearchText,
    setStatusFilter,
    setDateFilter,
    approveRequest,
    rejectRequest,
  } = useRequestFiltering(requests, "PENDING");

  const [selectedRequest, setSelectedRequest] =
    useState<ProviderRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState<ProviderRequest | null>(null);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setServerStatusFilter((value as "all" | "PENDING" | "APPROVED" | "REJECTED") || "all");
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setServerSearchText(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleServiceTypeChange = (value: string) => {
    setServerServiceType(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setServerDateFilter(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleDateToFilterChange = (value: string) => {
    setServerDateToFilter(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // --- Handlers UI ---
  const handleViewRequest = (request: ProviderRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const onApprove = async (id: string) => {
    try {
      await approveRequest(id);
      queryClient.invalidateQueries({ queryKey: ['provider-requests-list'] });
      handleCloseModal();
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
    } catch {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, FEEDBACK.ERROR.GENERIC.message);
    }
  };

  const handleOpenRejectModal = (request: ProviderRequest) => {
    setRequestToReject(request);
    setIsRejectModalOpen(true);
    if (isModalOpen) {
      handleCloseModal();
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectRequest(id, reason);
      queryClient.invalidateQueries({ queryKey: ['provider-requests-list'] });
      setIsRejectModalOpen(false);
      setRequestToReject(null);
      if (isModalOpen) {
        handleCloseModal();
      }
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
    } catch {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, FEEDBACK.ERROR.GENERIC.message);
    }
  };

  const onReject = (request: ProviderRequest) => {
    handleOpenRejectModal(request);
  };

  const handleExportCSV = () => {
    if (requests.length === 0) {
      feedback.showFeedback("info", "Sin datos", "No hay datos para exportar");
      return;
    }

    const headers = [
      "ID",
      "Nombre del Proveedor",
      "Email",
      "Tipo de Servicio",
      "Teléfono",
      "WhatsApp",
      "Ciudad",
      "Dirección",
      "Fecha de Solicitud",
      "Número de Documentos",
      "Estado",
      "Motivo de Rechazo"
    ];

    const rows = requests.map((request) => [
      request.id,
      request.providerName,
      request.email,
      request.serviceType,
      request.phone || "",
      request.whatsapp || "",
      request.city || "",
      request.address || "",
      request.submissionDate,
      request.documentsCount.toString(),
      request.status,
      request.rejectionReason || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(cell => {
          const cellStr = String(cell || "");
          if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      )
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split("T")[0];
    const fileName = `solicitudes_proveedores_${date}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    feedback.showFeedback("success", "Exportación completada", `Archivo CSV exportado correctamente: ${fileName}`);
  };

  // --- Definición de Columnas ---
  const columns: GridColDef<ProviderRequest>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "providerName",
      headerName: "Proveedor",
      width: 320,
      renderCell: (params: GridRenderCellParams<ProviderRequest>) => (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ height: "100%", width: "100%", py: 1 }}
        >
          <Avatar 
            src={params.row.avatarUrl} 
            alt={params.row.providerName}
            sx={{ 
              width: 48, 
              height: 48,
              flexShrink: 0
            }}
          >
            {params.row.providerName.charAt(0)}
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
              variant="subtitle2"
              fontWeight={600}
              sx={{ 
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
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
                mt: 0.5
              }}
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
        if (type === "clinica")
          icon = <Business color="secondary" fontSize="small" />;
        if (type === "aesthetic")
          icon = <Spa sx={{ color: "#d81b60" }} fontSize="small" />;

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
      renderCell: (params) => (
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
      renderCell: (params) => {
        const isPending = params.row.status === "PENDING";
        return (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <IconButton
              size="small"
              title="Ver detalles"
              color="primary"
              onClick={() => handleViewRequest(params.row)}
            >
              <Visibility fontSize="small" />
            </IconButton>
            {isPending && (
              <>
                <IconButton
                  size="small"
                  title="Aprobar"
                  color="success"
                  onClick={() => onApprove(params.row.id)}
                >
                  <Check fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  title="Rechazar"
                  color="error"
                  onClick={() => handleOpenRejectModal(params.row)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <DashboardLayout 
      role="ADMIN" 
      userProfile={CURRENT_ADMIN}
      appointments={adminAppointments}
      notificationsVariant="professional"
      notificationsViewAllPath={notificationsViewAllPath}
    >
      <TablePageLayout>
        <Grid2 container spacing={2} sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <ServiceStatCard
              title="Pendientes"
              count={stats?.pending}
              icon={<HourglassEmpty />}
              isLoading={isLoading}
              iconColorBg="#FEF3C7"
              iconColorText="#B45309"
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <ServiceStatCard
              title="Aprobados"
              count={stats?.approved}
              icon={<CheckCircle />}
              isLoading={isLoading}
              iconColorBg="#DCFCE7"
              iconColorText="#108369"
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <ServiceStatCard
              title="Rechazados"
              count={stats?.rejected}
              icon={<Close />}
              isLoading={isLoading}
              iconColorBg="#FEE2E2"
              iconColorText="#DC2626"
            />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <ServiceStatCard
              title="Total"
              count={stats?.total}
              icon={<Assignment />}
              isLoading={isLoading}
              iconColorBg="#E0F2F1"
              iconColorText="#009688"
            />
          </Grid2>
        </Grid2>

        <TableToolbar
          title="Solicitudes de Proveedores"
          subtitle="Gestiona las solicitudes de registro y verificación — pendientes, aprobadas y rechazadas."
          searchValue={filters.searchText}
          searchPlaceholder="Buscar por nombre, email o ciudad..."
          onSearchChange={handleSearchChange}
          filters={[
            {
              key: "status",
              label: "Estado",
              value: filters.statusFilter,
              onChange: handleStatusFilterChange,
              options: [
                { value: "all", label: "Todos" },
                { value: "PENDING", label: "Pendientes" },
                { value: "APPROVED", label: "Aprobados" },
                { value: "REJECTED", label: "Rechazados" },
              ],
            },
            {
              key: "serviceType",
              label: "Tipo de Servicio",
              value: serverServiceType,
              onChange: handleServiceTypeChange,
              options: SERVICE_TYPE_OPTIONS,
            },
          ]}
          extraFilters={
            <>
              <TextField
                type="date"
                size="small"
                sx={{ minWidth: 150 }}
                slotProps={{ inputLabel: { shrink: true } }}
                label="Desde fecha"
                value={filters.dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
              />
              <TextField
                type="date"
                size="small"
                sx={{ minWidth: 150 }}
                slotProps={{ inputLabel: { shrink: true } }}
                label="Hasta fecha"
                value={serverDateToFilter}
                onChange={(e) => handleDateToFilterChange(e.target.value)}
              />
            </>
          }
          actions={[
            {
              label: "Exportar CSV",
              icon: <Download />,
              onClick: handleExportCSV,
              disabled: requests.length === 0 || isLoading,
              variant: "outlined",
            },
          ]}
          sx={{ mb: 3 }}
        />

        <DataTable<ProviderRequest>
          rows={requests}
          columns={columns}
          rowCount={pagination.total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          loading={isLoading}
          rowHeight={80}
          emptyTitle="Sin solicitudes"
          emptyDescription="No hay solicitudes de proveedores que coincidan con los filtros."
        />

        <RequestDetailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onApprove={onApprove}
          onReject={onReject}
        />
        <RejectProviderRequestModal
          open={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setRequestToReject(null);
          }}
          request={requestToReject}
          onConfirm={handleReject}
        />
      </TablePageLayout>
    </DashboardLayout>
  );
};
