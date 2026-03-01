import type { ReactNode } from 'react';
import { LogoFull } from '../../atoms/Logo';
import heartHero from '../../../assets/images/heart-Hero.png';

interface HeroFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  features?: HeroFeature[];
  cta?: {
    primary: { label: string; onClick: () => void };
    secondary?: { label: string; onClick: () => void };
  };
  showLogo?: boolean;
}

export const HeroSection = ({
  title,
  subtitle,
  cta,
  features,
  showLogo = true,
}: HeroSectionProps) => (
  <section className="relative min-h-[80vh] overflow-hidden bg-(--ui-bg) rounded-xl">
    <div className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-(--ui-info-dim) blur-3xl" />
    <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-(--ui-info-dim) blur-3xl" />

    <div className="relative z-10 mx-auto flex min-h-[84vh] w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col">
          {showLogo && (
            <div className="mb-4">
              <LogoFull size={36} />
            </div>
          )}

          <div className="inline-flex w-fit items-center rounded-full border border-(--ui-border-soft) bg-(--ui-surface) px-3 py-1 text-xs font-semibold tracking-wide text-(--ui-info)">
            Un suivi de santé plus simple
          </div>

          <h1 className="mt-4 text-3xl leading-tight font-bold text-(--ui-text) sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-(--ui-text-muted) sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-6 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-3">
              <div className="text-xs font-medium text-(--ui-text-muted)">Suivi clinique</div>
              <div className="mt-1 text-sm font-semibold text-(--ui-text)">Nous mettons à jour vos indicateurs en continu.</div>
            </div>
            <div className="rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-3">
              <div className="text-xs font-medium text-(--ui-text-muted)">Aide au diagnostic</div>
              <div className="mt-1 text-sm font-semibold text-(--ui-text)">Nous facilitons l’analyse avec une aide médicale intelligente.</div>
            </div>
            <div className="rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-3">
              <div className="text-xs font-medium text-(--ui-text-muted)">Conformité</div>
              <div className="mt-1 text-sm font-semibold text-(--ui-text)">Nous protégeons chaque dossier avec une traçabilité complète.</div>
            </div>
            <div className="rounded-xl border border-(--ui-border-soft) bg-(--ui-surface) p-3">
              <div className="text-xs font-medium text-(--ui-text-muted)">Décision</div>
              <div className="mt-1 text-sm font-semibold text-(--ui-text)">Vous choisissez plus vite grâce à des plans de prise en charge clairs.</div>
            </div>
          </div>

          {cta && (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={cta.primary.onClick}
                className="rounded-xl bg-(--ui-info) px-7 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {cta.primary.label}
              </button>
              {cta.secondary && (
                <button
                  onClick={cta.secondary.onClick}
                  className="rounded-xl border border-(--ui-border) bg-(--ui-surface) px-7 py-3 font-semibold text-(--ui-text) transition-all duration-300 hover:bg-(--ui-surface-soft)"
                >
                  {cta.secondary.label}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative flex min-h-[38vh] items-center justify-center lg:min-h-[56vh]">
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-(--ui-info-dim) blur-2xl sm:h-96 sm:w-96" />
          <div className="relative perspective-[1400px]">
            <div className="relative h-72 w-72 animate-[spin_16s_linear_infinite] transform-3d sm:h-96 sm:w-96">
              <div className="absolute inset-0 rounded-full border border-(--ui-border) transform-[rotateX(70deg)]" />
              <div className="absolute inset-3 rounded-full border border-(--ui-border-soft) transform-[rotateY(65deg)]" />
              <div className="absolute inset-6 rounded-full border border-(--ui-info) transform-[rotateX(25deg)_rotateY(35deg)]" />
              <div className="absolute inset-0 flex items-center justify-center transform-[translateZ(54px)]">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-(--ui-border-soft) bg-(--ui-surface) shadow-lg sm:h-52 sm:w-52">
                  <img
                    src={heartHero}
                    alt="Cœur médical"
                    className="h-24 w-24 animate-[spin_8s_linear_infinite] object-contain sm:h-32 sm:w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {features && (
        <div className="mt-6 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-(--ui-border-soft) bg-(--ui-surface) p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-(--ui-border) hover:bg-(--ui-surface-soft)"
            >
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-(--ui-info-dim) text-(--ui-info)">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-(--ui-text)">{feature.title}</h3>
              <p className="text-sm text-(--ui-text-muted)">{feature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
      <div className="group inline-flex items-center gap-2 rounded-full border border-(--ui-border-soft) bg-(--ui-surface)/90 px-4 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-(--ui-info) hover:bg-(--ui-surface)">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--ui-info) opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-(--ui-info)" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-(--ui-text-muted) group-hover:text-(--ui-text)">Découvrir plus</span>
        <svg
          className="h-4 w-4 animate-bounce text-(--ui-info)"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 5v14m0 0l6-6m-6 6l-6-6" />
        </svg>
      </div>
    </div>
  </section>
);
