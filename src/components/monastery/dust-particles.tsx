'use client'

import { useSyncExternalStore } from 'react'

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
 * Usa `useSyncExternalStore` para que as partículas (que dependem de
 * Math.random()) só sejam geradas no cliente, evitando divergência entre
 * o HTML renderizado no servidor e o do navegador (hydration mismatch).
 * No SSR, retorna uma lista vazia; após a hidratação, retorna as partículas.
 */
const emptySubscribe = () => () => {}

export function DustParticles({ count = 28, className = '' }: DustParticlesProps) {
  const particles = useSyncExternalStore(
    emptySubscribe,
    () => generateParticles(count), // snapshot do cliente
    () => EMPTY_PARTICLES, // snapshot do servidor
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

const EMPTY_PARTICLES: Particle[] = []

// Cache por contagem para evitar regenerar a cada render.
const cache = new Map<number, Particle[]>()

function generateParticles(count: number): Particle[] {
  const cached = cache.get(count)
  if (cached) return cached
  const list = Array.from({ length: count }).map((_, i) => {
    const duration = 18 + Math.random() * 22
    return {
      id: i,
      size: 1 + Math.random() * 3,
      left: Math.random() * 100,
      duration,
      delay: Math.random() * -duration,
      drift: (Math.random() - 0.5) * 120,
      opacity: 0.2 + Math.random() * 0.4,
    }
  })
  cache.set(count, list)
  return list
}
