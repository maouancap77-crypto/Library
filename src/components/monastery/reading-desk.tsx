'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Feather } from 'lucide-react'
import {
  spineColorFor,
  spineHighlightFor,
  spineShadowFor,
  spineTiltFor,
} from '@/lib/book-colors'
import { useClientOnly } from '@/hooks/use-client-only'
import { formatFullDate, readingDuration } from '@/lib/dates'
import type { Book } from '@/hooks/use-library'

interface ReadingDeskProps {
  books: Book[]
  onSelect?: (id: string) => void
}

const PILE_BOOK_THICKNESS = 20

/**
 * Mesa de leitor monástica aprimorada: um púlpito (lectern) sustenta o
 * tomo em leitura ATIVA, mostrado como um livro ABERTO com páginas em
 * pergaminho e caligrafia. Os demais tomos em leitura ficam empilhados
 * (fechados, com cantos de metal e fechos) ao lado. A mesa traz ainda
 * acessórios de scriptorium: vela, tinteiro com pena de ganso, ampulheta
 * e pergaminhos avulsos.
 */
export function ReadingDesk({ books, onSelect }: ReadingDeskProps) {
  // O tomo ativo (mais recentemente iniciado) fica aberto no púlpito.
  const lecternBook = books[0] ?? null
  const pileBooks = books.slice(1)
  const pileHeight = pileBooks.length * PILE_BOOK_THICKNESS

  return (
    <div className="reading-desk relative w-full select-none">
      {/* ===== Halo de luz quente sobre o púlpito ===== */}
      <div
        className="animate-lectern-glow pointer-events-none absolute left-1/2 top-0 z-0 h-64 w-72 -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.7 0.13 68 / 0.5) 0%, oklch(0.55 0.1 60 / 0.2) 40%, transparent 70%)',
        }}
      />

      {/* ===== Poeira dourada flutuando sobre a mesa ===== */}
      <DeskDust />

      {/* ===== Palco da mesa ===== */}
      <div className="relative z-10 mx-auto max-w-2xl px-2">
        {/* --- Púlpito com o livro aberto (hero) --- */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {lecternBook ? (
              <OpenBook key={lecternBook.id} book={lecternBook} onSelect={onSelect} />
            ) : (
              <EmptyOpenBook key="empty" />
            )}
          </AnimatePresence>

          {/* Suportes do púlpito (pernas anguladas) */}
          <LecternStand />
        </div>

        {/* --- Superfície da mesa com acessórios e pilha --- */}
        <div className="relative mt-4">
          {/* Runner de veludo sob os objetos */}
          <div
            className="absolute inset-x-2 top-2 bottom-0 rounded-sm"
            style={{
              background:
                'linear-gradient(to bottom, oklch(0.22 0.06 340 / 0.45), oklch(0.14 0.05 340 / 0.7))',
              boxShadow: 'inset 0 0 24px oklch(0.05 0 0 / 0.5)',
            }}
          />

          {/* Linha de acessórios + pilha (responsiva, bem espaçada) */}
          <div className="relative grid grid-cols-2 gap-y-6 px-6 pb-3 pt-10 sm:grid-cols-4 sm:gap-x-4 sm:px-10">
            <div className="flex items-end justify-center">
              <DeskCandle />
            </div>
            <div className="flex items-end justify-center">
              <PileOfBooks books={pileBooks} onSelect={onSelect} pileHeight={pileHeight} />
            </div>
            <div className="flex items-end justify-center">
              <InkwellWithQuill />
            </div>
            <div className="flex items-end justify-center">
              <Hourglass />
            </div>
          </div>
        </div>

        {/* --- Tampo da mesa (em perspectiva) --- */}
        <div className="desk-top relative z-20 h-5 w-full" />

        {/* --- Borda frontal 3D (espessura do tampo) --- */}
        <div
          className="relative z-10 mx-auto h-3 w-full"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.18 0.025 38), oklch(0.1 0.015 30))',
            boxShadow: '0 4px 10px oklch(0.05 0 0 / 0.6)',
          }}
        />

        {/* --- Sombra da mesa no chão --- */}
        <div
          className="mx-auto mt-1 h-3 w-[80%] rounded-[50%]"
          style={{
            background:
              'radial-gradient(ellipse, oklch(0.05 0 0 / 0.55) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  )
}

/* ===================== Livro aberto no púlpito ===================== */

function OpenBook({ book, onSelect }: { book: Book; onSelect?: (id: string) => void }) {
  const color = spineColorFor(book.id)
  const shadow = spineShadowFor(book.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, rotateX: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, rotateX: 15, scale: 0.9, transition: { duration: 0.4 } }}
      transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      className="relative mx-auto w-full max-w-sm"
    >
      <button
        type="button"
        onClick={() => onSelect?.(book.id)}
        title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}
        aria-label={`Tomo em leitura ativa: ${book.title}`}
        className="group relative block w-full cursor-pointer"
        style={{ perspective: '900px' }}
      >
        {/* Capa de trás visível atrás das páginas (cor do couro) */}
        <div
          className="absolute inset-x-2 -top-1 bottom-1 rounded-sm"
          style={{
            background: `linear-gradient(to bottom, ${shadow}, ${color})`,
            boxShadow: '0 8px 20px oklch(0.05 0 0 / 0.6)',
          }}
        />

        {/* O livro aberto em si: duas páginas + lombada central */}
        <div
          className="relative flex"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(1000px) rotateX(6deg)',
          }}
        >
          {/* ===== Página esquerda ===== */}
          <Page side="left">
            <PageLeftContent book={book} />
          </Page>

          {/* ===== Lombada central (gutter) ===== */}
          <div
            className="relative z-10 w-3 shrink-0"
            style={{
              background:
                'linear-gradient(to right, oklch(0.55 0.05 60 / 0.6), oklch(0.3 0.02 30) 40%, oklch(0.18 0.01 28) 50%, oklch(0.3 0.02 30) 60%, oklch(0.55 0.05 60 / 0.6))',
              boxShadow: 'inset 0 0 8px oklch(0.05 0 0 / 0.6)',
            }}
          />

          {/* ===== Página direita ===== */}
          <Page side="right">
            <PageRightContent book={book} />
          </Page>
        </div>

        {/* Borda dourada (gold leaf) nas páginas externas */}
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-sm"
          style={{ background: 'linear-gradient(to right, oklch(0.72 0.13 75), oklch(0.55 0.1 65))' }}
        />
        <div
          className="absolute right-0 top-0 h-full w-1 rounded-r-sm"
          style={{ background: 'linear-gradient(to left, oklch(0.72 0.13 75), oklch(0.55 0.1 65))' }}
        />

        {/* Fita marcadora pendendo do topo */}
        <div
          className="animate-ribbon-sway absolute -top-1 right-[28%] h-10 w-1.5 origin-top"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.5 0.18 25), oklch(0.4 0.16 22))',
            boxShadow: '0 2px 4px oklch(0.05 0 0 / 0.5)',
          }}
        />

        {/* Brilho de hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse at center, oklch(0.9 0.1 75 / 0.18), transparent 70%)',
          }}
        />
      </button>
    </motion.div>
  )
}

function Page({ side, children }: { side: 'left' | 'right'; children: React.ReactNode }) {
  return (
    <div
      className="relative flex-1 overflow-hidden p-3 sm:p-4"
      style={{
        minHeight: 150,
        background:
          'linear-gradient(to bottom, oklch(0.9 0.04 80), oklch(0.85 0.05 78) 50%, oklch(0.82 0.06 76))',
        boxShadow:
          side === 'left'
            ? 'inset -6px 0 12px oklch(0.4 0.05 55 / 0.35), inset 0 0 20px oklch(0.6 0.05 65 / 0.15)'
            : 'inset 6px 0 12px oklch(0.4 0.05 55 / 0.35), inset 0 0 20px oklch(0.6 0.05 65 / 0.15)',
        // Manchas de envelhecimento do pergaminho
        backgroundImage: `
          radial-gradient(ellipse at ${side === 'left' ? '20%' : '70%'} 30%, oklch(0.65 0.08 65 / 0.18), transparent 30%),
          radial-gradient(ellipse at ${side === 'left' ? '60%' : '25%'} 70%, oklch(0.6 0.09 60 / 0.15), transparent 35%),
          linear-gradient(to bottom, oklch(0.9 0.04 80), oklch(0.85 0.05 78) 50%, oklch(0.82 0.06 76))
        `,
      }}
    >
      {/* Linhas pautadas (como manuscrito) */}
      <div
        className="pointer-events-none absolute inset-x-2 top-8 bottom-6 opacity-30"
        style={{
          background:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 11px, oklch(0.4 0.1 340 / 0.25) 12px, transparent 13px)',
        }}
      />
      {/* Borda decorativa interna */}
      <div
        className="pointer-events-none absolute inset-1.5 rounded-sm border"
        style={{ borderColor: 'oklch(0.5 0.1 340 / 0.3)' }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

function PageLeftContent({ book }: { book: Book }) {
  const initial = (book.title[0] || 'I').toUpperCase()
  return (
    <div className="flex h-full flex-col">
      {/* Pequeno ornamento superior */}
      <div className="mb-2 text-center text-gold/60">✦ ❧ ✦</div>
      {/* Drop cap (capitular iluminada) + título */}
      <div className="flex items-start gap-2">
        <span
          className="float-left font-gothic text-4xl leading-[0.8] text-wax"
          style={{
            fontFamily: 'var(--font-gothic), serif',
            textShadow: '0 1px 2px oklch(0.3 0.05 30 / 0.4), 0 0 8px oklch(0.5 0.15 25 / 0.2)',
          }}
        >
          {initial}
        </span>
        <h3
          className="font-display text-base font-bold leading-tight text-[var(--ink)] sm:text-lg"
          style={{ fontFamily: 'var(--font-gothic), var(--font-display), serif' }}
        >
          {book.title.length > 22 ? book.title.slice(0, 20) + '…' : book.title}
        </h3>
      </div>
      {book.author && (
        <p className="mt-1 pl-1 font-body text-[0.7rem] italic text-[var(--ink)]/65">
          por {book.author}
        </p>
      )}
      {/* Linhas gregas de preenchimento (manuscrito) */}
      <div className="mt-auto space-y-1.5">
        <GreekLine width="85%" />
        <GreekLine width="70%" />
        <GreekLine width="78%" />
      </div>
    </div>
  )
}

function PageRightContent({ book }: { book: Book }) {
  // "Agora" gerado apenas no cliente para evitar mismatch de hidratação
  // (servidor e cliente poderiam computar dias diferentes em boundary de timezone).
  const now = useClientOnly('desk-now', () => new Date().toISOString(), book.startedAt)
  const days = readingDuration(book.startedAt, now)
  return (
    <div className="flex h-full flex-col items-center justify-between text-center">
      <div>
        <p className="font-body text-[0.6rem] uppercase tracking-widest text-[var(--ink)]/50">
          Iniciado em
        </p>
        <p className="mt-0.5 font-display text-[0.72rem] font-semibold text-[var(--ink)]">
          {formatFullDate(book.startedAt)}
        </p>
      </div>

      <div className="my-1">
        <div className="text-gold/50">✦</div>
        <p className="font-gothic text-xl text-wax" style={{ fontFamily: 'var(--font-gothic), serif' }}>
          {days === '—' ? '—' : days.replace(' dias', 'd').replace(' dia', 'd')}
        </p>
        <p className="font-body text-[0.6rem] uppercase tracking-wider text-[var(--ink)]/50">
          de leitura
        </p>
        <div className="text-gold/50">✦</div>
      </div>

      <div className="w-full space-y-1.5">
        <GreekLine width="60%" center />
        <GreekLine width="75%" center />
        <GreekLine width="50%" center />
      </div>

      {/* Pequeno selo de cera no canto */}
      <div
        className="mt-1 h-5 w-5 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, oklch(0.6 0.16 30), oklch(0.45 0.18 25) 60%, oklch(0.28 0.14 22))',
          boxShadow: 'inset 0 1px 2px oklch(0.7 0.15 30 / 0.5), 0 1px 2px oklch(0.05 0 0 / 0.4)',
        }}
      />
    </div>
  )
}

