import { Logout } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/config/constants";
import { useAuthStore } from "../../../app/store/auth.store";
import { logoutUseCase } from "../../../features/auth/application/logout.usecase";
import { getMenuByRole, type UserRole, type MenuItem } from "../../config/navigation.config";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  menuItems?: MenuItem[]; // ⭐ Menú personalizado opcional
}

export const Sidebar = ({ role, isOpen, menuItems: customMenuItems }: SidebarProps) => {
  const authStore = useAuthStore();
  const { user } = authStore;

  // ⭐ Usar menú personalizado si se proporciona, sino usar el menú por defecto
  const menuItems = customMenuItems || getMenuByRole(role, user?.tipo);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUseCase();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error durante el logout:", error);
      navigate(ROUTES.HOME);
    }
  };

  return (
    <aside
      className={`bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* ... LOGO ... */}
      <div
        className={`h-20 flex items-center ${
          isOpen ? "px-6 gap-3" : "justify-center px-0"
        }`}
      >
        <img 
          src="/docalink-logo.png?v=2" 
          alt="DOCALINK"
          className="shrink-0 object-contain"
          style={{ width: isOpen ? '48px' : '40px', height: isOpen ? '48px' : '40px' }}
        />
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            DOCALINK
          </h1>
        </div>
      </div>

      {/* ... MENU ITEMS ... */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, index) => {
          const [itemPath, itemQuery] = item.path.split("?");
          const isPathMatch = location.pathname === itemPath;
          let isActive = false;

          // Lógica de activación de Tabs
          if (isPathMatch) {
            if (itemQuery) {
              if (location.search) {
                isActive = location.search.includes(itemQuery);
              } else {
                isActive = itemQuery.includes("tab=dashboard");
              }
            } else {
              if (!location.search) {
                isActive = true;
              } else {
                isActive = false;
              }
            }
          }

          return (
            <Link
              key={index}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={`flex items-center rounded-lg transition-colors h-12 ${
                isOpen ? "px-4 gap-3" : "justify-center px-0"
              } ${
                isActive
                  ? "bg-teal-50 text-teal-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isOpen
                    ? "opacity-100 w-auto ml-3"
                    : "opacity-0 w-0 ml-0 overflow-hidden"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ... BOTÓN CERRAR SESIÓN ... */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors h-12 cursor-pointer ${
            isOpen ? "px-4 gap-3" : "justify-center px-0"
          }`}
        >
          <Logout className="shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              isOpen
                ? "opacity-100 w-auto ml-3"
                : "opacity-0 w-0 ml-0 overflow-hidden"
            }`}
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
};
