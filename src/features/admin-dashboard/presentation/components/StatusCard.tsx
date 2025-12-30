import type { ReactNode } from "react";

interface StatusCardProps {
  label: string;
  count: number;
  colorClass: string;
  bgClass: string;
  icon: ReactNode;
}

export const StatusCard = ({
  label,
  count,
  colorClass,
  bgClass,
  icon,
}: StatusCardProps) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{count}</h3>
      </div>
      <div className={`p-2 rounded-full ${bgClass} ${colorClass}`}>{icon}</div>
    </div>
  );
};
