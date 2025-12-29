import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: string;
  icon: ReactNode;
  iconColorClass: string; // ej: 'text-emerald-600 bg-emerald-50'
}

export const StatCard = ({
  title,
  value,
  trend,
  icon,
  iconColorClass,
}: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        {trend && (
          <p className="text-emerald-500 text-xs font-semibold mt-2">{trend}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${iconColorClass}`}>{icon}</div>
    </div>
  );
};
