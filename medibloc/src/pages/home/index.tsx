import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { MainLayout } from '../../components';
import { ROUTES } from '../../utils/constants/routes.constants';

/**
 * Signature visuelle : ligne ECG — sobre, médicale, distinctive.
 */
const EcgLine = () => (
  <svg
    viewBox="0 0 800 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full"
    aria-hidden="true"
  >
    <path
      d="M0 30 L150 30 L162 30 L172 22 L177 38 L182 30 L196 30
         L208 2 L214 58 L220 30 L234 30 L242 18 L250 30
         L380 30
         L392 30 L402 22 L407 38 L412 30 L426 30
         L438 2 L444 58 L450 30 L464 30 L472 18 L480 30
         L800 30"
      stroke="#00C878"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const modules = [
  {
    n: '01',
    title: 'Dossiers médicaux',
    desc: 'Historique patient complet — maladies, antécédents, documents médicaux archivés de façon structurée.',
  },
  {
    n: '02',
    title: 'Rendez-vous',
    desc: 'Planification, confirmation et suivi des consultations entre patients et praticiens.',
  },
  {
    n: '03',
    title: 'Prescriptions',
    desc: 'Ordonnances médicales numérisées avec détail des traitements, dosages et durées.',
  },
  {
    n: '04',
    title: 'Pharmacies et médicaments',
    desc: 'Catalogue pharmaceutique et plantes médicinales avec gestion des stocks.',
  },
  {
    n: '05',
    title: 'Maladies et symptômes',
    desc: 'Référentiel structuré de maladies, symptômes et données de prévalence par pays.',
  },
  {
    n: '06',
    title: 'Statistiques',
    desc: 'Données agrégées pour les tableaux de bord des administrateurs et praticiens.',
  },
] as const;

const stats = [
  { value: '3 rôles', label: 'Patient · Médecin · Admin' },
  { value: 'API REST', label: 'Documentée Swagger/OpenAPI' },
  { value: 'JWT + RBAC', label: 'Auth sécurisée par rôle' },
] as const;

export default function HomePage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>(() => {
    const saved = localStorage.getItem('medibloc-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
    return 'auto';
  });

  const applyTheme = (t: 'auto' | 'light' | 'dark') => {
    setTheme(t);
    const root = document.documentElement;
    if (t === 'auto') delete root.dataset.theme;
    else root.dataset.theme = t;
    localStorage.setItem('medibloc-theme', t);
  };

  return (
    <MainLayout>
      <div className="space-y-4">

        {/* ──────────────────────────────────────────── HERO */}
        <section
          className="relative overflow-hidden rounded-2xl px-8 pb-0 pt-14 sm:px-14 sm:pt-20"
          style={{ background: 'var(--ui-hero-bg)' }}
        >
          <div className="mb-10 inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#00C878]" />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--ui-hero-muted)' }}
            >
              Plateforme active
            </span>
          </div>

          <h1
            className="text-5xl font-bold leading-[1.07] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
            style={{ color: 'var(--ui-hero-text)' }}
          >
            La médecine mérite<br />
            <span style={{ color: '#00C878' }}>mieux qu'un tableur.</span>
          </h1>

          <p
            className="mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--ui-hero-muted)' }}
          >
            MediBloc centralise dossiers médicaux, rendez-vous et prescriptions
            dans une interface unique — pensée pour les patients, les médecins
            et les administrateurs.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.PUBLIC.REGISTER)}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: '#00C878' }}
            >
              Créer un compte
              <FiArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors hover:border-white/30"
              style={{
                borderColor: 'var(--ui-hero-border)',
                color: 'var(--ui-hero-muted)',
              }}
            >
              Se connecter
              <FiArrowUpRight size={16} />
            </button>
          </div>

          {/* Ligne ECG — identité visuelle */}
          <div className="mt-16 opacity-50">
            <EcgLine />
          </div>
        </section>

        {/* ──────────────────────────────────────────── STATS */}
        <section
          className="grid grid-cols-3 divide-x overflow-hidden rounded-2xl border"
          style={{
            background: 'var(--ui-surface)',
            borderColor: 'var(--ui-border-soft)',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-6 sm:px-8">
              <p
                className="text-lg font-bold tracking-tight sm:text-xl"
                style={{ color: 'var(--ui-text)' }}
              >
                {s.value}
              </p>
              <p
                className="mt-0.5 text-xs sm:text-sm"
                style={{ color: 'var(--ui-text-muted)' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* ──────────────────────────────────────────── MODULES */}
        <section>
          <div className="mb-6">
            <p
              className="mb-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#00C878' }}
            >
              Fonctionnalités
            </p>
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: 'var(--ui-text)' }}
            >
              Six modules. Une plateforme.
            </h2>
          </div>

          <div
            className="divide-y overflow-hidden rounded-2xl border"
            style={{ borderColor: 'var(--ui-border-soft)' }}
          >
            {modules.map((m) => (
              <div
                key={m.n}
                className="flex items-start gap-6 px-6 py-5 transition-colors sm:px-8"
                style={{ background: 'var(--ui-surface)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ui-surface-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--ui-surface)';
                }}
              >
                <span
                  className="min-w-[2.5rem] text-sm font-bold tabular-nums"
                  style={{ color: '#00C878' }}
                >
                  {m.n}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold sm:text-base"
                    style={{ color: 'var(--ui-text)' }}
                  >
                    {m.title}
                  </p>
                  <p
                    className="mt-0.5 text-sm leading-relaxed"
                    style={{ color: 'var(--ui-text-muted)' }}
                  >
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────── CTA */}
        <section
          className="rounded-2xl px-8 py-14 text-center sm:px-14"
          style={{ background: 'var(--ui-hero-bg)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#00C878' }}
          >
            Commencer
          </p>
          <h2
            className="mx-auto mt-4 max-w-xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
            style={{ color: 'var(--ui-hero-text)' }}
          >
            Prenez le contrôle de votre parcours de santé dès aujourd'hui.
          </h2>
          <button
            type="button"
            onClick={() => navigate(ROUTES.PUBLIC.REGISTER)}
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            style={{ background: '#00C878' }}
          >
            Créer un compte
            <FiArrowRight size={16} />
          </button>
        </section>

        {/* ──────────────────────────────────────────── THEME */}
        <div className="flex justify-end pb-2">
          <div
            className="inline-flex h-8 items-center gap-0.5 rounded-lg border p-0.5"
            style={{
              borderColor: 'var(--ui-border-soft)',
              background: 'var(--ui-surface)',
            }}
          >
            {(['auto', 'light', 'dark'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => applyTheme(t)}
                className="h-6 rounded-md px-3 text-xs font-medium transition-colors"
                style={
                  theme === t
                    ? { background: '#00C878', color: '#000' }
                    : { color: 'var(--ui-text-muted)' }
                }
              >
                {t === 'auto' ? 'Auto' : t === 'light' ? 'Clair' : 'Sombre'}
              </button>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
