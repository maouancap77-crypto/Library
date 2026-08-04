'use client'

import { useMemo } from 'react'

interface DustParticlesProps {
  count?: number
  className?: string
}

/**
 * Partículas de poeira dourada flutuando lentamente para cima,
 * evocando o ar de uma biblioteca monástica iluminada por velas.
 */
export function DustParticles({ count = 28, className = '' }: DustParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 1 + Math.random() * 3
        const left = Math.random() * 100
        const duration = 18 + Math.random() * 22
        const delay = Math.random() * -duration
        const drift = (Math.random() - 0.5) * 120
        const opacity = 0.2 + Math.random() * 0.4
        return { id: i, size, left, duration, delay, drift, opacity }
      }),
    [count],
  )

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, oklch(0.85 0.12 75 / ${p.opacity}), oklch(0.6 0.1 60 / 0))`,
              animation: `dust-rise ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              ['--drift' as string]: `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
