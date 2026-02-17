import { Box, Divider, Paper, Skeleton, Typography } from "@mui/material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { SettingsItem } from "../../../admin-dashboard/presentation/components/SettingsItem";
import { useAdminSettings } from "../../../admin-dashboard/presentation/hooks/useAdminSettings";
import { useAdminNotificationsLayout } from "../../../admin-dashboard/presentation/hooks/useAdminNotificationsLayout";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
  initials: "AG",
};

export const SettingsPage = () => {
  const { settings, isLoading, toggleSetting } = useAdminSettings();
  const { appointments: adminAppointments, notificationsViewAllPath } = useAdminNotificationsLayout();

  if (isLoading || !settings) {
    return (
      <DashboardLayout 
        role="ADMIN" 
        userProfile={CURRENT_ADMIN}
        appointments={adminAppointments}
        notificationsVariant="professional"
        notificationsViewAllPath={notificationsViewAllPath}
      >
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
    <DashboardLayout 
      role="ADMIN" 
      userProfile={CURRENT_ADMIN}
      appointments={adminAppointments}
      notificationsVariant="professional"
      notificationsViewAllPath={notificationsViewAllPath}
    >
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

          {/* SECCIÓN 3: Anuncios */}
          <Box mt={4}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Gestión de Anuncios
            </Typography>

            <SettingsItem
              title="Solo admin puede publicar anuncios"
              description="Solo el administrador puede subir y publicar anuncios en la app y web. Los servicios deben solicitar y enviar el material del anuncio para que el admin lo publique."
              checked={settings.onlyAdminCanPublishAds}
              onChange={() => toggleSetting("onlyAdminCanPublishAds")}
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <SettingsItem
              title="Requerir aprobación de anuncios"
              description="Todos los anuncios deben ser aprobados por el administrador antes de ser publicados"
              checked={settings.requireAdApproval}
              onChange={() => toggleSetting("requireAdApproval")}
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <SettingsItem
              title="Permitir auto-publicación de anuncios"
              description="Permitir que los servicios publiquen sus anuncios directamente (desactivar si solo el admin puede publicar)"
              checked={settings.allowAdSelfPublishing}
              onChange={() => toggleSetting("allowAdSelfPublishing")}
            />
          </Box>

          {/* SECCIÓN 4: Reglas Globales */}
          <Box mt={4}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Reglas Globales
            </Typography>

            <SettingsItem
              title="Aprobación requerida para servicios"
              description="Todos los servicios nuevos deben ser aprobados manualmente por el administrador"
              checked={settings.serviceApprovalRequired}
              onChange={() => toggleSetting("serviceApprovalRequired")}
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <SettingsItem
              title="Aprobación requerida para anuncios"
              description="Todos los anuncios deben ser aprobados antes de ser publicados"
              checked={settings.adApprovalRequired}
              onChange={() => toggleSetting("adApprovalRequired")}
            />
          </Box>

          {/* SECCIÓN 5: Estados */}
          <Box mt={4}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Estados del Sistema
            </Typography>

            <SettingsItem
              title="Permitir auto-activación de servicios"
              description="Los servicios pueden activarse automáticamente después de ser aprobados"
              checked={settings.allowServiceSelfActivation}
              onChange={() => toggleSetting("allowServiceSelfActivation")}
            />
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
