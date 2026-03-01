import { FiActivity, FiCalendar, FiFileText, FiLock, FiShield, FiUsers } from 'react-icons/fi';

const services = [
  {
    Icon: FiLock,
    color: 'bg-violet-500/10 text-violet-500',
    title: 'Accès sécurisé pour chaque profil',
    desc: "Chaque utilisateur se connecte avec son rôle et n'accède qu'aux actions qui le concernent.",
  },
  {
    Icon: FiUsers,
    color: 'bg-blue-500/10 text-blue-500',
    title: 'Fiches patients et médecins centralisées',
    desc: 'Consultez toutes les informations essentielles dans un seul espace, sans navigation complexe.',
  },
  {
    Icon: FiCalendar,
    color: 'bg-emerald-500/10 text-emerald-500',
    title: 'Gestion fluide des rendez-vous',
    desc: 'Planifiez les consultations, suivez leur statut et gardez une vue claire du planning médical.',
  },
  {
    Icon: FiFileText,
    color: 'bg-amber-500/10 text-amber-500',
    title: 'Dossiers médicaux structurés',
    desc: 'Enregistrez les diagnostics, traitements et notes dans un historique complet et accessible.',
  },
  {
    Icon: FiShield,
    color: 'bg-rose-500/10 text-rose-500',
    title: 'Prescriptions mieux suivies',
    desc: 'Reliez chaque ordonnance aux médicaments dispensés pour un suivi de traitement irréprochable.',
  },
  {
    Icon: FiActivity,
    color: 'bg-sky-500/10 text-sky-500',
    title: 'Indicateurs pour mieux décider',
    desc: "Suivez l'activité de la structure et prenez vos décisions sur des données fiables et actualisées.",
  },
] as const;

export const ServiceSection = () => {
  return (
    <section className="mt-10 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-6 shadow-sm sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-(--ui-info)">Fonctionnalités</p>
        <h2 className="mt-2 text-2xl font-bold text-(--ui-text) sm:text-3xl">
          Ce que vous pouvez faire avec Medibloc
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--ui-text-muted)">
          La plateforme centralise tout ce dont votre structure a besoin pour travailler de façon plus simple et plus fiable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ Icon, color, title, desc }) => (
          <article
            key={title}
            className="group rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface-soft) p-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--ui-border) hover:shadow-md"
          >
            <span className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
              <Icon className="text-xl" />
            </span>
            <h3 className="text-[15px] font-semibold leading-snug text-(--ui-text)">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-(--ui-text-muted)">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
