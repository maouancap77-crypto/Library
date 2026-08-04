'use client'

import { useEffect, useState } from 'react'

interface DustParticlesProps {
  count?: number
  className?: string
}

interface Particle {
  id: number
  size: number
  left: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

/**
 * Partículas de poeira dourada flutuando lentamente para cima,
 * evocando o ar de uma biblioteca monástica iluminada por velas.
 *
 * As partículas são geradas apenas no cliente (após a montagem) para evitar
 * divergência entre o HTML renderizado no servidor e o do navegador, já que
 * os valores usam Math.random().
 */
export function DustParticles({ count = 28, className = '' }: DustParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: count }).map((_, i) => {
        const size = 1 + Math.random() * 3
        const duration = 18 + Math.random() * 22
        return {
          id: i,
          size,
          left: Math.random() * 100,
          duration,
          delay: Math.random() * -duration,
          drift: (Math.random() - 0.5) * 120,
          opacity: 0.2 + Math.random() * 0.4,
        }
      }),
    )
  }, [count])

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