function GreekLine({ width, center }: { width: string; center?: boolean }) {
  return (
    <div
      className="h-1.5 rounded-full"
      style={{
        width,
        margin: center ? '0 auto' : undefined,
        background:
          'linear-gradient(to right, transparent, oklch(0.35 0.06 340 / 0.4) 15%, oklch(0.35 0.06 340 / 0.4) 85%, transparent)',
      }}
    />
  )
}

function EmptyOpenBook() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative mx-auto w-full max-w-sm"
    >
      <div
        className="relative flex"
        style={{ transform: 'perspective(1000px) rotateX(6deg)' }}
      >
        <Page side="left">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <BookOpen className="mb-2 h-7 w-7 text-[var(--ink)]/25" />
            <p
              className="font-gothic text-sm text-[var(--ink)]/40"
              style={{ fontFamily: 'var(--font-gothic), serif' }}
            >
              A mesa aguarda
            </p>
            <p className="mt-1 font-body text-[0.65rem] italic text-[var(--ink)]/35">
              um tomo aberto ao leitor
            </p>
          </div>
        </Page>
        <div
          className="relative z-10 w-3 shrink-0"
          style={{
            background:
              'linear-gradient(to right, oklch(0.55 0.05 60 / 0.6), oklch(0.18 0.01 28) 50%, oklch(0.55 0.05 60 / 0.6))',
          }}
        />
        <Page side="right">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Feather className="h-6 w-6 text-[var(--ink)]/25" />
            <div className="w-2/3 space-y-1.5">
              <GreekLine width="100%" center />
              <GreekLine width="80%" center />
              <GreekLine width="90%" center />
            </div>
          </div>
        </Page>
      </div>
    </motion.div>
  )
}

