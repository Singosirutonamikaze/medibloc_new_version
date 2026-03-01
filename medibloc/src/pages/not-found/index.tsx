import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants/routes.constants';
import logo from '../../assets/logo/logo.png';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-(--ui-bg) px-4">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-(--ui-info-dim) blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-(--ui-info-dim) blur-3xl opacity-60" />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-8 text-center shadow-xl sm:p-10">

        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
            <img src={logo} alt="Medibloc" className="h-7 w-auto object-contain" />
          </div>
          <span className="text-base font-bold bg-linear-to-r from-[#4A90E2] to-[#2ECC71] bg-clip-text text-transparent">
            Medi<span className="text-[#2ECC71]">Bloc</span>
          </span>
        </div>

        <div className="relative mb-4 inline-flex items-center justify-center">
          <span className="text-[7rem] font-extrabold leading-none tracking-tighter text-(--ui-border) sm:text-[9rem]">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[7rem] font-extrabold leading-none tracking-tighter bg-linear-to-br from-[#4A90E2] to-[#2ECC71] bg-clip-text text-transparent opacity-20 sm:text-[9rem]">
            404
          </span>
        </div>

        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-(--ui-border-soft) bg-(--ui-surface-soft) px-4 py-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          </span>
          <span className="text-xs font-semibold text-(--ui-text-muted)">Page introuvable</span>
        </div>

        <h1 className="text-xl font-bold text-(--ui-text) sm:text-2xl">
          Cette page n'existe pas
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-(--ui-text-muted)">
          L'adresse que vous avez saisie est incorrecte ou la page a été déplacée.
          Revenez à l'accueil pour continuer.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface-soft) px-5 py-2.5 text-sm font-semibold text-(--ui-text) transition-all hover:bg-(--ui-surface) hover:shadow-sm"
          >
            <FiArrowLeft size={16} />
            Retour
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.PUBLIC.HOME)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#4A90E2] to-[#2ECC71] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <FiHome size={16} />
            Aller à l'accueil
          </button>
        </div>
      </div>

      <p className="relative z-10 mt-8 text-xs text-(--ui-text-muted)">
        © {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} Medibloc
      </p>
    </div>
  );
}
