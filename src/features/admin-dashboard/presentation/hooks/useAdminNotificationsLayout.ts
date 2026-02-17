import { useAdminNotifications } from "./useAdminNotifications";

/**
 * Hook compartido para obtener las notificaciones formateadas para el DashboardLayout
 * Úsalo en todas las páginas del admin para mostrar notificaciones consistentes
 */
export const useAdminNotificationsLayout = () => {
  const { notifications } = useAdminNotifications();

  // Transformar notificaciones de admin al formato que espera el Header
  const adminAppointments = notifications.map(notif => ({
    id: notif.id,
    patientName: notif.type === "user" ? "Nuevo Usuario" : "Nuevo Anuncio",
    date: notif.date,
    time: notif.time,
    reason: notif.message,
  }));

  return {
    appointments: adminAppointments,
    notificationsViewAllPath: "/admin/requests",
  };
};
