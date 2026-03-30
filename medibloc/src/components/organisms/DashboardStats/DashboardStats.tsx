import { useEffect, useState } from "react";
import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaUsers,
} from "react-icons/fa";
import { StatCard } from "../../molecules/StatCard";
import { useStats } from "../../../hooks";

interface DashboardData {
  users?: number;
  patients?: number;
  doctors?: number;
  appointments?: number;
}

export const DashboardStats = () => {
  const { getDashboardStats, loading, error } = useStats();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setData(res as DashboardData))
      .catch(() => setData(null));
  }, [getDashboardStats]);

  // Skeleton des statistiques
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(() => (
          <div
            key={crypto.randomUUID()}
            className="rounded-lg bg-gray-100 animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Impossible de charger les statistiques : {error}
      </div>
    );
  }

  const cards = [
    {
      label: "Patients",
      value: data?.patients?.toLocaleString("fr-FR") ?? "—",
      unit: "patients",
      icon: <FaUserInjured />,
      trend: "up" as const,
      status: "normal" as const,
    },
    {
      label: "Médecins",
      value: data?.doctors?.toLocaleString("fr-FR") ?? "—",
      unit: "médecins",
      icon: <FaUserMd />,
      trend: "stable" as const,
      status: "normal" as const,
    },
    {
      label: "Rendez-vous",
      value: data?.appointments?.toLocaleString("fr-FR") ?? "—",
      unit: "rendez-vous",
      icon: <FaCalendarCheck />,
      trend: "up" as const,
      status: "normal" as const,
    },
    {
      label: "Utilisateurs",
      value: data?.users?.toLocaleString("fr-FR") ?? "—",
      unit: "utilisateurs",
      icon: <FaUsers />,
      trend: "stable" as const,
      status: "normal" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};