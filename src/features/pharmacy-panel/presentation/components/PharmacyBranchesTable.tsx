import { Delete, Edit, WhatsApp } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";

interface Props {
  branches: PharmacyBranch[];
  isLoading: boolean;
  onEdit: (branch: PharmacyBranch) => void;
  onDelete: (id: string) => void;
}

export const PharmacyBranchesTable = ({
  branches,
  isLoading,
  onEdit,
  onDelete,
}: Props) => {
  const columns: GridColDef<PharmacyBranch>[] = [
    {
      field: "name",
      headerName: "Nombre de Sucursal",
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Stack justifyContent="center" sx={{ height: "100%", width: "100%" }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ lineHeight: 1.2, mb: 0 }}
          >
            {params.value}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1, mt: 0.5 }}
          >
            ID: {params.row.id}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "address",
      headerName: "Dirección",
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "openingHours",
      headerName: "Horario",
      width: 210,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="body2" fontSize="0.875rem" align="center">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "contact",
      headerName: "Contacto",
      width: 190,
      headerAlign: "center",
      renderCell: (params) => (
        <Stack
          spacing={0.5}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", width: "100%" }}
        >
          <Typography variant="body2" fontSize="0.85rem" lineHeight={1.2}>
            {params.row.phone}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <WhatsApp
              sx={{ fontSize: 16, color: "success.main", opacity: 0.8 }}
            />
            <Typography variant="body2" fontSize="0.85rem" lineHeight={1.2}>
              {params.row.whatsapp}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: "hasHomeDelivery",
      headerName: "Delivery",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value ? (
            <Chip
              label="Sí"
              color="success"
              size="small"
              variant="outlined"
              sx={{ minWidth: 60 }}
            />
          ) : (
            <Chip
              label="No"
              color="default"
              size="small"
              variant="outlined"
              sx={{ minWidth: 60 }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "isActive",
      headerName: "Estado",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value ? (
            <Chip
              label="Activo"
              color="success"
              size="small"
              sx={{ height: 24 }}
            />
          ) : (
            <Chip
              label="Inactivo"
              color="error"
              size="small"
              sx={{ height: 24 }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", width: "100%" }}
        >
          <IconButton
            size="small"
            title="Editar"
            sx={{ color: "primary.main" }}
            onClick={() => onEdit(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            title="Eliminar"
            sx={{ color: "error.main" }}
            onClick={() => onDelete(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 550,
        width: "100%",
        bgcolor: "white",
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={branches}
        columns={columns}
        loading={isLoading}
        rowHeight={90}
        disableColumnResize={true}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
            display: "block",
            paddingTop: "8px !important",
            paddingBottom: "8px !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#fafafa",
            borderBottom: "1px solid #e0e0e0",
            color: "#666",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #f0f0f0",
          },
        }}
      />
    </Box>
  );
};
