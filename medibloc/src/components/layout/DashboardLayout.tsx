import type { ReactNode } from 'react';

type DashboardLayoutProps = Readonly<{
  children: ReactNode
}>;

/**
 * Layout pour les dashboards (Admin, Doctor, Patient)
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {/* Sidebar avec navigation */}
      </aside>
      <div className="dashboard-content">
        <header className="dashboard-header">
          {/* Header du dashboard */}
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