function LecternStand() {
  return (
    <div className="pointer-events-none relative mx-auto h-10 w-48">
      {/* Duas pernas anguladas do púlpito */}
      <div
        className="absolute left-1/2 top-0 h-10 w-2 origin-top"
        style={{
          background: 'linear-gradient(to right, oklch(0.16 0.02 32), oklch(0.28 0.03 42), oklch(0.16 0.02 32))',
          transform: 'translateX(-300%) rotate(12deg)',
          boxShadow: '0 2px 4px oklch(0.05 0 0 / 0.5)',
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-10 w-2 origin-top"
        style={{
          background: 'linear-gradient(to right, oklch(0.16 0.02 32), oklch(0.28 0.03 42), oklch(0.16 0.02 32))',
          transform: 'translateX(100%) rotate(-12deg)',
          boxShadow: '0 2px 4px oklch(0.05 0 0 / 0.5)',
        }}
      />
    </div>
  )
}

/* ===================== Pilha de tomos fechados ===================== */

function PileOfBooks({
  books,
  onSelect,
  pileHeight,
}: {
  books: Book[]
  onSelect?: (id: string) => void
  pileHeight: number
}) {
  if (books.length === 0) {
    return (
      <div className="flex h-[130px] min-w-[150px] flex-col items-center justify-end pb-2">
        <span className="font-body text-[0.6rem] italic text-parchment/30">
          pilha vazia
        </span>
      </div>
    )
  }
  return (
    <div
      className="relative flex h-[130px] min-w-[170px] items-end justify-center"
      style={{ height: Math.max(100, pileHeight + 30) }}
    >
      <AnimatePresence mode="popLayout">
        {books.map((b, i) => (
          <ClosedBook
            key={b.id}
            book={b}
            stackIndex={i}
            total={books.length}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ClosedBook({
  book,
  stackIndex,
  total,
  onSelect,
}: {
  book: Book
  stackIndex: number
  total: number
  onSelect?: (id: string) => void
}) {
  const color = spineColorFor(book.id)
  const highlight = spineHighlightFor(book.id)
  const shadow = spineShadowFor(book.id)
  const tilt = spineTiltFor(book.id)
  const fromBottom = stackIndex * PILE_BOOK_THICKNESS
  const width = 150 + (stackIndex % 3) * 12
  const isTop = stackIndex === total - 1
  const title = book.title.length > 22 ? book.title.slice(0, 20) + '…' : book.title

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect?.(book.id)}
      title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}
      aria-label={`Tomo na pilha: ${book.title}`}
      initial={{ opacity: 0, y: -140, rotateZ: tilt * 4, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotateZ: tilt, scale: 1 }}
      exit={{ opacity: 0, y: -90, rotateZ: tilt * 3, scale: 0.85, transition: { duration: 0.35 } }}
      transition={{ type: 'spring', stiffness: 190, damping: isTop ? 12 : 15, mass: 0.85 }}
      whileHover={{ y: -5, rotateZ: tilt + 1, filter: 'brightness(1.15)', transition: { duration: 0.2 } }}
      className="group absolute left-1/2 cursor-pointer"
      style={{
        bottom: fromBottom,
        width,
        height: PILE_BOOK_THICKNESS + 8,
        transform: `translateX(-50%) rotate(${tilt}deg)`,
        transformOrigin: 'center bottom',
      }}
    >
      {/* Corpo do tomo: lombada + capa + páginas */}
      <div
        className="relative flex h-full w-full overflow-hidden rounded-[2px]"
        style={{
          background: `linear-gradient(to right, ${shadow} 0%, ${color} 12%, ${highlight} 45%, ${color} 75%, oklch(0.85 0.04 75) 100%)`,
          boxShadow: `0 2px 5px oklch(0.05 0 0 / 0.6), inset 0 1px 0 oklch(0.9 0.05 75 / 0.3), inset 0 -2px 4px oklch(0.05 0 0 / 0.4)`,
        }}
      >
        {/* Lombada */}
        <div
          className="h-full w-3.5 shrink-0"
          style={{
            background: `linear-gradient(to right, ${color}, ${highlight})`,
            boxShadow: 'inset -1px 0 2px oklch(0.05 0 0 / 0.5)',
          }}
        />
        {/* Filete dourado */}
        <div className="absolute left-3.5 top-1 h-px w-2.5 bg-[oklch(0.7_0.12_75/0.6)]" />

        {/* Cantos de metal (cantoneiras) — superior esquerdo e inferior direito */}
        <div
          className="absolute left-0 top-0 h-2 w-2 rounded-bl-sm"
          style={{ background: 'linear-gradient(135deg, oklch(0.8 0.1 78), oklch(0.55 0.1 65))' }}
        />
        <div
          className="absolute bottom-0 right-3 h-2 w-2 rounded-tr-sm"
          style={{ background: 'linear-gradient(315deg, oklch(0.8 0.1 78), oklch(0.55 0.1 65))' }}
        />

        {/* Capa com título */}
        <div className="flex h-full min-w-0 flex-1 items-center px-1.5">
          <span
            className="line-clamp-1 font-display text-[0.62rem] font-semibold uppercase tracking-wide text-parchment/90"
            style={{ textShadow: '0 1px 1px oklch(0.05 0 0 / 0.6)' }}
          >
            {title}
          </span>
        </div>

        {/* Páginas */}
        <div
          className="h-full w-2.5 shrink-0"
          style={{
            background:
              'repeating-linear-gradient(to right, oklch(0.88 0.04 80) 0px, oklch(0.76 0.05 75) 1px, oklch(0.88 0.04 80) 2px)',
            boxShadow: 'inset 1px 0 2px oklch(0.05 0 0 / 0.3)',
          }}
        />
      </div>

      {/* Fita marcadora no tomo do topo da pilha */}
      {isTop && (
        <div
          className="animate-ribbon-sway absolute -top-1 right-5 h-4 w-1 origin-top"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.5 0.18 25), oklch(0.4 0.16 22))',
            boxShadow: '0 1px 2px oklch(0.05 0 0 / 0.4)',
          }}
        />
      )}

      {/* Brilho hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(to bottom, oklch(0.95 0.08 75 / 0.22), transparent 50%)',
        }}
      />
    </motion.button>
  )
}

/* ===================== Acessórios da mesa ===================== */

function DeskCandle() {
  return (
    <div className="relative flex h-[130px] w-20 flex-col items-center justify-end">
      {/* Pool de luz sobre a mesa */}
      <div
        className="animate-candle-pool pointer-events-none absolute -inset-6 bottom-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center bottom, oklch(0.72 0.15 65 / 0.5) 0%, oklch(0.5 0.1 55 / 0.18) 40%, transparent 70%)',
        }}
      />
      {/* Chama */}
      <div className="animate-candle-flicker relative z-10 -mb-1">
        <div
          style={{
            width: 12,
            height: 24,
            background:
              'radial-gradient(ellipse at 50% 70%, oklch(0.97 0.18 60) 0%, oklch(0.82 0.2 45) 38%, oklch(0.52 0.2 28) 72%, oklch(0.34 0.16 20) 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            boxShadow:
              '0 0 14px oklch(0.72 0.16 55 / 0.85), 0 0 28px oklch(0.6 0.12 50 / 0.55)',
          }}
        />
        {/* Núcleo brilhante */}
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2"
          style={{
            width: 4,
            height: 10,
            background:
              'radial-gradient(ellipse, oklch(0.98 0.05 80), oklch(0.9 0.1 65) 60%, transparent)',
            borderRadius: '50%',
          }}
        />
      </div>
      {/* Pavio */}
      <div className="z-10 h-1.5 w-px bg-[oklch(0.15_0.02_30)]" />
      {/* Corpo da vela (mais alto) */}
      <div
        className="z-10 h-14 w-4 rounded-b-sm"
        style={{
          background:
            'linear-gradient(to right, oklch(0.7 0.05 70) 0%, oklch(0.88 0.05 75) 35%, oklch(0.94 0.04 80) 50%, oklch(0.82 0.05 75) 70%, oklch(0.65 0.05 70) 100%)',
          boxShadow: '0 0 22px oklch(0.6 0.1 55 / 0.35)',
        }}
      >
        {/* Gotejamento de cera */}
        <div
          className="absolute left-1 top-0 h-4 w-1.5 rounded-b-full"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.88 0.05 75), oklch(0.78 0.06 70))',
          }}
        />
      </div>
      {/* Castiçal (base de latão) */}
      <div
        className="z-10 h-3 w-12 rounded-b-lg"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.65 0.09 72) 0%, oklch(0.45 0.07 60) 50%, oklch(0.3 0.05 50) 100%)',
          boxShadow: '0 3px 6px oklch(0.05 0 0 / 0.6)',
        }}
      />
      {/* Detalhe do castiçal (anel) */}
      <div
        className="z-10 -mt-3 h-1 w-9 rounded-full"
        style={{ background: 'oklch(0.5 0.07 62)' }}
      />
    </div>
  )
}

