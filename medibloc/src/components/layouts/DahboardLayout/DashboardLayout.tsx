import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext/AuthContext';
import { navConfig } from './navConfig';
import logo from '../../../assets/logo/logo.png';
import { ROUTES } from '../../../utils/constants/routes.constants';

type DashboardLayoutProps = Readonly<{
  children: ReactNode;
  pageTitle?: string;
}>;

/**
 * Layout pour les dashboards (Admin, Doctor, Patient)
 * Sidebar responsive avec navigation par rôle
 */
export default function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = user?.role ? (navConfig[user.role] ?? []) : [];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="flex h-screen overflow-hidden bg-(--ui-bg)">

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 w-full cursor-default bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-(--ui-border-soft) bg-(--ui-surface) transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-(--ui-border-soft) px-5">
          <div className="p-0.5 rounded-xl bg-linear-to-br from-[#3a7bd5] to-[#27ae60]">
            <div className="flex items-center justify-center rounded-xl bg-white p-1.5">
              <img src={logo} alt="Medibloc" className="h-7 w-auto object-contain" />
            </div>
          </div>
          <span className="text-base font-bold bg-linear-to-r from-[#3a7bd5] to-[#27ae60] bg-clip-text text-transparent">
            MediBloc
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-(--ui-text-muted) hover:bg-(--ui-surface-soft) hover:text-(--ui-text) lg:hidden"
            aria-label="Fermer le menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-linear-to-r from-[#3a7bd5]/15 to-[#27ae60]/15 text-(--ui-text)'
                    : 'text-(--ui-text-muted) hover:bg-(--ui-surface-soft) hover:text-(--ui-text)'
                }`}
              >
                <item.icon
                  size={18}
                  className={active ? 'text-[#3a7bd5]' : 'group-hover:text-[#3a7bd5] transition-colors'}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <FiChevronRight size={14} className="shrink-0 text-[#3a7bd5]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-(--ui-border-soft) p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#3a7bd5] to-[#27ae60] text-white text-sm font-bold">
              {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-(--ui-text)">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-(--ui-text-muted)">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-(--ui-text-muted) hover:bg-(--ui-surface-soft) hover:text-(--ui-text) transition-colors"
          >
            <FiLogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">

        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-(--ui-border-soft) bg-(--ui-surface) px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-(--ui-text-muted) hover:bg-(--ui-surface-soft) hover:text-(--ui-text) lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <FiMenu size={22} />
          </button>

          {pageTitle && (
            <h1 className="truncate text-lg font-semibold text-(--ui-text)">{pageTitle}</h1>
          )}

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#3a7bd5] to-[#27ae60] text-white text-xs font-bold">
                {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className="text-sm font-medium text-(--ui-text)">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
