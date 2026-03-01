const stats = [
  {
    number: '6',
    unit: 'modules',
    label: 'médicaux intégrés',
    desc: "Patients, médecins, rendez-vous, prescriptions, dossiers et statistiques — tout réuni dans un seul outil.",
  },
  {
    number: '1',
    unit: 'outil',
    label: "pour toute l'équipe",
    desc: "Médecins, administrateurs et pharmaciens travaillent dans le même environnement partagé.",
  },
  {
    number: '×2',
    unit: 'moins',
    label: 'de charge administrative',
    desc: "Les tâches répétitives sont automatisées pour que vous vous concentriez sur l'essentiel : le soin.",
  },
] as const;

export const ActiviteSection = () => {
  return (
    <section className="mt-8 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-(--ui-info)">Impact mesurable</p>
      <h2 className="mt-2 text-2xl font-bold text-(--ui-text) sm:text-3xl">
        Pourquoi les équipes choisissent Medibloc
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--ui-text-muted)">
        Les résultats se font sentir dès les premiers jours dans l'organisation quotidienne.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map(({ number, unit, label, desc }) => (
          <div
            key={label}
            className="rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface-soft) p-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--ui-border) hover:shadow-md"
          >
            <div className="flex items-end gap-1">
              <span className="text-4xl font-extrabold leading-none text-(--ui-info)">{number}</span>
              <span className="pb-1 text-base font-semibold text-(--ui-text)">{unit}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-(--ui-text-muted)">{label}</p>
            <p className="mt-3 text-sm leading-relaxed text-(--ui-text-muted)">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
