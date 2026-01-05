import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getActivityHistoryUseCase } from "../../application/get-activity-history.usecase";
import type { ActivityHistory } from "../../domain/activity-history.entity";
import { ActivityItem } from "../components/ActivityItem";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
  initials: "AG",
};

export const ActivityPage = () => {
  const [historyList, setHistoryList] = useState<ActivityHistory[]>([]);

  useEffect(() => {
    getActivityHistoryUseCase().then(setHistoryList);
  }, []);

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            minHeight: 600,
          }}
        >
          <Box mb={4}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Historial de Actividad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registro completo de acciones en la plataforma
            </Typography>
          </Box>

          <Box>
            {historyList.map((item) => (
              <ActivityItem key={item.id} history={item} />
            ))}
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
};
