import { format, formatDistanceToNow, differenceInDays, isSameMonth, isSameYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const MONTHS_LONG = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

/** Formata data completa: "15 de Março de 2024". */
export function formatFullDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return `${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`
}

/** Formata data curta: "15/03/2024". */
export function formatShortDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

/** Rótulo de mês/ano agrupador: "Março de 2024". */
export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return `${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`
}

/** Tempo relativo: "há 3 dias". */
export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  try {
    return formatDistanceToNow(d, { addSuffix: true, locale: ptBR })
  } catch {
    return '—'
  }
}

/** Duração entre duas datas em dias: "12 dias". */
export function readingDuration(
  startedAt: Date | string | null | undefined,
  finishedAt: Date | string | null | undefined,
): string {
  if (!startedAt || !finishedAt) return '—'
  const s = typeof startedAt === 'string' ? new Date(startedAt) : startedAt
  const f = typeof finishedAt === 'string' ? new Date(finishedAt) : finishedAt
  if (isNaN(s.getTime()) || isNaN(f.getTime())) return '—'
  const days = differenceInDays(f, s)
  if (days <= 0) return 'mesmo dia'
  if (days === 1) return '1 dia'
  return `${days} dias`
}

/** Ano extraído de uma data. */
export function yearOf(date: Date | string | null | undefined): number | null {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return null
  return d.getFullYear()
}

export { isSameMonth, isSameYear, format }
export { MONTHS_SHORT }
