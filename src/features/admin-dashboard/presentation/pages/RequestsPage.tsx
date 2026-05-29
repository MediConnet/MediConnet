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
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type {
  ProviderRequest,
  ServiceType,
} from "../../domain/provider-request.entity";
import { RequestDetailModal } from "../components/RequestDetailModal";
import { RejectProviderRequestModal } from "../components/RejectProviderRequestModal";
import { RequestStatusBadge } from "../components/RequestStatusBadge";
import { useProviderRequests } from "../hooks/useProviderRequests";
import { useRequestFiltering } from "../hooks/useRequestFiltering";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import {
  DataTable,
  TableToolbar,
  TablePageLayout,
} from "../../../../shared/components/DataTable";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const RequestsPage = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [serverStatusFilter, setServerStatusFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED">("all");
  const [serverDateFilter, setServerDateFilter] = useState("");
  const { data: result, isLoading } = useProviderRequests({
    status: serverStatusFilter,
    dateFrom: serverDateFilter || undefined,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const requests = useMemo(() => result?.data ?? [], [result]);
  const pagination = useMemo(() => result?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 0 }, [result]);

  const queryClient = useQueryClient();
  const { appointments: adminAppointments, notificationsViewAllPath } = useAdminNotificationsLayout();

  const {
    filters,
    setSearchText,
    setStatusFilter,
    setDateFilter,
    approveRequest,
    rejectRequest,
  } = useRequestFiltering(requests, "all");

  const [selectedRequest, setSelectedRequest] =
    useState<ProviderRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState<ProviderRequest | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setServerStatusFilter((value as "all" | "PENDING" | "APPROVED" | "REJECTED") || "all");
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setServerDateFilter(value);
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
    await approveRequest(id);
    // Invalidar la query para refrescar los datos
    queryClient.invalidateQueries({ queryKey: ['provider-requests-list'] });
    handleCloseModal();
  };

  const handleOpenRejectModal = (request: ProviderRequest) => {
    setRequestToReject(request);
    setIsRejectModalOpen(true);
    // Si el modal de detalles está abierto, cerrarlo
    if (isModalOpen) {
      handleCloseModal();
    }
  };

  const handleReject = async (id: string, reason: string) => {
    await rejectRequest(id, reason);
    // Invalidar la query para refrescar los datos
    queryClient.invalidateQueries({ queryKey: ['provider-requests-list'] });
    setIsRejectModalOpen(false);
    setRequestToReject(null);
    // Si el modal de detalles está abierto, cerrarlo
    if (isModalOpen) {
      handleCloseModal();
    }
  };

  const onReject = (request: ProviderRequest) => {
    handleOpenRejectModal(request);
  };

  const handleExportCSV = () => {
    if (requests.length === 0) {
      setSnackbar({
        open: true,
        message: "No hay datos para exportar",
        severity: 'info'
      });
      return;
    }

    // Definir las columnas del CSV
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

    // Convertir los datos a filas CSV
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

    // Crear el contenido CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(cell => {
          // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
          const cellStr = String(cell || "");
          if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      )
    ].join("\n");

    // Crear el BOM para UTF-8 (para que Excel abra correctamente caracteres especiales)
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Crear el link de descarga
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Nombre del archivo con fecha actual
    const date = new Date().toISOString().split("T")[0];
    const fileName = `solicitudes_proveedores_${date}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar el URL object
    URL.revokeObjectURL(url);
    
    setSnackbar({
      open: true,
      message: `Archivo CSV exportado correctamente: ${fileName}`,
      severity: 'success'
    });
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
        {/* Toolbar: título + exportar + filtros */}
        <TableToolbar
          title="Solicitudes de Proveedores"
          subtitle="Gestiona las solicitudes de registro y verificación."
          searchValue={filters.searchText}
          searchPlaceholder="Buscar por nombre o email..."
          onSearchChange={setSearchText}
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
          ]}
          extraFilters={
            <TextField
              type="date"
              size="small"
              sx={{ minWidth: 150 }}
              slotProps={{ inputLabel: { shrink: true } }}
              label="Desde fecha"
              value={filters.dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
            />
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

        {/* Tabla */}
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

        {/* Modales */}
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

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </TablePageLayout>
    </DashboardLayout>
  );
};
