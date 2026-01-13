import {
  Campaign,
  Check,
  Close,
  LocalHospital,
  LocalPharmacy,
  Science,
  AirportShuttle,
  Inventory,
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
  Chip,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { AdRequest } from "../../domain/ad-request.entity";
import { RejectAdRequestModal } from "../components/RejectAdRequestModal";
import { AdDetailModal } from "../components/AdDetailModal";
import { RequestStatusBadge } from "../components/RequestStatusBadge";
import { useAdRequests } from "../hooks/useAdRequests";
import { approveAdRequestUseCase } from "../../application/approve-ad-request.usecase";
import { rejectAdRequestUseCase } from "../../application/reject-ad-request.usecase";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  doctor: <LocalHospital />,
  pharmacy: <LocalPharmacy />,
  laboratory: <Science />,
  ambulance: <AirportShuttle />,
  supplies: <Inventory />,
};

export const AdRequestsPage = () => {
  const { data: initialData, isLoading, refetch } = useAdRequests();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING"); // Filtrar solo PENDING por defecto
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    if (!initialData) return [];

    return initialData.filter((req) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        req.providerName.toLowerCase().includes(searchLower) ||
        req.providerEmail.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialData, searchText, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await approveAdRequestUseCase(id);
      // Refrescar los datos - la solicitud se eliminará de la lista porque el filtro es "PENDING"
      await refetch();
    } catch (error) {
      console.error("Error approving ad request:", error);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectAdRequestUseCase(id, reason);
      // Refrescar los datos - la solicitud se eliminará automáticamente de la lista porque el filtro es "PENDING"
      // y se moverá al historial
      await refetch();
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      // Opcional: Redirigir al historial después de rechazar
      // window.location.href = '/admin/history?tab=ads';
    } catch (error) {
      console.error("Error rejecting ad request:", error);
    }
  };

  const openRejectModal = (request: AdRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const openDetailModal = (request: AdRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const columns: GridColDef<AdRequest>[] = [
    {
      field: "providerName",
      headerName: "Proveedor",
      width: 300,
      renderCell: (params: GridRenderCellParams<AdRequest>) => (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ height: "100%", width: "100%", py: 1 }}
        >
          <Avatar 
            sx={{ 
              bgcolor: "primary.light", 
              width: 48, 
              height: 48,
              flexShrink: 0
            }}
          >
            {params.row.providerName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <Typography 
              variant="body2" 
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
                display: "block",
                mt: 0.5
              }}
            >
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
        <Stack direction="row" spacing={1} alignItems="center">
          {SERVICE_ICONS[params.row.serviceType]}
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {params.row.serviceType}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "submissionDate",
      headerName: "Fecha de Solicitud",
      width: 150,
      renderCell: (params: GridRenderCellParams<AdRequest>) => (
        <Typography variant="body2">
          {new Date(params.row.submissionDate).toLocaleDateString("es-ES")}
        </Typography>
      ),
    },
    {
      field: "adContent",
      headerName: "Contenido del Anuncio",
      width: 250,
      renderCell: (params: GridRenderCellParams<AdRequest>) => {
        if (!params.row.adContent) {
          return <Typography variant="body2" color="text.secondary">Sin contenido</Typography>;
        }
        return (
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              {params.row.adContent.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
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
      renderCell: (params: GridRenderCellParams<AdRequest>) => (
        <RequestStatusBadge status={params.row.status} />
      ),
    },
    {
      field: "hasActiveAd",
      headerName: "Anuncio Activo",
      width: 150,
      renderCell: (params: GridRenderCellParams<AdRequest>) => (
        <Chip
          label={params.row.hasActiveAd ? "Sí" : "No"}
          color={params.row.hasActiveAd ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AdRequest>) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={() => openDetailModal(params.row)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
              }}
            >
              Ver Detalle
            </Button>
            {params.row.status === "PENDING" && (
              <>
                <IconButton
                  size="small"
                  title="Aprobar"
                  color="success"
                  onClick={() => handleApprove(params.row.id)}
                >
                  <Check fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  title="Rechazar"
                  color="error"
                  onClick={() => openRejectModal(params.row)}
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
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Campaign sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Solicitudes de Anuncios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona las solicitudes de permisos para crear anuncios
            </Typography>
          </Box>
        </Stack>

        {/* Filtros */}
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
            label="Buscar"
            placeholder="Nombre o email del proveedor..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="PENDING">Pendiente</MenuItem>
            <MenuItem value="APPROVED">Aprobado</MenuItem>
            <MenuItem value="REJECTED">Rechazado</MenuItem>
          </TextField>
        </Stack>

        {/* DataGrid */}
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
            rows={filteredRequests}
            columns={columns}
            loading={isLoading}
            rowHeight={80}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableColumnResize
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            }}
          />
        </Box>

        {/* Modal de Detalle del Anuncio */}
        <AdDetailModal
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
        />

        {/* Modal de Rechazo */}
        <RejectAdRequestModal
          open={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onConfirm={handleReject}
        />
      </Box>
    </DashboardLayout>
  );
};

