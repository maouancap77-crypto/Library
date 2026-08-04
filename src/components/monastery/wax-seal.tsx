'use client'

import { motion } from 'framer-motion'

interface WaxSealProps {
  /** Número ou texto curto exibido no centro do selo. */
  value: number | string
  /** Rótulo abaixo do selo. */
  label: string
  /** Cor do lacre: vermelho (default), dourado, verde, vinho. */
  variant?: 'crimson' | 'gold' | 'moss' | 'wine'
  /** Ícone central opcional (quando value não é numérico). */
  icon?: React.ReactNode
  delay?: number
}

const VARIANTS: Record<
  NonNullable<WaxSealProps['variant']>,
  { base: string; highlight: string; shadow: string; ring: string }
> = {
  crimson: {
    base: 'oklch(0.5 0.18 25)',
    highlight: 'oklch(0.62 0.16 30)',
    shadow: 'oklch(0.28 0.14 22)',
    ring: 'oklch(0.4 0.16 24)',
  },
  gold: {
    base: 'oklch(0.68 0.13 75)',
    highlight: 'oklch(0.82 0.14 80)',
    shadow: 'oklch(0.45 0.1 65)',
    ring: 'oklch(0.55 0.11 70)',
  },
  moss: {
    base: 'oklch(0.45 0.08 130)',
    highlight: 'oklch(0.58 0.1 135)',
    shadow: 'oklch(0.25 0.05 130)',
    ring: 'oklch(0.35 0.06 130)',
  },
  wine: {
    base: 'oklch(0.4 0.12 340)',
    highlight: 'oklch(0.52 0.14 345)',
    shadow: 'oklch(0.22 0.08 340)',
    ring: 'oklch(0.32 0.1 340)',
  },
}

/**
 * Selo de cera circular com efeito de lacre estampado e pulso sutil.
 * Usado para exibir estatísticas-chave da biblioteca.
 */
export function WaxSeal({
  value,
  label,
  variant = 'crimson',
  icon,
  delay = 0,
}: WaxSealProps) {
  const v = VARIANTS[variant]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', stiffness: 180, damping: 14 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative">
        {/* Halo de brilho */}
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, ${v.base} 0%, transparent 70%)`,
            opacity: 0.4,
            transform: 'scale(1.3)',
          }}
        />
        {/* Selo principal */}
        <div
          className="animate-wax-pulse relative flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${v.highlight} 0%, ${v.base} 45%, ${v.shadow} 100%)`,
            boxShadow: `
              inset 0 3px 6px ${v.highlight},
              inset 0 -4px 8px ${v.shadow},
              0 4px 12px oklch(0.05 0 0 / 0.6)
            `,
          }}
        >
          {/* Borda estampada interna */}
          <div
            className="absolute inset-1.5 rounded-full border-2 border-dashed"
            style={{ borderColor: `${v.ring}66` }}
          />
          {/* Conteúdo */}
          <div className="relative flex flex-col items-center">
            {icon ? (
              <span className="text-parchment">{icon}</span>
            ) : (
              <span
                className="font-display text-2xl font-bold leading-none text-parchment md:text-3xl"
                style={{ textShadow: '0 1px 2px oklch(0.1 0 0 / 0.5)' }}
              >
                {value}
              </span>
            )}
          </div>
          {/* Reflexo de luz */}
          <div
            className="absolute left-2 top-2 h-4 w-4 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle, oklch(0.95 0.02 80), transparent 70%)',
            }}
          />
        </div>
      </div>
      <span className="text-center font-display text-[0.7rem] uppercase tracking-[0.15em] text-gold md:text-xs">
        {label}
      </span>
    </motion.div>
  )
}
