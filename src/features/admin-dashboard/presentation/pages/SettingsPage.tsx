import { Box, Divider, Paper, Skeleton, Typography } from "@mui/material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { SettingsItem } from "../../../admin-dashboard/presentation/components/SettingsItem";
import { useAdminSettings } from "../../../admin-dashboard/presentation/hooks/useAdminSettings";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
  initials: "AG",
};

export const SettingsPage = () => {
  const { settings, isLoading, toggleSetting } = useAdminSettings();

  if (isLoading || !settings) {
    return (
      <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
        <Box sx={{ p: 3, maxWidth: 1000, margin: "0 auto" }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1000, margin: "0 auto" }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Box mb={4}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Configuración del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajustes generales de la plataforma
            </Typography>
          </Box>

          {/* SECCIÓN 1: Notificaciones */}
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Notificaciones
            </Typography>

            <SettingsItem
              title="Nuevas solicitudes"
              description="Recibir notificación cuando llegue una nueva solicitud"
              checked={settings.notifyNewRequests}
              onChange={() => toggleSetting("notifyNewRequests")}
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <SettingsItem
              title="Notificaciones por email"
              description="Enviar resumen diario de actividad"
              checked={settings.notifyEmailSummary}
              onChange={() => toggleSetting("notifyEmailSummary")}
            />
          </Box>

          {/* SECCIÓN 2: Plataforma */}
          <Box mt={4}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Plataforma
            </Typography>

            <SettingsItem
              title="Aprobación automática"
              description="Aprobar servicios automáticamente si cumplen requisitos"
              checked={settings.autoApproveServices}
              onChange={() => toggleSetting("autoApproveServices")}
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <SettingsItem
              title="Modo mantenimiento"
              description="Deshabilitar registro de nuevos servicios temporalmente"
              checked={settings.maintenanceMode}
              onChange={() => toggleSetting("maintenanceMode")}
            />
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