function InkwellWithQuill() {
  return (
    <div className="relative flex h-[130px] w-20 flex-col items-center justify-end">
      {/* Pena de ganso balançando */}
      <div
        className="animate-quill-sway absolute -top-4 right-2 z-20"
        style={{ transformOrigin: 'bottom center' }}
      >
        <svg width="16" height="68" viewBox="0 0 16 68" fill="none">
          {/* Haste da pena */}
          <rect x="7" y="16" width="2" height="52" rx="1" fill="oklch(0.82 0.06 70)" />
          <rect x="7" y="16" width="1" height="52" rx="0.5" fill="oklch(0.65 0.05 60)" opacity="0.6" />
          {/* Pluma da pena (barbado) */}
          <path
            d="M8 14 Q2 6 8 0 Q14 6 8 14 Z M8 14 Q3 20 8 30 Q13 20 8 14 Z"
            fill="oklch(0.92 0.03 80)"
            stroke="oklch(0.45 0.05 55 / 0.5)"
            strokeWidth="0.5"
          />
          <path d="M8 2 L8 30" stroke="oklch(0.4 0.05 55 / 0.45)" strokeWidth="0.5" />
          {/* Barbas finas */}
          <path d="M8 8 L4 4 M8 12 L3 9 M8 18 L3 16 M8 22 L4 21 M8 8 L12 4 M8 12 L13 9 M8 18 L13 16 M8 22 L12 21" stroke="oklch(0.5 0.05 60 / 0.4)" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Tinteiro (vidro, maior) */}
      <div
        className="relative z-10 h-12 w-10 rounded-t-lg rounded-b-xl"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.25 0.04 220 / 0.65) 0%, oklch(0.2 0.05 260 / 0.8) 25%, oklch(0.13 0.06 260) 55%)',
          boxShadow:
            'inset 2px 0 3px oklch(0.6 0.08 75 / 0.35), inset -2px 0 3px oklch(0.05 0 0 / 0.45), 0 3px 6px oklch(0.05 0 0 / 0.55)',
        }}
      >
        {/* Boca do tinteiro (abertura) */}
        <div
          className="absolute -top-1 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.3 0.04 40), oklch(0.15 0.05 260))',
            boxShadow: 'inset 0 1px 2px oklch(0.05 0 0 / 0.6)',
          }}
        />
        {/* Tinta (superfície brilhante) */}
        <div
          className="animate-ink-shimmer absolute inset-x-1.5 top-3 h-2 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, oklch(0.45 0.12 265 / 0.95), oklch(0.2 0.08 260))',
          }}
        />
        {/* Reflexo de luz no vidro */}
        <div
          className="absolute left-1 top-2 h-7 w-1.5 rounded-full"
          style={{ background: 'oklch(0.85 0.08 75 / 0.35)' }}
        />
        <div
          className="absolute right-1.5 bottom-2 h-4 w-1 rounded-full"
          style={{ background: 'oklch(0.7 0.06 70 / 0.2)' }}
        />
      </div>
      {/* Base do tinteiro (metal) */}
      <div
        className="z-10 h-2 w-14 rounded-md"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.5 0.08 65), oklch(0.32 0.05 50))',
          boxShadow: '0 2px 4px oklch(0.05 0 0 / 0.5)',
        }}
      />
    </div>
  )
}

