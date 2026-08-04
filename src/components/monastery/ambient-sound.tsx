'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Music, Music2 } from 'lucide-react'

/**
 * Trilha sonora ambient "bardcore" gerada proceduralmente via Web Audio API.
 * Sem arquivos externos — tudo sintetizado em tempo real:
 *  - Drone grave de organum (notas D2 + A2, quintas justas, com leve detuning)
 *  - Arpejos lentos de "harpa" (osciladores triangulares com envelope)
 *  - Sino de mosteiro ocasional (síntese FM com harmônicos)
 *  - Sopro de vento (ruído branco filtrado + LFO)
 *
 * O áudio só inicia após interação do usuário (política de autoplay dos browsers).
 */
export function AmbientSound() {
  const [playing, setPlaying] = useState(false)
  const [starting, setStarting] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<AudioNode[]>([])

  const stopAll = useCallback(() => {
    const ctx = ctxRef.current
    if (ctx && masterGainRef.current) {
      // Fade out suave para evitar click.
      const t = ctx.currentTime
      masterGainRef.current.gain.cancelScheduledValues(t)
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, t)
      masterGainRef.current.gain.linearRampToValueAtTime(0, t + 0.6)
      window.setTimeout(() => {
        nodesRef.current.forEach((n) => {
          try {
            n.stop?.()
            n.disconnect()
          } catch {
            /* noop */
          }
        })
        nodesRef.current = []
        ctx.close().catch(() => {})
        ctxRef.current = null
        masterGainRef.current = null
      }, 700)
    }
  }, [])

  const start = useCallback(async () => {
    if (starting || playing) return
    setStarting(true)
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      const ctx = new AudioCtx()
      ctxRef.current = ctx

      // Master gain com fade in.
      const master = ctx.createGain()
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2)
      master.connect(ctx.destination)
      masterGainRef.current = master

      const created: AudioNode[] = []
      const track = (n: AudioNode) => {
        created.push(n)
        return n
      }

      // ===== 1. Drone de organum (D2 + A2) =====
      const droneGain = track(ctx.createGain())
      droneGain.gain.value = 0.12
      droneGain.connect(master)

      const droneFilter = track(ctx.createBiquadFilter())
      droneFilter.type = 'lowpass'
      droneFilter.frequency.value = 400
      droneFilter.Q.value = 1
      droneFilter.connect(droneGain)

      ;[73.42, 110.0, 146.83].forEach((freq, i) => {
        const osc = track(ctx.createOscillator())
        osc.type = 'sine'
        osc.frequency.value = freq
        // Detune leve para batimentos orgânicos.
        osc.detune.value = i === 0 ? -4 : i === 1 ? 3 : 0
        const g = track(ctx.createGain())
        g.gain.value = i === 2 ? 0.6 : 1
        osc.connect(g)
        g.connect(droneFilter)
        osc.start()
      })

      // ===== 2. Sopro de vento (ruído branco filtrado + LFO) =====
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = track(ctx.createBufferSource())
      noise.buffer = noiseBuffer
      noise.loop = true

      const noiseFilter = track(ctx.createBiquadFilter())
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 500
      noiseFilter.Q.value = 0.6

      const noiseGain = track(ctx.createGain())
      noiseGain.gain.value = 0.04

      // LFO que modula o filtro do vento (rajadas).
      const windLfo = track(ctx.createOscillator())
      windLfo.frequency.value = 0.08
      const windLfoGain = track(ctx.createGain())
      windLfoGain.gain.value = 280
      windLfo.connect(windLfoGain)
      windLfoGain.connect(noiseFilter.frequency)

      // LFO de amplitude (oscila o volume do vento).
      const windAmpLfo = track(ctx.createOscillator())
      windAmpLfo.frequency.value = 0.05
      const windAmpLfoGain = track(ctx.createGain())
      windAmpLfoGain.gain.value = 0.03
      windAmpLfo.connect(windAmpLfoGain)
      windAmpLfoGain.connect(noiseGain.gain)

      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(master)
      noise.start()
      windLfo.start()
      windAmpLfo.start()

      // ===== 3. Arpejos de harpa (escalas modais) =====
      // Escala dórica em Ré: D, E, F, G, A, B, C, D
      const scale = [293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33]
      const harpGain = track(ctx.createGain())
      harpGain.gain.value = 0.5
      const harpDelay = track(ctx.createDelay())
      harpDelay.delayTime.value = 0.38
      const harpFeedback = track(ctx.createGain())
      harpFeedback.gain.value = 0.35
      harpGain.connect(master)
      harpGain.connect(harpDelay)
      harpDelay.connect(harpFeedback)
      harpFeedback.connect(harpDelay)
      harpDelay.connect(master)

      const playHarpNote = () => {
        if (!ctxRef.current) return
        const c = ctxRef.current
        const freq = scale[Math.floor(Math.random() * scale.length)]
        const osc = c.createOscillator()
        osc.type = 'triangle'
        osc.frequency.value = freq
        const g = c.createGain()
        const now = c.currentTime
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(0.18, now + 0.01)
        g.gain.exponentialRampToValueAtTime(0.001, now + 2.5)
        osc.connect(g)
        g.connect(harpGain)
        osc.start(now)
        osc.stop(now + 2.6)
      }

      // Agenda arpejos em intervalos irregulares.
      let harpTimer: ReturnType<typeof setTimeout> | null = null
      const scheduleHarp = () => {
        playHarpNote()
        const next = 1800 + Math.random() * 2600
        harpTimer = setTimeout(scheduleHarp, next)
      }
      harpTimer = setTimeout(scheduleHarp, 1500)

      // ===== 4. Sino de mosteiro (ocasional, síntese FM) =====
      const playBell = () => {
        if (!ctxRef.current) return
        const c = ctxRef.current
        const carrier = c.createOscillator()
        carrier.type = 'sine'
        carrier.frequency.value = 220 + Math.random() * 40
        const modulator = c.createOscillator()
        modulator.type = 'sine'
        modulator.frequency.value = carrier.frequency.value * 2.76
        const modGain = c.createGain()
        modGain.gain.value = 120
        const g = c.createGain()
        const now = c.currentTime
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(0.12, now + 0.005)
        g.gain.exponentialRampToValueAtTime(0.001, now + 4)
        modulator.connect(modGain)
        modGain.connect(carrier.frequency)
        carrier.connect(g)
        g.connect(master)
        carrier.start(now)
        modulator.start(now)
        carrier.stop(now + 4.1)
        modulator.stop(now + 4.1)
      }

      let bellTimer: ReturnType<typeof setTimeout> | null = null
      const scheduleBell = () => {
        playBell()
        const next = 18000 + Math.random() * 22000
        bellTimer = setTimeout(scheduleBell, next)
      }
      bellTimer = setTimeout(scheduleBell, 8000)

      nodesRef.current = created
      // Guarda os timers para limpeza.
      nodesRef.current.push({
        stop: () => {
          if (harpTimer) clearTimeout(harpTimer)
          if (bellTimer) clearTimeout(bellTimer)
        },
        disconnect: () => {},
      } as unknown as AudioNode)

      setPlaying(true)
    } catch (e) {
      console.error('[AmbientSound] falha ao iniciar:', e)
    } finally {
      setStarting(false)
    }
  }, [playing, starting])

  const toggle = useCallback(() => {
    if (playing) {
      stopAll()
      setPlaying(false)
    } else {
      void start()
    }
  }, [playing, start, stopAll])

  // Limpeza ao desmontar.
  useEffect(() => {
    return () => {
      stopAll()
    }
  }, [stopAll])

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={starting}
      aria-pressed={playing}
      aria-label={playing ? 'Silenciar a música do mosteiro' : 'Tocar música do mosteiro'}
      title={playing ? 'Silenciar' : 'Música ambient'}
      className="group fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-[var(--background)]/80 text-gold backdrop-blur-sm transition-all hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_20px_oklch(0.7_0.13_75/0.4)] disabled:opacity-50 md:bottom-6 md:right-6"
    >
      {playing ? (
        <Music2 className="h-5 w-5 animate-gold-shimmer" />
      ) : (
        <Music className="h-5 w-5" />
      )}
      {/* Anel pulsante quando tocando */}
      {playing && (
        <span
          className="absolute inset-0 rounded-full border border-gold/50"
          style={{ animation: 'wax-pulse 3s ease-in-out infinite' }}
        />
      )}
    </button>
  )
}
