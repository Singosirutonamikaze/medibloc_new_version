import type { ReactNode } from 'react';
import { LogoFull } from '../../atoms/Logo';

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
  features,
  cta,
  showLogo = true,
}: HeroSectionProps) => (
  <section className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#F0F4FF] via-white to-[#F5FFFA]">
    {/* Éléments de décoration */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#4A90E2]/10 to-transparent rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-[#2ECC71]/10 to-transparent rounded-full blur-3xl" />

    {/* Contenu */}
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      {showLogo && (
        <div className="mb-12 animate-fade-in">
          <LogoFull size={40} className="drop-shadow-lg" />
        </div>
      )}

      {/* Texte principal */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span className="bg-linear-to-r from-[#4A90E2] via-[#2ECC71] to-[#2ECC71] bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Boutons CTA */}
      {cta && (
        <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-fade-in-delay">
          <button
            onClick={cta.primary.onClick}
            className="px-8 py-3 bg-linear-to-r from-[#4A90E2] to-[#2ECC71] text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {cta.primary.label}
          </button>
          {cta.secondary && (
            <button
              onClick={cta.secondary.onClick}
              className="px-8 py-3 border-2 border-[#4A90E2] text-[#4A90E2] font-semibold rounded-lg hover:bg-[#F0F4FF] transition-all duration-300"
            >
              {cta.secondary.label}
            </button>
          )}
        </div>
      )}

      {/* Caractéristiques */}
      {features && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl animate-slide-up-delay">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/60 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-linear-to-br from-[#4A90E2] to-[#2ECC71] text-white mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-gray-600">Découvrir plus</span>
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </section>
);
