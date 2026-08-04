'use client'

interface CandleGlowProps {
  className?: string
  /** Tamanho relativo da vela em px (padrão 60). */
  size?: number
}

/**
 * Vela monástica com chama tremulante e halo de luz dourada.
 * Decorativa — posiciona-se absolutamente dentro do pai.
 */
export function CandleGlow({ className = '', size = 60 }: CandleGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size * 1.8 }}
    >
      {/* Halo de luz envolvente */}
      <div
        className="animate-flame-glow absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
        style={{
          width: size * 2.2,
          height: size * 2.2,
          background:
            'radial-gradient(circle, oklch(0.7 0.15 65 / 0.55) 0%, oklch(0.55 0.12 55 / 0.25) 35%, transparent 70%)',
          top: -size * 0.6,
        }}
      />

      {/* Chama */}
      <div
        className="animate-candle-flicker absolute left-1/2 -translate-x-1/2"
        style={{ top: 2 }}
      >
        <div
          style={{
            width: size * 0.22,
            height: size * 0.5,
            background:
              'radial-gradient(ellipse at 50% 70%, oklch(0.95 0.18 60) 0%, oklch(0.8 0.2 45) 40%, oklch(0.55 0.22 30) 70%, oklch(0.35 0.18 20) 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            boxShadow:
              '0 0 12px oklch(0.7 0.15 55 / 0.8), 0 0 24px oklch(0.6 0.12 50 / 0.5)',
          }}
        />
        {/* Núcleo branco-amarelado */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '30%',
            transform: 'translateX(-50%)',
            width: size * 0.1,
            height: size * 0.25,
            background:
              'radial-gradient(ellipse, oklch(0.98 0.05 80) 0%, oklch(0.9 0.1 65) 60%, transparent 100%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Pavio */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: size * 0.48,
          width: 2,
          height: size * 0.12,
          background: 'oklch(0.15 0.02 30)',
        }}
      />

      {/* Corpo da vela (cera marfim) */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: size * 0.58,
          width: size * 0.4,
          height: size * 1.2,
          background:
            'linear-gradient(to right, oklch(0.7 0.05 70) 0%, oklch(0.88 0.05 75) 30%, oklch(0.92 0.04 80) 50%, oklch(0.85 0.05 75) 70%, oklch(0.65 0.05 70) 100%)',
          borderRadius: '4px 4px 6px 6px',
          boxShadow:
            'inset 0 -8px 16px oklch(0.5 0.08 60 / 0.4), 0 0 20px oklch(0.6 0.1 55 / 0.3)',
        }}
      >
        {/* Gotejamento de cera */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            width: '15%',
            height: '25%',
            background:
              'linear-gradient(to bottom, oklch(0.85 0.05 75), oklch(0.75 0.06 70))',
            borderRadius: '50% 50% 50% 50% / 20% 20% 80% 80%',
          }}
        />
      </div>
    </div>
  )
}
