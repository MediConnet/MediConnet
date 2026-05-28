import { Star } from "@mui/icons-material";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { useState } from "react";
import { useDoctorReviews } from "../hooks/useDoctorReviews";

export const ReviewsSection = () => {
  const {
    reviews = [],
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
  } = useDoctorReviews();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: limit });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "Paciente",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "rating",
      headerName: "Calificación",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              sx={{ fontSize: 18, color: star <= params.value ? "#facc15" : "#d1d5db" }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "comment",
      headerName: "Comentario",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
          {params.value || "—"}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      width: 130,
      valueGetter: (_value, row) => {
        const date = row.createdAt || row.date;
        return date ? new Date(date).toLocaleDateString("es-MX") : "—";
      },
    },
  ];

  if (loading) {
    return (
      <Box className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-center items-center min-h-[200px]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Reseñas de Pacientes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Valoraciones recibidas desde la aplicación móvil
          </p>
        </div>
        {total > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{total} {total === 1 ? "reseña" : "reseñas"}</p>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <Box className="text-center py-12">
          <Star className="text-gray-300" sx={{ fontSize: 64 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Aún no tienes reseñas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Las reseñas de tus pacientes aparecerán aquí
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={reviews}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{ border: "none" }}
          />
        </Box>
      )}
    </div>
  );
};
