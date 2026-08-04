// Paleta de lombadas medievais: tons de couro, joia e cera.
const SPINE_COLORS = [
  'oklch(0.4 0.14 25)', // carmesim
  'oklch(0.42 0.1 130)', // verde-musgo
  'oklch(0.4 0.12 340)', // vinho
  'oklch(0.38 0.1 55)', // couro
  'oklch(0.45 0.13 75)', // dourado-escuro
  'oklch(0.35 0.12 20)', // bordô
  'oklch(0.4 0.09 160)', // esmeralda escuro
  'oklch(0.38 0.11 300)', // ameixa
  'oklch(0.32 0.08 200)', // azul-petróleo escuro (único tom azulado permitido, sutil)
  'oklch(0.42 0.14 10)', // terracota
]

/** Hash determinístico do id → cor de lombada (estável entre re-renders). */
export function spineColorFor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return SPINE_COLORS[hash % SPINE_COLORS.length]
}

/** Tom mais escuro da mesma cor (para bordas/sombra da lombada). */
export function spineShadowFor(id: string): string {
  const base = spineColorFor(id)
  // Extrai L C H e escurece.
  const m = base.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
  if (!m) return base
  const l = Math.max(0.12, parseFloat(m[1]) - 0.18)
  return `oklch(${l} ${m[2]} ${m[3]})`
}

/** Tom mais claro (para realce/topo da lombada). */
export function spineHighlightFor(id: string): string {
  const base = spineColorFor(id)
  const m = base.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
  if (!m) return base
  const l = Math.min(0.75, parseFloat(m[1]) + 0.12)
  return `oklch(${l} ${m[2]} ${m[3]})`
}

/** Rotação leve pseudo-aleatória e estável por id (para empilhamento natural). */
export function spineTiltFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return ((hash % 700) / 100 - 3.5) // -3.5° a +3.5°
}

/** Altura visual da lombada na estante (varia por livro para parecer realista). */
export function spineHeightFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return 104 + (hash % 26) // 104px a 129px
}

/** Largura da lombada na estante (varia para parecer encadernações diferentes). */
export function spineWidthFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return 30 + (hash % 14) // 30px a 43px
}
