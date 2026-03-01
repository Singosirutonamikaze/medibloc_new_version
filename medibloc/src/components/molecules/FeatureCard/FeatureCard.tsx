import type { ReactNode } from 'react';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'blue' | 'green' | 'purple' | 'cyan';
}

const colorClasses = {
  blue: 'from-[#4A90E2] to-[#357ABD]',
  green: 'from-[#2ECC71] to-[#27AE60]',
  purple: 'from-[#9B59B6] to-[#8E44AD]',
  cyan: 'from-[#1ABC9C] to-[#16A085]',
};

export const FeatureCard = ({
  icon,
  title,
  description,
  color = 'blue',
}: FeatureCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white to-gray-50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
    {/* Gradient background subtle */}
    <div className={`absolute inset-0 bg-linear-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

    {/* Icon container */}
    <div
      className={`inline-flex items-center justify-center h-14 w-14 rounded-xl bg-linear-to-br ${colorClasses[color]} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mb-4 relative z-10`}
    >
      {icon}
    </div>

    {/* Content */}
    <h3 className="text-lg font-semibold text-gray-800 mb-2 relative z-10">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed relative z-10">{description}</p>

    {/* Bottom accent */}
    <div className={`absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl ${colorClasses[color]} opacity-5 rounded-full -mr-12 -mb-12 group-hover:opacity-10 transition-opacity duration-300`} />
  </div>
);
