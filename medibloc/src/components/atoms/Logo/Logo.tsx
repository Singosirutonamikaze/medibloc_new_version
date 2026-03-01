/**
 * Logo MediBloc - Composant SVG
 */
export const LogoIcon = ({ size = 32, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Gradient définition */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A90E2" stopOpacity={1} />
        <stop offset="100%" stopColor="#2ECC71" stopOpacity={1} />
      </linearGradient>
    </defs>

    {/* Fond cercle */}
    <circle cx="60" cy="60" r="55" fill="url(#logoGradient)" opacity="0.1" />

    {/* Cœur stylisé */}
    <g transform="translate(30, 25)">
      {/* Cœur principal */}
      <path
        d="M 30 50 C 30 50 10 35 10 24 C 10 16.3 15 10 20 10 C 25 10 30 15 30 15 C 30 15 35 10 40 10 C 45 10 50 16.3 50 24 C 50 35 30 50 30 50 Z"
        fill="url(#logoGradient)"
      />

      {/* Battement (lignes) */}
      <path
        d="M 5 55 L 15 50 L 20 57 L 25 48 L 30 55 L 35 48 L 40 57 L 45 50 L 55 55"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const LogoText = ({ className = '' }: { className?: string }) => (
  <span className={`font-bold text-lg bg-linear-to-r from-[#4A90E2] to-[#2ECC71] bg-clip-text text-transparent ${className}`}>
    Medi<span className="text-[#2ECC71]">Bloc</span>
  </span>
);

export const LogoFull = ({ size = 32, className = '' }: { size?: number; className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <LogoIcon size={size} />
    <LogoText />
  </div>
);
