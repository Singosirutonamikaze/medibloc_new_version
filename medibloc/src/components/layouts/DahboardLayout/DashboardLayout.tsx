import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronRight,
  FiSun,
  FiCloud,
  FiCloudRain,
  FiCloudLightning,
  FiFileText,
} from 'react-icons/fi';
import { useAuth, useHeaderInfo } from '../../../hooks';
import { navConfig } from './navConfig';
import logo from '../../../assets/logo/logo.png';
import { ROUTES } from '../../../utils/constants/routes.constants';
import { FILE_BASE_URL } from '../../../utils/api/api';

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
  const { weather, currentNews, loading: headerLoading } = useHeaderInfo();
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
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active
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
          <Link
            to={user?.role === 'ADMIN' ? ROUTES.ADMIN.PROFILE : user?.role === 'DOCTOR' ? ROUTES.DOCTOR.PROFILE : ROUTES.PATIENT.PROFILE}
            className="flex items-center gap-3 px-2 py-2 rounded-xl transition-colors hover:bg-(--ui-surface-soft) group"
          >
            <div className="relative">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 text-sm font-bold overflow-hidden border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${FILE_BASE_URL}${user.avatarUrl}`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-slate-700 w-full h-full flex items-center justify-center text-slate-300">
                    {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-(--ui-text) group-hover:text-[#3a7bd5] transition-colors">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-(--ui-text-muted)">{user?.email}</p>
            </div>
          </Link>
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
            <h1 className="truncate text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
          )}

          {/* Weather & News Hub - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-6 ml-8 flex-1 max-w-2xl">
            <div className="h-8 w-[1px] bg-slate-700/50" />
            
            {/* Weather Widget */}
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${headerLoading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-amber-400">
                {weather.condition === 'sunny' && <FiSun size={18} />}
                {weather.condition === 'cloudy' && <FiCloud size={18} />}
                {weather.condition === 'rainy' && <FiCloudRain size={18} />}
                {weather.condition === 'stormy' && <FiCloudLightning size={18} />}
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="text-sm font-bold text-white leading-tight">{weather.temp}°C <span className="text-slate-500 font-medium">| {weather.description}</span></span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">{weather.city}</span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-700/50" />

            {/* News Journal Widget */}
            <div className={`flex items-center gap-3 flex-1 min-w-0 transition-opacity duration-300 ${headerLoading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                <FiFileText size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold uppercase tracking-widest border border-slate-700">
                    {currentNews?.category}
                  </span>
                  <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest animate-pulse">Flash</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate italic">
                  "{currentNews?.title}"
                </p>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="relative">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 text-xs font-bold overflow-hidden border border-slate-700">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${FILE_BASE_URL}${user.avatarUrl}`}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-slate-700 w-full h-full flex items-center justify-center text-slate-300">
                      {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
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
