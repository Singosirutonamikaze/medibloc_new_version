import { DashboardStats } from "../../../components";
import DashboardCalendar from "../../../components/organisms/DashboardCalendar/DashboardCalendar";
import DashboardHeader from "../../../components/organisms/DashboardHeader/DashboardHeader";
import DashboardWorld from "../../../components/organisms/DashboardWorld/DashboardWorld";

/**
 * Page Dashboard d'adminstration 
 * Ici administrateur a la liste des ces statiqitue quelque données
 * Mondiaux et des mises à jour dans le domaine médicale 
 * Certaines données viendrons de OMS  
 */
export default function AdminDashboard() {
  return (
    <div className="p-4">
      <div className="mb-6 ">
        <DashboardHeader />
      </div>
      <main className="space-y-6">
        <DashboardStats />
        <DashboardCalendar />
        <DashboardWorld />
      </main>
    </div>
  );
}
