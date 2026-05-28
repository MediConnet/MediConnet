import { Assignment, Cancel, CheckCircle, Edit, Notifications, History } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getActivityHistoryUseCase } from "../../application/get-activity-history.usecase";
import type { ActivityHistory, ActivityType } from "../../domain/activity-history.entity";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
  initials: "AG",
};

const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ReactNode; colorBg: string; colorText: string; label: string }> = {
  REGISTRATION: { icon: <Assignment fontSize="small" />, colorBg: "#E0F2F1", colorText: "#009688", label: "Registro" },
  APPROVAL: { icon: <CheckCircle fontSize="small" />, colorBg: "#E8F5E9", colorText: "#2E7D32", label: "Aprobación" },
  REJECTION: { icon: <Cancel fontSize="small" />, colorBg: "#FFEBEE", colorText: "#D32F2F", label: "Rechazo" },
  ANNOUNCEMENT: { icon: <Notifications fontSize="small" />, colorBg: "#FFF3E0", colorText: "#EF6C00", label: "Anuncio" },
  UPDATE: { icon: <Edit fontSize="small" />, colorBg: "#FFF8E1", colorText: "#FBC02D", label: "Edición" },
};

export const ActivityPage = () => {
  const [rows, setRows] = useState<ActivityHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [loading, setLoading] = useState(true);

  const loadActivities = useCallback(async (page: number, limit: number) => {
    try {
      setLoading(true);
      const result = await getActivityHistoryUseCase({ page, limit });
      setRows(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      console.error("Error loading activity history:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel, loadActivities]);

  const columns: GridColDef<ActivityHistory>[] = [
    {
      field: "title",
      headerName: "Actividad",
      flex: 1,
      minWidth: 400,
      renderCell: (params: GridRenderCellParams<ActivityHistory>) => {
        const config = ACTIVITY_CONFIG[params.row.type];
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, height: "100%", py: 1 }}>
            <Avatar sx={{ bgcolor: config.colorBg, color: config.colorText, width: 36, height: 36 }}>
              {config.icon}
            </Avatar>
            <Box
              sx={{
                minWidth: 0,
                px: '5px',
                py: '5px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                noWrap
              >
                {params.row.title}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
              >
                Por: {params.row.actor} &bull; {params.row.date}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "type",
      headerName: "Tipo",
      width: 130,
      renderCell: (params: GridRenderCellParams<ActivityHistory>) => {
        const config = ACTIVITY_CONFIG[params.row.type];
        return (
          <Chip
            label={config.label}
            size="small"
            sx={{
              bgcolor: config.colorBg,
              color: config.colorText,
              fontWeight: 600,
              borderRadius: 1,
              height: 24,
            }}
          />
        );
      },
    },
  ];

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <History sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Historial de Actividad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registro completo de acciones en la plataforma
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 600, width: "100%", bgcolor: "white", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            rowHeight={72}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
            }}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};
