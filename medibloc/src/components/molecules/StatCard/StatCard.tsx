import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
}

const statusColors = {
  normal: 'text-[#2ECC71]',
  warning: 'text-[#F39C12]',
  critical: 'text-[#E74C3C]',
};

const trendIcons = {
  up: '↑',
  down: '↓',
  stable: '→',
};

export const StatCard = ({
  label,
  value,
  unit,
  icon,
  trend = 'stable',
  status = 'normal',
}: StatCardProps) => (
  <div className="group relative overflow-hidden rounded-lg bg-linear-to-br from-[#4A90E2]/10 to-[#2ECC71]/10 p-5 shadow-lg hover:shadow-xl transition-all duration-300">

    <div className="absolute inset-0 bg-linear-to-br from-[#4A90E2]/5 via-transparent to-[#2ECC71]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="flex items-start justify-between mb-3 relative z-10">
      <span className="text-xs font-semibold text-gray-50 uppercase tracking-wide">{label}</span>
      <span className={`text-xl ${statusColors[status]}`}>{icon}</span>
    </div>

    <div className="mb-3 relative z-10">
      <div className="flex items-center gap-3 w-full">
        <span className="text-3xl font-bold text-gray-100">{value}</span>
        {unit && <span className="text-sm font-semibold text-gray-50">{unit}</span>}
      </div>
    </div>

    {trend && (
      <div className="flex items-center gap-1 text-xs font-semibold relative z-10">
        <span className="text-[#2ECC71]">{trendIcons[trend]}</span>
        <span className="text-gray-200">
          {trend === 'up' && 'En augmentation'}
          {trend === 'down' && 'En diminution'}
          {trend === 'stable' && 'Stable'}
        </span>
      </div>
    )}

    <div className="absolute bottom-0 right-0 w-20 h-20 bg-linear-to-tl from-[#4A90E2]/10 to-transparent rounded-full -mr-10 -mb-10 group-hover:scale-150 transition-transform duration-300" />
  </div>
);
