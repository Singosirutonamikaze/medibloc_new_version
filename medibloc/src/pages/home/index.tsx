import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiCalendar,
  FiFileText,
  FiHeart,
  FiMapPin,
  FiMessageSquare,
  FiCheckSquare,
  FiPlusCircle,
  FiTarget,
  FiShield,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi';
import { MainLayout, Button } from '../../components';
import { ROUTES } from '../../utils/constants/routes.constants';
import heartHero from '../../assets/images/heart-Hero.png';

type ThemeMode = 'auto' | 'light' | 'dark';

type FeatureItem = Readonly<{
  title: string
  description: string
  icon: React.ReactNode
}>;

const features: readonly FeatureItem[] = [
  {
    title: 'Rendez-vous',
    description: 'Planifiez vos consultations en quelques clics',
    icon: <FiPlusCircle size={22} />,
  },
  {
    title: 'Dossier médical',
    description: 'Accédez à votre historique de santé complet',
    icon: <FiFileText size={22} />,
  },
  {
    title: 'Ordonnances',
    description: 'Suivez vos traitements et prescriptions',
    icon: <FiCheckSquare size={22} />,
  },
  {
    title: 'Suivi santé',
    description: "Visualisez l'évolution de vos symptômes",
    icon: <FiActivity size={22} />,
  },
  {
    title: 'Pharmacies',
    description: 'Trouvez les pharmacies près de chez vous',
    icon: <FiMapPin size={22} />,
  },
  {
    title: 'Messagerie',
    description: 'Communiquez avec vos praticiens',
    icon: <FiMessageSquare size={22} />,
  },
];

type StatItem = Readonly<{
  value: string
  label: string
  icon: React.ReactNode
}>;

const stats: readonly StatItem[] = [
  { value: '50K+', label: 'Utilisateurs actifs', icon: <FiHeart size={18} /> },
  { value: '1000+', label: 'Praticiens', icon: <FiShield size={18} /> },
  { value: '24/7', label: 'Disponibilité', icon: <FiClock size={18} /> },
];

type FeatureCardProps = Readonly<FeatureItem>;

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <article className="group rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface) p-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--color-primary)/30 hover:shadow-lg hover:shadow-(--color-primary)/5">
    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-(--color-primary)/10 text-(--color-primary) transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mb-2 text-base font-semibold text-(--ui-text)">{title}</h3>
    <p className="text-sm leading-relaxed text-(--ui-text-muted)">{description}</p>
  </article>
);

type StatCardProps = Readonly<StatItem>;

const StatCard = ({ value, label, icon }: StatCardProps) => (
  <div className="flex items-center gap-4 rounded-xl bg-(--ui-surface) p-4">
    <div className="flex size-10 items-center justify-center rounded-lg bg-(--color-primary)/10 text-(--color-primary)">
      {icon}
    </div>
    <div>
      <p className="text-xl font-bold text-(--ui-text)">{value}</p>
      <p className="text-xs text-(--ui-text-muted)">{label}</p>
    </div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('medibloc-theme') as ThemeMode | null;
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto') {
      return savedTheme;
    }
    return 'auto';
  });

  useEffect(() => {
    const rootElement = document.documentElement;
    if (themeMode === 'auto') {
      delete rootElement.dataset.theme;
    } else {
      rootElement.dataset.theme = themeMode;
    }
    localStorage.setItem('medibloc-theme', themeMode);
  }, [themeMode]);

  const handleGetStarted = () => {
    navigate(ROUTES.PUBLIC.REGISTER);
  };

  const handleLogin = () => {
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-(--ui-surface) via-(--ui-surface-soft) to-(--ui-surface) p-6 sm:p-10">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-(--color-primary)/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-(--color-secondary)/5 blur-3xl" />
          
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-(--color-primary)/10 px-4 py-2 text-sm font-medium text-(--color-primary)">
                <FiShield size={16} />
                <span>Plateforme sécurisée</span>
              </div>
              
              <h1 className="text-3xl font-bold leading-tight text-(--ui-text) sm:text-4xl lg:text-5xl">
                Votre santé,<br />
                <span className="bg-linear-to-r from-(--color-primary) to-(--color-secondary) bg-clip-text text-transparent">
                  simplifiée
                </span>
              </h1>
              
              <p className="max-w-md text-base leading-relaxed text-(--ui-text-muted) sm:text-lg">
                Gérez vos rendez-vous, dossiers médicaux et ordonnances depuis une interface unique et intuitive.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGetStarted}
                  className="h-12 gap-2 rounded-xl bg-linear-to-r from-(--color-primary) to-(--color-secondary) px-6 text-sm font-semibold text-white shadow-lg shadow-(--color-primary)/25 transition-all hover:shadow-xl hover:shadow-(--color-primary)/30"
                >
                  Commencer
                  <FiArrowRight size={18} />
                </Button>
                <Button
                  type="button"
                  variant="light"
                  onClick={handleLogin}
                  className="h-12 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) px-6 text-sm font-semibold text-(--ui-text) transition-all hover:border-(--color-primary)/30 hover:bg-(--ui-surface-soft)"
                >
                  Se connecter
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="app-surface flex h-9 items-center rounded-lg border border-(--ui-border-soft) p-1">
                  <button
                    type="button"
                    onClick={() => setThemeMode('auto')}
                    className={`h-7 rounded-md px-3 text-xs font-medium transition-all ${themeMode === 'auto' ? 'bg-(--color-primary) text-white' : 'text-(--ui-text-muted) hover:text-(--ui-text)'}`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`h-7 rounded-md px-3 text-xs font-medium transition-all ${themeMode === 'light' ? 'bg-(--color-primary) text-white' : 'text-(--ui-text-muted) hover:text-(--ui-text)'}`}
                  >
                    Clair
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`h-7 rounded-md px-3 text-xs font-medium transition-all ${themeMode === 'dark' ? 'bg-(--color-primary) text-white' : 'text-(--ui-text-muted) hover:text-(--ui-text)'}`}
                  >
                    Sombre
                  </button>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-(--color-primary)/10 to-(--color-secondary)/10 blur-2xl" />
              <div className="relative flex items-center justify-center rounded-3xl bg-(--ui-surface-soft) p-8">
                <img
                  src={heartHero}
                  alt="Illustration santé"
                  className="h-80 w-auto object-contain drop-shadow-2xl"
                />
                
                <div className="absolute left-4 top-8 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-xs text-(--ui-text-muted)">
                    <FiActivity size={14} className="text-(--color-primary)" />
                    <span>VFC</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-(--ui-text)">84 ms</p>
                </div>
                
                <div className="absolute bottom-8 right-4 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-xs text-(--ui-text-muted)">
                    <FiTarget size={14} className="text-(--color-primary)" />
                    <span>Tension</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-(--ui-text)">120/80</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-(--ui-text) sm:text-3xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-(--ui-text-muted) sm:text-base">
              Une plateforme complète pour gérer votre santé au quotidien
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-linear-to-r from-(--color-primary) to-(--color-secondary) p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-white/20">
              <FiCalendar size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Prêt à prendre soin de votre santé ?
            </h2>
            <p className="text-white/80">
              Rejoignez des milliers d'utilisateurs qui font confiance à Medibloc pour gérer leur parcours de santé.
            </p>
            <Button
              type="button"
              variant="light"
              onClick={handleGetStarted}
              className="h-12 gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-(--color-primary) shadow-lg transition-all hover:bg-white/90"
            >
              Créer mon compte gratuit
              <FiArrowRight size={18} />
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
