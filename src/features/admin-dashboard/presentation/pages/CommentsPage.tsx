import React, { useState } from "react";
import { Box, Typography, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { DataTable } from "../../../../shared/components/DataTable/DataTable";
import { TableToolbar } from "../../../../shared/components/DataTable/TableToolbar";
import { TablePageLayout } from "../../../../shared/components/DataTable/TablePageLayout";
import { useComments } from "../hooks/useComments";
import { CommentDetailModal } from "../components/CommentDetailModal";
import { CommentResponseModal } from "../components/CommentResponseModal";
import { Comment } from "../../domain/comment.entity";

const CURRENT_ADMIN = {
  name: "Administrador",
  email: "admin@mediconnect.ec",
  avatar: "",
};

const statusColors: Record<string, "warning" | "info" | "success" | "error"> = {
  PENDING: "warning",
  REVIEWED: "info",
  RESOLVED: "success",
  REJECTED: "error",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  REVIEWED: "Revisado",
  RESOLVED: "Resuelto",
  REJECTED: "Rechazado",
};

export const CommentsPage: React.FC = () => {
  const {
    comments,
    loading,
    error,
    total,
    searchText,
    statusFilter,
    dateFrom,
    dateTo,
    setPage,
    setPageSize,
    setSearchText,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    updateStatus,
    respondToComment,
    deleteComment,
    reload,
  } = useComments();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [detailComment, setDetailComment] = useState<Comment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [responseComment, setResponseComment] = useState<Comment | null>(null);
  const [responseOpen, setResponseOpen] = useState(false);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setPageSize(model.pageSize);
  };

  const handleViewDetail = (comment: Comment) => {
    setDetailComment(comment);
    setDetailOpen(true);
  };

  const handleOpenResponse = (comment: Comment) => {
    setResponseComment(comment);
    setResponseOpen(true);
  };

  const handleRespond = async (response: string) => {
    if (!responseComment) return;
    await respondToComment(responseComment.id, { adminResponse: response });
    setResponseComment(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este comentario?")) {
      deleteComment(id);
    }
  };

  const columns: GridColDef<Comment>[] = [
    {
      field: "subject",
      headerName: "Asunto",
      flex: 2,
      minWidth: 200,
    },
    {
      field: "userName",
      headerName: "Usuario",
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => row.userName || "Anónimo",
    },
    {
      field: "userEmail",
      headerName: "Correo",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value] || params.value}
          color={statusColors[params.value] || "default"}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      width: 160,
      valueGetter: (value) => new Date(value).toLocaleDateString("es-EC", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0}>
          <Tooltip title="Ver detalle">
            <IconButton size="small" onClick={() => handleViewDetail(params.row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Responder">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenResponse(params.row)}
              disabled={params.row.status === "RESOLVED" || params.row.status === "REJECTED"}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <TablePageLayout>
        <TableToolbar
          title="Comentarios"
          subtitle="Gestiona los comentarios y sugerencias de los usuarios"
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder="Buscar por asunto, mensaje o usuario..."
          filters={[
            {
              key: "status",
              label: "Estado",
              value: statusFilter,
              onChange: handleStatusFilterChange,
              options: [
                { value: "", label: "Todos" },
                { value: "PENDING", label: "Pendiente" },
                { value: "REVIEWED", label: "Revisado" },
                { value: "RESOLVED", label: "Resuelto" },
                { value: "REJECTED", label: "Rechazado" },
              ],
            },
          ]}
          extraFilters={
            <Stack direction="row" spacing={2}>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d0d0d0",
                  borderRadius: 8,
                  fontSize: 14,
                }}
                placeholder="Fecha inicio"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d0d0d0",
                  borderRadius: 8,
                  fontSize: 14,
                }}
                placeholder="Fecha fin"
              />
            </Stack>
          }
          actions={[
            { label: "Actualizar", onClick: reload, variant: "outlined" },
          ]}
        />

        <DataTable
          rows={comments}
          columns={columns}
          loading={loading}
          error={error || undefined}
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          getRowId={(row) => row.id}
          emptyTitle="No hay comentarios"
          emptyDescription="Aún no se han recibido comentarios de los usuarios."
        />

        <CommentDetailModal
          open={detailOpen}
          comment={detailComment}
          onClose={() => setDetailOpen(false)}
        />

        <CommentResponseModal
          open={responseOpen}
          commentSubject={responseComment?.subject || ""}
          onClose={() => setResponseOpen(false)}
          onConfirm={handleRespond}
        />
      </TablePageLayout>
    </DashboardLayout>
  );
};
