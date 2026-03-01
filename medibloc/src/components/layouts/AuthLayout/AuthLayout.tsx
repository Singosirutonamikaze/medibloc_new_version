import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../../assets/logo/logo.png';
import { ROUTES } from '../../../utils/constants/routes.constants';

interface AuthLayoutProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.PUBLIC.HOME);
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-(--ui-bg)">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-(--ui-info-dim) blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-(--ui-info-dim) blur-3xl opacity-60" />
      <div className="pointer-events-none absolute hidden lg:block top-0 bottom-0 left-1/2 bg-linear-to-b from-[#3a7bd5] to-[#27ae60] w-px z-20" />

      <div className="hidden lg:flex lg:w-1/2">
      <div className="relative flex flex-col justify-between px-16 py-12 bg-(--ui-bg) w-full">
        <div className="auth-blob-1 pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#3a7bd5]/10 blur-2xl animate-pulse" />
        <div className="auth-blob-2 pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#27ae60]/10 blur-2xl animate-pulse" />

        <div className="auth-anim-logo relative flex items-center gap-3">
          <div className="p-0.5 rounded-xl bg-linear-to-br from-[#3a7bd5] to-[#27ae60]">
            <div className="flex items-center justify-center rounded-xl bg-white p-2">
              <img src={logo} alt="Medibloc" className="h-9 w-auto object-contain" />
            </div>
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-[#3a7bd5] to-[#27ae60] bg-clip-text text-transparent tracking-tight">MediBloc</span>
        </div>

        <div className="auth-anim-content relative flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-(--ui-text) leading-tight">{title}</h1>
            <p className="mt-4 text-base font-medium text-(--ui-text-muted)">{description}</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              'Prenez rendez-vous en quelques clics',
              'Vos informations de santé, toujours avec vous',
              'Votre médecin à portée de main, quand vous en avez besoin',
            ].map((item, i) => (
              <div key={item} className={`auth-anim-item-${i + 1} p-0.5 rounded-xl bg-linear-to-r from-[#3a7bd5] to-[#27ae60]`}>
                <div className="flex items-center gap-4 rounded-xl bg-(--ui-bg) px-4 py-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#3a7bd5] to-[#27ae60]">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  <p className="text-base font-medium text-(--ui-text)">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoHome}
          className="auth-anim-btn relative inline-flex items-center gap-2 text-base font-medium text-(--ui-text-muted) transition-opacity hover:opacity-75"
        >
          <FiArrowLeft size={18} />
          Retour à l'accueil
        </button>
      </div>
      </div>

      <div className="relative z-10 flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12">
        <div className="flex lg:hidden mb-8 flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
              <img src={logo} alt="Medibloc" className="h-7 w-auto object-contain" />
            </div>
            <span className="text-base font-bold bg-linear-to-r from-[#4A90E2] to-[#2ECC71] bg-clip-text text-transparent">
              Medi<span className="text-[#2ECC71]">Bloc</span>
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-(--ui-text)">{title}</h1>
            <p className="mt-1 text-sm text-(--ui-text-muted)">{description}</p>
          </div>
        </div>

        <div className="rounded-xl w-full max-w-md border border-(--ui-border-soft) bg-(--ui-surface) p-8">
          {children}
        </div>

        <div className="mt-6 flex lg:hidden justify-center">
          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center gap-1.5 text-xs text-(--ui-text-muted) transition-colors hover:text-(--ui-text)"
          >
            <FiArrowLeft size={14} />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
