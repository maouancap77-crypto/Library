'use client'

import { useClientOnly } from '@/hooks/use-client-only'

interface Star {
  id: number
  top: number
  left: number
  size: number
  delay: number
  duration: number
}

/**
 * Cena 3D do mosteiro ao fundo: composta por camadas em perspectiva
 * (céu noturno, janelas arqueadas com luz, pilares, teto de vigas,
 * chão de pedra) mais efeitos atmosféricos (god rays, incenso, sino,
 * pássaros, nuvens diante da lua).
 *
 * Tudo é CSS 3D (transforms + gradientes), sem dependências de WebGL.
 * O conteúdo da aplicação é renderizado por cima com z-index maior.
 */
export function MonasteryScene() {
  // Estrelas geradas apenas no cliente (Math.random()) para evitar mismatch
  // de hidratação. No SSR, lista vazia.
  const stars = useClientOnly<Star[]>(
    'monastery-stars',
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        top: 5 + Math.random() * 35,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
      })),
    [],
  )

  return (
    <div
      aria-hidden="true"
      className="monastery-scene pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* ===== Camada de fundo: céu noturno visto pelas janelas ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-400px) scale(1.4)' }}
      >
        <NightSky stars={stars} />
      </div>

      {/* ===== Camada das janelas arqueadas ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-250px) scale(1.15)' }}
      >
        <ArchedWindows />
      </div>

      {/* ===== God rays (luz volumétrica) saindo das janelas ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-200px) scale(1.1)' }}
      >
        <GodRays />
      </div>

      {/* ===== Pilares laterais ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-120px)' }}
      >
        <Pillars />
      </div>

      {/* ===== Campanário com sino (canto superior) ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-80px)' }}
      >
        <BellTower />
      </div>

      {/* ===== Teto de vigas (perspectiva de baixo para cima) ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-60px)' }}
      >
        <Ceiling />
      </div>

      {/* ===== Chão de pedra (perspectiva de cima para baixo) ===== */}
      <div
        className="monastery-layer"
        style={{ transform: 'translateZ(-30px)' }}
      >
        <Floor />
      </div>

      {/* ===== Incensário pendurado com fumaça ===== */}
      <IncenseBurner />

      {/* ===== Pássaros atravessando ocasionalmente ===== */}
      <Birds />

      {/* ===== Vinheta global para atmosfera (sutil, não escurece demais) ===== */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 40%, transparent 0%, oklch(0.05 0 0 / 0.25) 65%, oklch(0.03 0 0 / 0.5) 100%)',
        }}
      />
    </div>
  )
}

/* ===================== Sub-cenas ===================== */

