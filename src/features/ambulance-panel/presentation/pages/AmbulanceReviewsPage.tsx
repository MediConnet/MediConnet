import { ContactPhone, Star, Visibility } from "@mui/icons-material";
import { Box, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { KPICard } from "../components/KPICard";
import { useAmbulanceProfile } from "../hooks/useAmbulanceProfile";
import { useAmbulanceReviews } from "../hooks/useAmbulanceReviews";
import { buildAmbulanceUserHeaderProfile } from "../lib/user-header";

export const AmbulanceReviewsPage = () => {
  const theme = useTheme();
  const { profile, isLoading: isLoadingProfile } = useAmbulanceProfile();
  const { reviews, loading: isLoadingReviews, total, page, setPage, limit, setLimit } = useAmbulanceReviews();
  const userHeaderProfile = buildAmbulanceUserHeaderProfile(profile);
  const headerReviews = reviews.map((r) => ({
    id: r.id,
    userName: r.patientName,
    rating: r.rating,
    comment: r.comment,
    date: r.date,
  }));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: limit });

  const isLoading = isLoadingProfile || isLoadingReviews;

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

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
          <Star sx={{ color: "#FFC107", fontSize: 18, mr: 0.5 }} />
          <Typography fontWeight={600}>{params.value}</Typography>
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
      valueGetter: (_value, row) => new Date(row.date).toLocaleDateString("es-ES"),
    },
  ];

  if (isLoading || !profile) {
    return (
      <DashboardLayout
        role="PROVIDER"
        userProfile={userHeaderProfile}
        notificationType="reviews"
        reviews={headerReviews}
        notificationsViewAllPath="/provider/ambulance/reviews"
      >
        <Box p={3}>
          <Skeleton variant="rectangular" height={150} sx={{ mb: 3, borderRadius: 3 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="PROVIDER"
      userProfile={userHeaderProfile}
      notificationType="reviews"
      reviews={headerReviews}
      notificationsViewAllPath="/provider/ambulance/reviews"
    >
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Visitas al perfil"
              value={profile.stats.profileViews}
              icon={<Visibility sx={{ color: theme.palette.primary.main }} />}
              iconColor={theme.palette.primary.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Contactos"
              value={profile.stats.contactClicks}
              icon={<ContactPhone sx={{ color: theme.palette.info.main }} />}
              iconColor={theme.palette.info.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Reseñas"
              value={profile.stats.totalReviews}
              icon={<Star sx={{ color: theme.palette.warning.main }} />}
              iconColor={theme.palette.warning.light + "20"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title="Rating"
              value={profile.stats.averageRating}
              icon={<Star sx={{ color: "#FFC107" }} />}
              iconColor="#FFF8E1"
            />
          </Grid2>
        </Grid2>

        <Paper
          elevation={0}
          sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "grey.200", bgcolor: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
        >
          <Box mb={3}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Reseñas de Pacientes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Valoraciones recibidas desde la aplicación móvil
            </Typography>
          </Box>

          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={reviews}
              columns={columns}
              loading={isLoadingReviews}
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
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
