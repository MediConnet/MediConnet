import { useMemo } from "react";
import { useProviderRequests } from "./useProviderRequests";
import { useAdRequests } from "./useAdRequests";

export interface AdminNotification {
  id: string;
  type: "user" | "ad";
  title: string;
  message: string;
  date: string;
  time: string;
  link: string;
}

export const useAdminNotifications = () => {
  const { data: providerRequests = [], isLoading: loadingRequests } = useProviderRequests();
  const { data: adRequests = [], isLoading: loadingAds } = useAdRequests();

  const notifications = useMemo(() => {
    const notifs: AdminNotification[] = [];

    // Notificaciones de usuarios/proveedores pendientes
    const pendingUsers = providerRequests.filter(req => req.status === "PENDING");
    pendingUsers.forEach((req) => {
      const submissionDate = new Date(req.submissionDate);
      notifs.push({
        id: `user-${req.id}`,
        type: "user",
        title: "Nuevo usuario pendiente",
        message: `${req.providerName} está esperando aprobación`,
        date: req.submissionDate,
        time: submissionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        link: "/admin/requests",
      });
    });

    // Notificaciones de anuncios pendientes
    const pendingAds = adRequests.filter(req => req.status === "PENDING");
    pendingAds.forEach((req) => {
      const submissionDate = new Date(req.submissionDate);
      notifs.push({
        id: `ad-${req.id}`,
        type: "ad",
        title: "Nuevo anuncio pendiente",
        message: `${req.providerName} tiene un anuncio esperando aprobación`,
        date: req.submissionDate,
        time: submissionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        link: "/admin/ad-requests",
      });
    });

    // Ordenar por fecha (más recientes primero)
    return notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [providerRequests, adRequests]);

  const pendingCount = useMemo(() => {
    const pendingUsersCount = providerRequests.filter(req => req.status === "PENDING").length;
    const pendingAdsCount = adRequests.filter(req => req.status === "PENDING").length;
    return pendingUsersCount + pendingAdsCount;
  }, [providerRequests, adRequests]);

  return {
    notifications,
    pendingCount,
    isLoading: loadingRequests || loadingAds,
  };
};
