'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { spineColorFor, spineHighlightFor, spineTiltFor } from '@/lib/book-colors'
import type { Book } from '@/hooks/use-library'

interface ReadingDeskProps {
  books: Book[]
  onSelect?: (id: string) => void
}

const BOOK_THICKNESS = 18 // px de altura por tomo empilhado

/**
 * Mesa de leitor monástica: um tampo de madeira em leve perspectiva com
 * uma pilha de tomos deitados. O tomo mais recente cai no topo da pilha;
 * ao ser selado, sobe e desaparece (voando para a estante).
 */
export function ReadingDesk({ books, onSelect }: ReadingDeskProps) {
  const stackHeight = Math.max(0, books.length * BOOK_THICKNESS)

  return (
    <div className="reading-desk relative w-full">
      {/* Suportes da mesa (pés/cavaletes) — decorativos */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-between px-[8%]">
        <DeskLeg />
        <DeskLeg />
      </div>

      {/* Área da pilha de livros (acima do tampo) */}
      <div
        className="relative z-20 mx-auto flex w-full max-w-md justify-center"
        style={{ height: Math.max(120, stackHeight + 30), minHeight: 120 }}
      >
        <div className="relative flex w-full justify-center" style={{ height: stackHeight + 24 }}>
          <AnimatePresence mode="popLayout">
            {books.map((b, i) => (
              <DeskBook
                key={b.id}
                book={b}
                stackIndex={i}
                total={books.length}
                onSelect={onSelect}
              />
            ))}
          </AnimatePresence>

          {books.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center"
            >
              <BookOpen className="mx-auto mb-1 h-7 w-7 text-gold/30" />
              <p className="font-body text-xs italic text-parchment/40">
                A mesa aguarda um tomo aberto
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tampo da mesa (em perspectiva) */}
      <div className="desk-top relative z-10 h-6 w-full" />

      {/* Sombra da mesa no chão */}
      <div
        className="mx-auto h-3 w-[85%] rounded-[50%]"
        style={{
          background:
            'radial-gradient(ellipse, oklch(0.05 0 0 / 0.5) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

function DeskLeg() {
  return (
    <div
      className="h-16 w-3 -translate-y-1"
      style={{
        background:
          'linear-gradient(to right, oklch(0.18 0.02 35) 0%, oklch(0.28 0.03 42) 50%, oklch(0.18 0.02 35) 100%)',
        transform: 'perspective(200px) rotateX(8deg)',
        boxShadow: '0 2px 6px oklch(0.05 0 0 / 0.5)',
      }}
    />
  )
}

function DeskBook({
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
  const tilt = spineTiltFor(book.id)
  // Quanto mais no topo da pilha, mais recente (índice maior = mais acima).
  const fromBottom = stackIndex * BOOK_THICKNESS
  // Largura variável para parecer natural.
  const width = 168 + (stackIndex % 3) * 14

  const isTop = stackIndex === total - 1
  const title =
    book.title.length > 26 ? book.title.slice(0, 24) + '…' : book.title

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect?.(book.id)}
      title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}
      aria-label={`Tomo na mesa de leitura: ${book.title}`}
      initial={{ opacity: 0, y: -180, rotateZ: tilt * 4, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateZ: tilt,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -120,
        rotateZ: tilt * 3,
        scale: 0.85,
        transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] },
      }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: isTop ? 12 : 16, // topo quica um pouco mais
        mass: 0.9,
      }}
      whileHover={{
        y: -6,
        rotateZ: tilt + 1,
        filter: 'brightness(1.12)',
        transition: { duration: 0.2 },
      }}
      className="group absolute left-1/2 cursor-pointer"
      style={{
        bottom: fromBottom,
        width,
        height: BOOK_THICKNESS + 6,
        transform: `translateX(-50%) rotate(${tilt}deg)`,
        transformOrigin: 'center bottom',
      }}
    >
      {/* Corpo do livro deitado: lombada (esquerda) + capa (centro) + páginas (direita) */}
      <div
        className="relative flex h-full w-full overflow-hidden rounded-[2px]"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${highlight} 40%, ${color} 70%, oklch(0.85 0.04 75) 100%)`,
          boxShadow: `0 2px 4px oklch(0.05 0 0 / 0.6), inset 0 1px 0 oklch(0.9 0.05 75 / 0.3), inset 0 -2px 4px oklch(0.05 0 0 / 0.4)`,
        }}
      >
        {/* Lombada (faixa colorida à esquerda) */}
        <div
          className="h-full w-4 shrink-0"
          style={{
            background: `linear-gradient(to right, ${color}, ${highlight})`,
            boxShadow: 'inset -1px 0 2px oklch(0.05 0 0 / 0.5)',
          }}
        />
        {/* Filete dourado na lombada */}
        <div
          className="absolute left-4 top-1 h-px w-3"
          style={{ background: 'oklch(0.7 0.12 75 / 0.6)' }}
        />

        {/* Capa com título */}
        <div className="flex h-full min-w-0 flex-1 items-center px-2">
          <span
            className="line-clamp-1 font-display text-[0.6rem] font-semibold uppercase tracking-wide text-parchment/90"
            style={{ textShadow: '0 1px 1px oklch(0.05 0 0 / 0.6)' }}
          >
            {title}
          </span>
        </div>

        {/* Páginas (à direita, textura listrada) */}
        <div
          className="h-full w-3 shrink-0"
          style={{
            background:
              'repeating-linear-gradient(to right, oklch(0.88 0.04 80) 0px, oklch(0.78 0.05 75) 1px, oklch(0.88 0.04 80) 2px)',
            boxShadow: 'inset 1px 0 2px oklch(0.05 0 0 / 0.3)',
          }}
        />
      </div>

      {/* Marcador de página (fita) — apenas no tomo do topo */}
      {isTop && (
        <div
          className="absolute right-6 top-1 h-5 w-1 origin-top"
          style={{
            background: 'oklch(0.5 0.18 25)',
            transform: 'rotate(2deg) translateY(-2px)',
            boxShadow: '0 1px 2px oklch(0.05 0 0 / 0.4)',
          }}
        />
      )}

      {/* Brilho de hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.95 0.08 75 / 0.2), transparent 50%)',
        }}
      />
    </motion.button>
  )
}
