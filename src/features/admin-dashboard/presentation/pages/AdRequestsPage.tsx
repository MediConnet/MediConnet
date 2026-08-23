import {
  Business, Campaign, Check, Close, LocalHospital, LocalPharmacy,
  Science, AirportShuttle, Inventory, Visibility,
} from "@mui/icons-material";
import {
  Avatar, Box, Button, Chip, IconButton, Stack, Typography,
} from "@mui/material";
import { type GridColDef, type GridRenderCellParams, type GridPaginationModel } from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { AdRequest } from "../../domain/ad-request.entity";
import { RejectAdRequestModal } from "../components/RejectAdRequestModal";
import { AdDetailModal } from "../components/AdDetailModal";
import { RequestStatusBadge } from "../components/RequestStatusBadge";
import { useAdRequests } from "../hooks/useAdRequests";
import { approveAdRequestUseCase } from "../../application/approve-ad-request.usecase";
import { rejectAdRequestUseCase } from "../../application/reject-ad-request.usecase";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import { DataTable, TableToolbar, TablePageLayout } from "../../../../shared/components/DataTable";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import { FEEDBACK } from "../../../../shared/constants/feedback-messages";

const CURRENT_ADMIN = { name: "Admin General", roleLabel: "Super Admin", initials: "AG" };

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  doctor: <LocalHospital />, pharmacy: <LocalPharmacy />, laboratory: <Science />,
  ambulance: <AirportShuttle />, supplies: <Inventory />, clinica: <Business />,
};

export const AdRequestsPage = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [searchText, setSearchText] = useState("");

  // Esta pantalla es solo la bandeja de revisión: únicamente solicitudes
  // pendientes. Una vez aprobada/rechazada, deja de ser una "solicitud" —
  // lo aprobado se administra en Anuncios (Gestión).
  const { data: result, isLoading, refetch } = useAdRequests({
    status: "PENDING",
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const { appointments: adminAppointments, notificationsViewAllPath } = useAdminNotificationsLayout();
  const feedback = useFeedbackStore();

  const requests = useMemo(() => result?.data ?? [], [result]);
  const pagination = useMemo(() => result?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 0 }, [result]);

  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    if (!searchText) return requests;
    const q = searchText.toLowerCase();
    return requests.filter(
      (r) => r.providerName.toLowerCase().includes(q) || r.providerEmail.toLowerCase().includes(q)
    );
  }, [requests, searchText]);

  const handleApprove = async (id: string) => {
    try {
      await approveAdRequestUseCase(id);
      await refetch();
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
    } catch (e) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, FEEDBACK.ERROR.GENERIC.message);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectAdRequestUseCase(id, reason);
      await refetch();
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      feedback.showFeedback("success", FEEDBACK.SUCCESS.UPDATE.title, FEEDBACK.SUCCESS.UPDATE.message);
    } catch (e) {
      feedback.showFeedback("error", FEEDBACK.ERROR.GENERIC.title, FEEDBACK.ERROR.GENERIC.message);
    }
  };

  const columns: GridColDef<AdRequest>[] = [
    {
      field: "providerName",
      headerName: "Proveedor",
      width: 300,
      renderCell: (params: GridRenderCellParams<AdRequest>) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ height: "100%", width: "100%", py: 1 }}>
          <Avatar sx={{ bgcolor: "primary.light", width: 48, height: 48, flexShrink: 0 }}>
            {params.row.providerName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{params.row.providerName}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {params.row.providerEmail}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "serviceType",
      headerName: "Tipo de Servicio",
      width: 180,
      renderCell: (params: GridRenderCellParams<AdRequest>) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          {SERVICE_ICONS[params.row.serviceType]}
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>{params.row.serviceType}</Typography>
        </Stack>
      ),
    },
    {
      field: "submissionDate",
      headerName: "Fecha de Solicitud",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">{new Date(params.row.submissionDate).toLocaleDateString("es-ES")}</Typography>
      ),
    },
    {
      field: "adContent",
      headerName: "Contenido del Anuncio",
      width: 250,
      renderCell: (params) => {
        if (!params.row.adContent) return <Typography variant="body2" color="text.secondary">Sin contenido</Typography>;
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{params.row.adContent.title}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {params.row.adContent.description}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => <RequestStatusBadge status={params.row.status} />,
    },
    {
      field: "hasActiveAd",
      headerName: "Anuncio Activo",
      width: 140,
      renderCell: (params) => (
        <Chip label={params.row.hasActiveAd ? "Sí" : "No"} color={params.row.hasActiveAd ? "success" : "default"} size="small" />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          <Button variant="outlined" size="small" startIcon={<Visibility />}
            onClick={() => { setSelectedRequest(params.row); setIsDetailModalOpen(true); }}
            sx={{ textTransform: "none", fontSize: "0.75rem" }}>
            Ver Detalle
          </Button>
          {params.row.status === "PENDING" && (
            <>
              <IconButton size="small" color="success" title="Aprobar" onClick={() => handleApprove(params.row.id)}>
                <Check fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" title="Rechazar"
                onClick={() => { setSelectedRequest(params.row); setIsRejectModalOpen(true); }}>
                <Close fontSize="small" />
              </IconButton>
            </>
          )}
        </Stack>
      ),
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
        <TableToolbar
          title="Solicitudes de Anuncios"
          subtitle="Solicitudes pendientes de revisión — apruébalas o recházalas."
          titleIcon={<Campaign sx={{ fontSize: 32 }} />}
          searchValue={searchText}
          searchPlaceholder="Nombre o email del proveedor..."
          onSearchChange={setSearchText}
          sx={{ mb: 3 }}
        />

        <DataTable<AdRequest>
          rows={filteredRequests}
          columns={columns}
          rowCount={pagination.total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          loading={isLoading}
          rowHeight={80}
          emptyTitle="Sin solicitudes de anuncios"
          emptyDescription="No hay solicitudes que coincidan con los filtros aplicados."
        />

        <AdDetailModal
          open={isDetailModalOpen}
          onClose={() => { setIsDetailModalOpen(false); setSelectedRequest(null); }}
          request={selectedRequest}
        />
        <RejectAdRequestModal
          open={isRejectModalOpen}
          onClose={() => { setIsRejectModalOpen(false); setSelectedRequest(null); }}
          request={selectedRequest}
          onConfirm={handleReject}
        />
      </TablePageLayout>
    </DashboardLayout>
  );
};