function Hourglass() {
  return (
    <div className="relative flex h-[130px] w-16 flex-col items-center justify-end">
      {/* Colunas laterais (estrutura de madeira) */}
      <div className="absolute bottom-4 left-2 top-3 w-1 rounded-full bg-[oklch(0.3_0.04_42)]" />
      <div className="absolute bottom-4 right-2 top-3 w-1 rounded-full bg-[oklch(0.3_0.04_42)]" />

      {/* Moldura de madeira superior */}
      <div
        className="h-2.5 w-12 rounded-sm"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.34 0.045 44) 0%, oklch(0.24 0.03 38) 50%, oklch(0.16 0.02 32) 100%)',
          boxShadow: '0 1px 2px oklch(0.05 0 0 / 0.5)',
        }}
      />

      {/* Vidros (duas ampolas) */}
      <div className="relative my-0.5 h-20 w-9">
        {/* Ampola superior */}
        <div
          className="absolute inset-x-0 top-0 h-10"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.85 0.1 75 / 0.35) 0%, oklch(0.85 0.1 75 / 0.15) 60%, oklch(0.85 0.1 75 / 0.45) 100%)',
            clipPath: 'polygon(0 0, 100% 0, 56% 100%, 44% 100%)',
            boxShadow: 'inset 0 0 6px oklch(0.6 0.1 60 / 0.3)',
          }}
        >
          {/* Areia no topo (diminuindo) */}
          <div
            className="absolute inset-x-0 top-0 h-4"
            style={{
              background:
                'linear-gradient(to bottom, oklch(0.78 0.1 72), oklch(0.6 0.08 55))',
              clipPath: 'polygon(0 0, 100% 0, 62% 100%, 38% 100%)',
            }}
          />
        </div>
        {/* Ampola inferior */}
        <div
          className="absolute inset-x-0 bottom-0 h-10"
          style={{
            background:
              'linear-gradient(to top, oklch(0.85 0.1 75 / 0.35) 0%, oklch(0.85 0.1 75 / 0.15) 60%, oklch(0.85 0.1 75 / 0.45) 100%)',
            clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)',
            boxShadow: 'inset 0 0 6px oklch(0.6 0.1 60 / 0.3)',
          }}
        >
          {/* Monte de areia no fundo */}
          <div
            className="absolute inset-x-1 bottom-0 h-3.5 rounded-t-full"
            style={{
              background:
                'linear-gradient(to top, oklch(0.78 0.1 72), oklch(0.6 0.08 55))',
            }}
          />
        </div>
        {/* Fio de areia caindo */}
        <div
          className="absolute left-1/2 top-9 h-8 w-0.5 -translate-x-1/2"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.78 0.1 72), oklch(0.6 0.08 55) 80%, transparent)',
            animation: 'sand-fall 2.2s linear infinite',
          }}
        />
        {/* Reflexo no vidro */}
        <div
          className="absolute left-1 top-2 h-8 w-0.5 rounded-full"
          style={{ background: 'oklch(0.9 0.05 80 / 0.3)' }}
        />
      </div>

      {/* Moldura inferior */}
      <div
        className="h-2.5 w-12 rounded-sm"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.34 0.045 44) 0%, oklch(0.24 0.03 38) 50%, oklch(0.16 0.02 32) 100%)',
          boxShadow: '0 2px 4px oklch(0.05 0 0 / 0.5)',
        }}
      />
    </div>
  )
}

/* ===================== Poeira da mesa ===================== */

function DeskDust() {
  const motes = useClientOnly(
    'desk-dust',
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        bottom: Math.random() * 40,
        size: 1 + Math.random() * 2.5,
        duration: 8 + Math.random() * 8,
        delay: Math.random() * -10,
        x: (Math.random() - 0.5) * 60,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full"
          style={
            {
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              width: m.size,
              height: m.size,
              background:
                'radial-gradient(circle, oklch(0.85 0.12 75 / 0.6), transparent 70%)',
              animation: `desk-mote ${m.duration}s ease-in-out infinite`,
              animationDelay: `${m.delay}s`,
              ['--mote-x' as string]: `${m.x}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
