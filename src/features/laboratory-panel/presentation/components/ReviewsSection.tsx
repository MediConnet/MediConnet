import { Star, RateReview } from "@mui/icons-material";
import { useLaboratoryReviews } from "../hooks/useLaboratoryReviews";
import { Box, Typography, CircularProgress } from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { useState } from "react";

export const ReviewsSection = () => {
  const { reviews = [], loading, total, page, setPage, limit, setLimit } = useLaboratoryReviews();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: limit });

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const totalReviews = reviews.length;

  const columns: GridColDef[] = [
    {
      field: "patientName",
      headerName: "Paciente",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "rating",
      headerName: "Calificación",
      width: 130,
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              sx={{ fontSize: 16, color: star <= params.value ? "#FFC107" : "#e0e0e0" }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "comment",
      headerName: "Comentario",
      flex: 2,
      minWidth: 300,
    },
    {
      field: "date",
      headerName: "Fecha",
      width: 120,
      valueGetter: (_value, row) => row.date ? new Date(row.date).toLocaleDateString('es-MX') : '',
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
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Reseñas de Clientes</h3>
            <p className="text-sm text-gray-500 mt-1">
              Valoraciones recibidas desde la aplicación móvil
            </p>
          </div>
          {total > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {total} {total === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <Box className="text-center py-12">
          <RateReview className="text-gray-300" sx={{ fontSize: 64 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Aún no tienes reseñas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Las reseñas de tus clientes aparecerán aquí
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
            getRowId={(row, index) => row.id ?? index}
            sx={{ border: "none" }}
          />
        </Box>
      )}
    </div>
  );
};
