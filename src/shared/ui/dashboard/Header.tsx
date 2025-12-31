import { useState } from "react";
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

  // Obtener solo las citas o pedidos de hoy
  const today = new Date().toISOString().split("T")[0];
  let notificationCount = 0;

  if (notificationType === "orders") {
    const todayOrders = orders.filter((order) => order.orderDate === today);
    notificationCount = todayOrders.length;
  } else {
    const todayAppointments = appointments.filter((apt) => apt.date === today);
    notificationCount = todayAppointments.length;
  }

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
          {user.roleLabel === "Super Admin" ? "Panel de Administración" : "Panel Profesional"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {user.isActive && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
            Servicio Activo
          </span>
        )}

        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
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
            appointments={appointments}
            orders={orders}
            notificationType={notificationType}
          />
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.roleLabel}</p>
          </div>
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold cursor-pointer">
            {user.initials}
          </div>
        </div>
      </div>
    </header>
  );
};
