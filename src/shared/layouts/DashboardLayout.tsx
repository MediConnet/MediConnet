import { type ReactNode, useState } from "react";
import type { UserRole, MenuItem } from "../config/navigation.config";
import { Header, type UserHeaderProfile } from "../ui/dashboard/Header";
import { Sidebar } from "../ui/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userProfile: UserHeaderProfile;
  notificationsViewAllPath?: string;
  notificationsVariant?: "legacy" | "professional";
  agendaPath?: string;
  reviewsPath?: string;
  reviewsCount?: number;
  enableReviewAlerts?: boolean;
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
  reviews?: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  notificationType?: "appointments" | "orders" | "reviews";
  menuItems?: MenuItem[]; // ⭐ Menú personalizado opcional
}

export const DashboardLayout = ({
  children,
  role,
  userProfile,
  notificationsViewAllPath,
  notificationsVariant = "legacy",
  agendaPath,
  reviewsPath,
  reviewsCount = 0,
  enableReviewAlerts = true,
  appointments = [],
  orders = [],
  reviews = [],
  notificationType = "appointments",
  menuItems,
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={role} isOpen={isSidebarOpen} menuItems={menuItems} />

      {/* Contenedor Principal */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header
          user={userProfile}
          isMenuOpen={isSidebarOpen}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          notificationsVariant={notificationsVariant}
          agendaPath={agendaPath}
          reviewsPath={reviewsPath}
          reviewsCount={reviewsCount}
          enableReviewAlerts={enableReviewAlerts}
          appointments={appointments}
          orders={orders}
          reviews={reviews}
          notificationType={notificationType}
          notificationsViewAllPath={notificationsViewAllPath}
        />

        <main className="flex-1 p-8 mt-20">{children}</main>
      </div>
    </div>
  );
};
