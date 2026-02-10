import { Visibility, Star, TrendingUp } from "@mui/icons-material";
import type { LaboratoryDashboard } from "../../domain/LaboratoryDashboard.entity";

interface StatsCardsProps {
  data: LaboratoryDashboard;
}

export const StatsCards = ({ data }: StatsCardsProps) => {
  const visits = data?.visits || 0;
  const reviews = data?.reviews || 0;
  const rating = data?.rating || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Visitas al perfil */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
            <Visibility className="text-teal-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Visitas al perfil</p>
        <p className="text-3xl font-bold text-gray-800">{visits}</p>
      </div>

      {/* Reseñas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <Star className="text-red-500" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Reseñas</p>
        <p className="text-3xl font-bold text-gray-800">{reviews}</p>
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
        <p className="text-3xl font-bold text-gray-800">{rating}</p>
      </div>
    </div>
  );
};

