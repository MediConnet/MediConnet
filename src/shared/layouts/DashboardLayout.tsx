import { type ReactNode, useState } from "react";
import type { UserRole } from "../config/navigation.config";
import { Header, type UserHeaderProfile } from "../ui/dashboard/Header";
import { Sidebar } from "../ui/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  role: UserRole;
  userProfile: UserHeaderProfile;
}

export const DashboardLayout = ({
  children,
  title = "Panel",
  role,
  userProfile,
}: DashboardLayoutProps) => {
  // Estado para controlar si el sidebar está expandido (true) o mini (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={role} isOpen={isSidebarOpen} />

      {/* Contenedor Principal */}
      {/* Cambiamos ml-0 por ml-20 cuando está cerrado (ancho del mini sidebar) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header
          title={title}
          user={userProfile}
          isMenuOpen={isSidebarOpen} // Pasamos el estado al header para calcular su ancho/posición
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-8 mt-20">{children}</main>
      </div>
    </div>
  );
};
