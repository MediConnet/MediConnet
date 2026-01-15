import { useState, useEffect, useMemo } from "react";
import { Menu as MenuIcon, Notifications } from "@mui/icons-material";
import { NotificationsDropdown } from "./NotificationsDropdown";

export interface UserHeaderProfile {
  name: string;
  roleLabel: string;
  initials: string;
  isActive?: boolean;
}

interface HeaderProps {
  user: UserHeaderProfile;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  appointments?: Array<{
    id: string;
    patientName: string;
    date: string;
    time: string;
    reason: string;
  }>;
  orders?: Array<{
    id: string;
    orderNumber: string;
    clientName: string;
    orderDate: string;
    status: string;
    totalAmount?: number;
  }>;
  notificationType?: "appointments" | "orders";
}

export const Header = ({
  user,
  onMenuToggle,
  isMenuOpen,
  appointments = [],
  orders = [],
  notificationType = "appointments",
}: HeaderProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set());

  // Validar que user existe, si no, usar valores por defecto
  const safeUser = user || {
    name: "Usuario",
    roleLabel: "Usuario",
    initials: "U",
    isActive: false,
  };

  // Cargar notificaciones vistas desde localStorage y limpiar las de días anteriores
  useEffect(() => {
    const saved = localStorage.getItem(`viewed-notifications-${notificationType}`);
    const today = new Date().toISOString().split("T")[0];
    
    if (saved) {
      try {
        const viewed = JSON.parse(saved);
        // Obtener IDs de notificaciones de hoy
        const todayItems = notificationType === "orders"
          ? orders.filter((order) => order.orderDate === today).map((o) => o.id)
          : appointments.filter((apt) => apt.date === today).map((a) => a.id);
        
        // Solo mantener las notificaciones vistas que son de hoy
        const todayViewed = viewed.filter((id: string) => todayItems.includes(id));
        setViewedNotifications(new Set(todayViewed));
        
        // Guardar solo las de hoy
        localStorage.setItem(
          `viewed-notifications-${notificationType}`,
          JSON.stringify(todayViewed)
        );
      } catch (error) {
        console.error("Error loading viewed notifications:", error);
      }
    }
  }, [notificationType, appointments, orders]);

  // Obtener solo las citas o pedidos de hoy
  const today = new Date().toISOString().split("T")[0];
  
  // Filtrar notificaciones no vistas
  const unreadNotifications = useMemo(() => {
    if (notificationType === "orders") {
      const todayOrders = orders.filter((order) => order.orderDate === today);
      return todayOrders.filter((order) => !viewedNotifications.has(order.id));
    } else {
      const todayAppointments = appointments.filter((apt) => apt.date === today);
      return todayAppointments.filter((apt) => !viewedNotifications.has(apt.id));
    }
  }, [appointments, orders, today, notificationType, viewedNotifications]);

  const notificationCount = unreadNotifications.length;

  // Separar notificaciones no vistas por tipo
  const unreadAppointments = notificationType === "appointments" 
    ? (unreadNotifications as typeof appointments)
    : [];
  const unreadOrders = notificationType === "orders"
    ? (unreadNotifications as typeof orders)
    : [];

  // Solo abrir/cerrar el dropdown sin marcar como vistas automáticamente
  const handleNotificationsOpen = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  // Función para marcar todas las notificaciones como leídas manualmente
  const handleMarkAllAsRead = () => {
    const todayItems = notificationType === "orders"
      ? orders.filter((order) => order.orderDate === today)
      : appointments.filter((apt) => apt.date === today);
    
    const newViewed = new Set(viewedNotifications);
    todayItems.forEach((item) => newViewed.add(item.id));
    setViewedNotifications(newViewed);
    
    // Guardar en localStorage
    localStorage.setItem(
      `viewed-notifications-${notificationType}`,
      JSON.stringify(Array.from(newViewed))
    );
  };

  return (
    <header
      className={`bg-white h-20 px-8 flex items-center justify-between border-b border-gray-200 fixed top-0 right-0 z-40 transition-all duration-300 ${
        isMenuOpen ? "left-64" : "left-20"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <MenuIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {safeUser.roleLabel === "Super Admin" ? "Panel de Administración" : "Panel Profesional"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {safeUser.isActive && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
            Servicio Activo
          </span>
        )}

        <div className="relative">
          <button
            onClick={handleNotificationsOpen}
            className="relative text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <Notifications />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
          <NotificationsDropdown
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            appointments={notificationType === "appointments" ? appointments.filter((apt) => apt.date === today) : []}
            orders={notificationType === "orders" ? orders.filter((order) => order.orderDate === today) : []}
            notificationType={notificationType}
            viewedNotifications={viewedNotifications}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{safeUser.name}</p>
            <p className="text-xs text-gray-500">{safeUser.roleLabel}</p>
          </div>
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold cursor-pointer">
            {safeUser.initials}
          </div>
        </div>
      </div>
    </header>
  );
};
