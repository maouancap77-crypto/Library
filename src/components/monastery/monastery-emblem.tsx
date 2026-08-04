'use client'

/**
 * Emblema monástico: escudo com cruz, livro aberto e raios de luz.
 * SVG inline para permitir animação CSS nos elementos.
 */
export function MonasteryEmblem({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Emblema do Scriptorium"
    >
      <defs>
        <radialGradient id="emblem-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.85 0.14 75)" stopOpacity="0.8" />
          <stop offset="60%" stopColor="oklch(0.5 0.12 55)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.3 0.08 40)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="emblem-shield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.5 0.1 55)" />
          <stop offset="100%" stopColor="oklch(0.3 0.08 40)" />
        </linearGradient>
        <linearGradient id="emblem-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.85 0.14 80)" />
          <stop offset="100%" stopColor="oklch(0.6 0.12 70)" />
        </linearGradient>
      </defs>

      {/* Halo de luz */}
      <circle cx="60" cy="55" r="55" fill="url(#emblem-glow)" className="animate-gold-shimmer" />

      {/* Raios */}
      <g opacity="0.5" stroke="url(#emblem-gold)" strokeWidth="1" strokeLinecap="round">
        <line x1="60" y1="8" x2="60" y2="18" />
        <line x1="60" y1="92" x2="60" y2="102" />
        <line x1="13" y1="55" x2="23" y2="55" />
        <line x1="97" y1="55" x2="107" y2="55" />
        <line x1="26" y1="21" x2="33" y2="28" />
        <line x1="87" y1="82" x2="94" y2="89" />
        <line x1="26" y1="89" x2="33" y2="82" />
        <line x1="87" y1="28" x2="94" y2="21" />
      </g>

      {/* Escudo */}
      <path
        d="M60 20 L92 30 L92 60 Q92 85 60 100 Q28 85 28 60 L28 30 Z"
        fill="url(#emblem-shield)"
        stroke="url(#emblem-gold)"
        strokeWidth="2"
      />

      {/* Livro aberto no centro */}
      <g transform="translate(60 52)">
        {/* Página esquerda */}
        <path
          d="M-18 -8 Q-9 -10 0 -6 L0 8 Q-9 4 -18 6 Z"
          fill="oklch(0.88 0.04 80)"
          stroke="oklch(0.55 0.1 70)"
          strokeWidth="0.8"
        />
        {/* Página direita */}
        <path
          d="M18 -8 Q9 -10 0 -6 L0 8 Q9 4 18 6 Z"
          fill="oklch(0.9 0.04 80)"
          stroke="oklch(0.55 0.1 70)"
          strokeWidth="0.8"
        />
        {/* Linhas de texto */}
        <line x1="-14" y1="-4" x2="-4" y2="-2" stroke="oklch(0.4 0.05 50)" strokeWidth="0.5" />
        <line x1="-14" y1="0" x2="-4" y2="2" stroke="oklch(0.4 0.05 50)" strokeWidth="0.5" />
        <line x1="-14" y1="4" x2="-4" y2="6" stroke="oklch(0.4 0.05 50)" strokeWidth="0.5" />
        <line x1="4" y1="-2" x2="14" y2="-4" stroke="oklch(0.4 0.05 50)" strokeWidth="0.5" />
        <line x1="4" y1="2" x2="14" y2="0" stroke="oklch(0.4 0.05 50)" strokeWidth="0.5" />
        <line x1="4" y1="6" x2="14" y2="4" stroke="oklch(0.4 0.05 50)" strokeWidth="0.5" />
      </g>

      {/* Cruz no topo */}
      <g transform="translate(60 30)">
        <rect x="-1.5" y="-8" width="3" height="16" fill="url(#emblem-gold)" rx="0.5" />
        <rect x="-5" y="-3" width="10" height="3" fill="url(#emblem-gold)" rx="0.5" />
      </g>

      {/* Base ornamental */}
      <path
        d="M40 78 Q60 86 80 78"
        fill="none"
        stroke="url(#emblem-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="78" r="1.5" fill="url(#emblem-gold)" />
    </svg>
  )
}
