'use client'

import { motion, HTMLMotionProps } from 'framer-motion'

interface ParchmentCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  /** Aplica animação de "desenrolar" ao montar. */
  unfurl?: boolean
}

/**
 * Cartão de pergaminho envelhecido com textura, sombra interna e
 * manchas sutis. Usado como base para painéis de conteúdo.
 */
export function ParchmentCard({
  children,
  className = '',
  unfurl = true,
  ...rest
}: ParchmentCardProps) {
  return (
    <motion.div
      initial={unfurl ? { opacity: 0, y: 20, scaleY: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`parchment relative rounded-[var(--radius)] p-5 md:p-7 ${className}`}
      {...rest}
    >
      {/* Cantos decorativos esfarrapados */}
      <span className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 rounded-full bg-[var(--parchment-dark)] opacity-50 blur-[1px]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--parchment-dark)] opacity-50 blur-[1px]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-[var(--parchment-dark)] opacity-50 blur-[1px]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[var(--parchment-dark)] opacity-50 blur-[1px]" />
      {children}
    </motion.div>
  )
}
