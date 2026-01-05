import { Visibility, Group, Star, TrendingUp } from "@mui/icons-material";
import type { SupplyDashboard } from "../../../domain/SupplyDashboard.entity";

interface StatsCardsProps {
  data: SupplyDashboard;
}

export const StatsCards = ({ data }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Visitas al perfil */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
            <Visibility className="text-teal-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Visitas al perfil</p>
        <p className="text-3xl font-bold text-gray-800">{data.visits}</p>
      </div>

      {/* Contactos */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
            <Group className="text-teal-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Contactos</p>
        <p className="text-3xl font-bold text-gray-800">{data.contacts}</p>
      </div>

      {/* Reseñas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <Star className="text-red-500" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Reseñas</p>
        <p className="text-3xl font-bold text-gray-800">{data.reviews}</p>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
            <Star className="text-yellow-500 fill-current" />
          </div>
          <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
            <TrendingUp className="text-orange-500 text-sm" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Rating</p>
        <p className="text-3xl font-bold text-gray-800">{data.rating}</p>
      </div>
    </div>
  );
};