function NightSky({ stars }: { stars: { id: number; top: number; left: number; size: number; delay: number; duration: number }[] }) {
  return (
    <div className="absolute inset-0">
      {/* Céu noturno com gradiente profundo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.12 0.04 260) 0%, oklch(0.1 0.03 240) 40%, oklch(0.08 0.02 220) 100%)',
        }}
      />
      {/* Lua */}
      <div
        className="absolute"
        style={{
          top: '8%',
          right: '8%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 35%, oklch(0.97 0.05 80), oklch(0.88 0.09 75) 55%, oklch(0.72 0.12 70) 100%)',
          boxShadow:
            '0 0 50px oklch(0.85 0.12 75 / 0.7), 0 0 100px oklch(0.75 0.14 70 / 0.5), 0 0 160px oklch(0.65 0.12 65 / 0.3)',
        }}
      />
      {/* Halo da lua */}
      <div
        className="absolute"
        style={{
          top: '3%',
          right: '2%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, oklch(0.82 0.12 75 / 0.25), transparent 70%)',
        }}
      />
      {/* Estrelas */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: 0.5,
            animation: `star-twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            boxShadow: '0 0 4px oklch(0.9 0.05 80 / 0.8)',
          }}
        />
      ))}
      {/* Nuvem passando diante da lua */}
      <div
        className="animate-cloud-drift absolute"
        style={{
          top: '14%',
          width: '40%',
          height: 50,
          background:
            'radial-gradient(ellipse, oklch(0.2 0.04 260 / 0.6) 0%, oklch(0.2 0.04 260 / 0.3) 40%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

function ArchedWindows() {
  // Três janelas arqueadas centralizadas.
  return (
    <div className="absolute inset-0 flex items-start justify-center gap-[6%] pt-[8%]">
      {[0, 1, 2].map((i) => (
        <Window key={i} delay={i * 1.5} />
      ))}
    </div>
  )
}

function Window({ delay }: { delay: number }) {
  return (
    <div
      className="relative"
      style={{
        width: 'min(18%, 220px)',
        height: 'min(42vh, 380px)',
      }}
    >
      {/* Moldura de pedra (arco) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.2 0.03 40) 0%, oklch(0.16 0.025 35) 100%)',
          borderRadius: '50% 50% 0 0 / 22% 22% 0 0',
          boxShadow:
            'inset 0 0 30px oklch(0.05 0 0 / 0.8), 0 0 20px oklch(0.05 0 0 / 0.5)',
        }}
      >
        {/* Recorte da janela (vidro) */}
        <div
          className="animate-window-glow absolute inset-[6px]"
          style={{
            top: '12%',
            background:
              'linear-gradient(to bottom, oklch(0.55 0.14 75 / 0.92) 0%, oklch(0.42 0.11 65 / 0.95) 50%, oklch(0.25 0.08 45 / 0.98) 100%)',
            borderRadius: '50% 50% 0 0 / 22% 22% 0 0',
            animationDelay: `${delay}s`,
            boxShadow:
              'inset 0 0 50px oklch(0.7 0.14 68 / 0.6), 0 0 30px oklch(0.6 0.12 65 / 0.4)',
          }}
        >
          {/* Vitral: bordas em chumbo (escuras) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent 0px, transparent 24px, oklch(0.1 0.02 30 / 0.6) 25px, oklch(0.1 0.02 30 / 0.6) 26px), repeating-linear-gradient(-45deg, transparent 0px, transparent 24px, oklch(0.1 0.02 30 / 0.6) 25px, oklch(0.1 0.02 30 / 0.6) 26px)',
              borderRadius: 'inherit',
              opacity: 0.5,
            }}
          />
          {/* Cruz central do vitral */}
          <div
            className="absolute left-1/2 top-1/2 h-[2px] w-[80%] -translate-x-1/2 -translate-y-1/2 bg-[oklch(0.1_0.02_30/0.7)]"
          />
          <div
            className="absolute left-1/2 top-1/2 h-[80%] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-[oklch(0.1_0.02_30/0.7)]"
          />
        </div>
      </div>
    </div>
  )
}

function GodRays() {
  // Raios de luz diagonal saindo de cada janela em direção ao chão.
  return (
    <div className="absolute inset-0 flex items-start justify-center gap-[6%] pt-[10%]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-god-ray relative"
          style={{
            width: 'min(16%, 200px)',
            height: 'min(75vh, 640px)',
            background:
              'linear-gradient(to bottom, oklch(0.78 0.14 72 / 0.6) 0%, oklch(0.68 0.12 67 / 0.35) 40%, oklch(0.55 0.1 62 / 0.1) 80%, transparent 100%)',
            transform: 'skewX(-12deg)',
            transformOrigin: 'top center',
            filter: 'blur(8px)',
            animationDelay: `${i * 1.2}s`,
            borderRadius: '40% 40% 50% 50% / 20% 20% 80% 80%',
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  )
}

function Pillars() {
  return (
    <>
      <div
        className="stone-pillar absolute"
        style={{
          left: 0,
          top: 0,
          bottom: 0,
          width: '8%',
          transform: 'translateZ(20px)',
        }}
      />
      <div
        className="stone-pillar absolute"
        style={{
          right: 0,
          top: 0,
          bottom: 0,
          width: '8%',
          transform: 'translateZ(20px)',
        }}
      />
      {/* Bases dos pilares (capiteis) */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '10%',
          height: 30,
          background:
            'linear-gradient(to bottom, oklch(0.28 0.03 45), oklch(0.18 0.025 38))',
          boxShadow: '0 4px 8px oklch(0.05 0 0 / 0.6)',
        }}
      />
      <div
        className="absolute"
        style={{
          right: 0,
          top: 0,
          width: '10%',
          height: 30,
          background:
            'linear-gradient(to bottom, oklch(0.28 0.03 45), oklch(0.18 0.025 38))',
          boxShadow: '0 4px 8px oklch(0.05 0 0 / 0.6)',
        }}
      />
    </>
  )
}

function Ceiling() {
  return (
    <div
      className="wooden-ceiling absolute"
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: '22%',
        transform: 'perspective(600px) rotateX(-30deg)',
        transformOrigin: 'bottom center',
        boxShadow: 'inset 0 -10px 30px oklch(0.05 0 0 / 0.7)',
      }}
    >
      {/* Viga central destacada */}
      <div
        className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to right, oklch(0.1 0.02 30), oklch(0.22 0.03 40), oklch(0.1 0.02 30))',
          boxShadow: '0 0 12px oklch(0.05 0 0 / 0.8)',
        }}
      />
    </div>
  )
}

function Floor() {
  return (
    <div
      className="stone-floor absolute"
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        height: '32%',
        transform: 'perspective(600px) rotateX(35deg)',
        transformOrigin: 'top center',
        opacity: 0.85,
      }}
    />
  )
}

function BellTower() {
  return (
    <div
      className="absolute"
      style={{
        top: '1%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Estrutura do campanário */}
      <div
        style={{
          width: 90,
          height: 50,
          background:
            'linear-gradient(to bottom, oklch(0.14 0.02 32), oklch(0.1 0.015 30))',
          border: '2px solid oklch(0.08 0.01 28)',
          borderRadius: '4px 4px 0 0',
          boxShadow: 'inset 0 0 15px oklch(0.05 0 0 / 0.7)',
          position: 'relative',
        }}
      >
        {/* Sino */}
        <div
          className="animate-bell-sway"
          style={{
            position: 'absolute',
            top: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'top center',
          }}
        >
          {/* Corda */}
          <div
            style={{
              width: 1,
              height: 8,
              background: 'oklch(0.4 0.05 55)',
              margin: '0 auto',
            }}
          />
          {/* Corpo do sino */}
          <div
            style={{
              width: 22,
              height: 26,
              background:
                'linear-gradient(to bottom, oklch(0.6 0.1 70), oklch(0.4 0.08 60), oklch(0.3 0.06 50))',
              borderRadius: '50% 50% 20% 20% / 40% 40% 60% 60%',
              boxShadow:
                'inset 2px 0 4px oklch(0.7 0.1 75 / 0.5), inset -2px 0 4px oklch(0.2 0.05 40 / 0.6), 0 0 8px oklch(0.5 0.1 65 / 0.3)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

interface SmokeParticle {
  id: number
  delay: number
  drift: number
  duration: number
}

function IncenseBurner() {
  const smoke = useClientOnly<SmokeParticle[]>(
    'monastery-smoke',
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        delay: i * 1.4,
        drift: (Math.random() - 0.5) * 60,
        duration: 6 + Math.random() * 3,
      })),
    [],
  )

  return (
    <div
      className="absolute"
      style={{
        bottom: '8%',
        left: '14%',
        transform: 'translateZ(-40px)',
      }}
    >
      {/* Corda de suspensão */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          width: 1,
          height: 120,
          background: 'oklch(0.3 0.04 40 / 0.5)',
        }}
      />
      {/* Incensário (recipiente de metal) */}
      <div
        style={{
          position: 'relative',
          width: 28,
          height: 24,
          background:
            'linear-gradient(to bottom, oklch(0.5 0.1 70) 0%, oklch(0.35 0.08 55) 50%, oklch(0.2 0.05 40) 100%)',
          borderRadius: '40% 40% 50% 50% / 20% 20% 60% 60%',
          boxShadow:
            'inset 2px 0 4px oklch(0.6 0.1 75 / 0.4), 0 0 12px oklch(0.5 0.12 60 / 0.4)',
        }}
      >
        {/* Brasa brilhante dentro */}
        <div
          className="animate-candle-flicker"
          style={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 4,
            background:
              'radial-gradient(ellipse, oklch(0.8 0.18 35), oklch(0.5 0.15 25))',
            borderRadius: '50%',
            boxShadow: '0 0 8px oklch(0.7 0.15 30 / 0.8)',
          }}
        />
        {/* Fumaça subindo */}
        {smoke.map((s) => (
          <span
            key={s.id}
            className="absolute left-1/2 top-0"
            style={
              {
                width: 14,
                height: 14,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, oklch(0.7 0.05 70 / 0.4), transparent 70%)',
                filter: 'blur(4px)',
                animation: `smoke-rise ${s.duration}s ease-out infinite`,
                animationDelay: `${s.delay}s`,
                ['--smoke-drift' as string]: `${s.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

function Birds() {
  return (
    <>
      <div
        className="animate-bird-fly absolute"
        style={{ top: '20%', left: 0 }}
      >
        <BirdShape />
      </div>
      <div
        className="animate-bird-fly absolute"
        style={{ top: '28%', left: 0, animationDelay: '12s' }}
      >
        <BirdShape small />
      </div>
    </>
  )
}

function BirdShape({ small = false }: { small?: boolean }) {
  const scale = small ? 0.5 : 1
  return (
    <svg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      fill="none"
      style={{ transform: `scale(${scale})`, opacity: 0.7 }}
    >
      <path
        d="M1 8 Q6 2 11 8 Q12 9 13 8 Q18 2 23 8"
        stroke="oklch(0.1 0.02 30)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
