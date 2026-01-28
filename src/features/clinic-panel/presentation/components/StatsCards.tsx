import { Box, Card, CardContent, Typography, Grid2 } from "@mui/material";
import { People, LocalHospital, Event, CheckCircle } from "@mui/icons-material";
import type { ClinicDashboard } from "../../domain/clinic.entity";

interface StatsCardsProps {
  data: ClinicDashboard;
}

export const StatsCards = ({ data }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Médicos",
      value: data.totalDoctors,
      icon: <People sx={{ fontSize: 40, color: "#14b8a6" }} />,
      color: "#14b8a6",
    },
    {
      title: "Médicos Activos",
      value: data.activeDoctors,
      icon: <LocalHospital sx={{ fontSize: 40, color: "#10b981" }} />,
      color: "#10b981",
    },
    {
      title: "Citas de Hoy",
      value: data.todayAppointments,
      icon: <Event sx={{ fontSize: 40, color: "#3b82f6" }} />,
      color: "#3b82f6",
    },
    {
      title: "Citas Completadas",
      value: data.completedAppointments,
      icon: <CheckCircle sx={{ fontSize: 40, color: "#8b5cf6" }} />,
      color: "#8b5cf6",
    },
  ];

  return (
    <Grid2 container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.8 }}>{stat.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};
