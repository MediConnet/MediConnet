import { Logout } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { getMenuByRole, type UserRole } from "../../config/navigation.config";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
}

export const Sidebar = ({ role, isOpen }: SidebarProps) => {
  const menuItems = getMenuByRole(role);
  const location = useLocation();

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
        {/* ... código del logo ... */}
        <div className="bg-emerald-500 p-2 rounded-lg shrink-0">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            MediConnect
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={index}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={`flex items-center rounded-lg transition-colors h-12 ${
                isOpen ? "px-4 gap-3" : "justify-center px-0"
              } ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-medium"
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

      <div className="p-3 border-t border-gray-200">
        {/* ... botón logout ... */}
        <button
          className={`flex items-center w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors h-12 ${
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
