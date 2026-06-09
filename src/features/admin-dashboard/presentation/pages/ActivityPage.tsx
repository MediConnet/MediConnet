import {
  Assignment, Cancel, CheckCircle, Edit, Notifications, History, Refresh, Download,
} from "@mui/icons-material";
import {
  Avatar, Box, Chip, Typography,
} from "@mui/material";
import {
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { DataTable, TableToolbar, TablePageLayout } from "../../../../shared/components/DataTable";
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

const TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "REGISTRATION", label: "Registro" },
  { value: "APPROVAL", label: "Aprobación" },
  { value: "REJECTION", label: "Rechazo" },
  { value: "ANNOUNCEMENT", label: "Anuncio" },
  { value: "UPDATE", label: "Edición" },
];

export const ActivityPage = () => {
  const [rows, setRows] = useState<ActivityHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadActivities = useCallback(async (page: number, limit: number) => {
    try {
      setLoading(true);
      const result = await getActivityHistoryUseCase({ page, limit });
      setRows(result.data);
      setTotal(result.pagination.total);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel, loadActivities]);

  const filteredRows = useMemo(() => {
    let data = rows;
    if (typeFilter !== "all") {
      data = data.filter((r) => r.type === typeFilter);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      data = data.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.actor.toLowerCase().includes(q)
      );
    }
    return data;
  }, [rows, searchText, typeFilter]);

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleRefresh = useCallback(() => {
    loadActivities(paginationModel.page + 1, paginationModel.pageSize);
  }, [loadActivities, paginationModel]);

  const handleExport = () => {
    const csvContent = [
      ["Actividad", "Tipo", "Actor", "Fecha"].join(","),
      ...filteredRows.map((r) =>
        [r.title, r.type, r.actor, r.date].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `actividad-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <Typography variant="body2" fontWeight={500} noWrap>
                {params.row.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
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
      <TablePageLayout>
        <TableToolbar
          title="Historial de Actividad"
          subtitle="Registro completo de acciones en la plataforma"
          titleIcon={<History sx={{ fontSize: 32 }} />}
          searchValue={searchText}
          searchPlaceholder="Buscar por actividad o actor..."
          onSearchChange={handleSearchChange}
          filters={[
            {
              key: "type",
              label: "Tipo",
              value: typeFilter,
              onChange: handleTypeFilterChange,
              options: TYPE_OPTIONS,
            },
          ]}
          actions={[
            { label: "Exportar", icon: <Download />, onClick: handleExport, variant: "outlined" },
            { label: "Refrescar", icon: <Refresh />, onClick: handleRefresh, variant: "outlined" },
          ]}
          sx={{ mb: 3 }}
        />

        <DataTable<ActivityHistory>
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={filteredRows.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          rowHeight={72}
          emptyTitle="Sin registros de actividad"
          emptyDescription="No hay registros que coincidan con los filtros aplicados."
        />
      </TablePageLayout>
    </DashboardLayout>
  );
};
