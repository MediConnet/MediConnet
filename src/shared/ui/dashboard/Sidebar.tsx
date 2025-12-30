import { Logout } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/config/constants";
import { useAuthStore } from "../../../app/store/auth.store";
import { getMenuByRole, type UserRole } from "../../config/navigation.config";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
}

export const Sidebar = ({ role, isOpen }: SidebarProps) => {
  const authStore = useAuthStore();
  const { user } = authStore;
  const menuItems = getMenuByRole(role, user?.tipo);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = authStore;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
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
          isOpen ? "px-6 gap-2" : "justify-center px-0"
        }`}
      >
        <div className="bg-teal-500 p-2 rounded-lg shrink-0">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            MEDICONNECT
          </h1>
        </div>
      </div>

      {/* ... MENU ITEMS ... */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, index) => {
          const pathWithoutQuery = item.path.split("?")[0];
          const tabParam = item.path.includes("tab=")
            ? item.path.split("tab=")[1]
            : null;
          const currentTab = tabParam
            ? location.search.includes(`tab=${tabParam}`)
            : false;

          const isActive =
            location.pathname.startsWith(pathWithoutQuery) &&
            (tabParam
              ? currentTab
              : !location.search.includes("tab=") ||
                location.pathname !== pathWithoutQuery);

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
