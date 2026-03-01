import { FiActivity, FiShield, FiUsers } from 'react-icons/fi';

export const ExperienceSection = () => {
  return (
    <section className="mt-8 mb-8 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-(--ui-info)">Expérience utilisateur</p>
      <h2 className="mt-2 text-2xl font-bold text-(--ui-text) sm:text-3xl">
        Conçu pour être simple dès le départ
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--ui-text-muted)">
        Aucune formation longue n'est nécessaire. Vous êtes opérationnel rapidement, quel que soit votre profil.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <article className="rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface-soft) p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <FiActivity className="text-xl" />
            </span>
            <h3 className="text-[15px] font-semibold text-(--ui-text)">Rapide à prendre en main</h3>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-(--ui-text-muted)">
              <span>Prise en main</span>
              <span className="font-semibold text-emerald-500">Immédiate</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-(--ui-surface-hard)">
              <div className="h-full w-[90%] animate-pulse rounded-full bg-emerald-500/70" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-(--ui-text-muted)">
            Les actions courantes sont accessibles en quelques clics, sans avoir à chercher dans de longs menus.
          </p>
        </article>

        <article className="rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface-soft) p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <FiUsers className="text-xl" />
            </span>
            <h3 className="text-[15px] font-semibold text-(--ui-text)">Adapté à chaque rôle</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Médecin', 'Infirmier', 'Admin', 'Pharmacien'].map((role) => (
              <span
                key={role}
                className="rounded-full border border-(--ui-border-soft) bg-(--ui-surface) px-3 py-1 text-xs font-medium text-(--ui-text)"
              >
                {role}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-(--ui-text-muted)">
            Chaque profil voit uniquement ce dont il a besoin. Moins de bruit, plus d'efficacité au quotidien.
          </p>
        </article>

        <article className="rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface-soft) p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <FiShield className="text-xl" />
            </span>
            <h3 className="text-[15px] font-semibold text-(--ui-text)">Fiable et sécurisé</h3>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) px-3 py-2.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-(--ui-text)">Système opérationnel</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-(--ui-text-muted)">
            Les données sont protégées et chaque action est tracée pour garantir la conformité de votre structure.
          </p>
        </article>
      </div>
    </section>
  );
};
