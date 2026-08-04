'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Library } from 'lucide-react'
import {
  spineColorFor,
  spineHighlightFor,
  spineShadowFor,
  spineHeightFor,
  spineWidthFor,
} from '@/lib/book-colors'
import type { Book } from '@/hooks/use-library'

interface BookShelfProps {
  books: Book[]
  onSelect?: (id: string) => void
}

const BOOKS_PER_SHELF = 9

/**
 * Estante monástica: prateleiras de madeira com lombadas verticais.
 * Quando um tomo é selado (concluído), sua lombada "entra" na prateleira;
 * quando reaberto/removido, "sai" com animação.
 */
export function BookShelf({ books, onSelect }: BookShelfProps) {
  // Distribui os tomos em prateleiras de BOOKS_PER_SHELF.
  const shelves: Book[][] = []
  for (let i = 0; i < books.length; i += BOOKS_PER_SHELF) {
    shelves.push(books.slice(i, i + BOOKS_PER_SHELF))
  }
  // Garante ao menos 2 prateleiras para a estante não parecer vazia.
  while (shelves.length < 2) shelves.push([])

  return (
    <div className="bookshelf relative w-full overflow-hidden rounded-[var(--radius)] p-3 sm:p-4">
      {/* Cornija (topo ornamentado) */}
      <div className="shelf-cornice mb-1 h-3 w-full rounded-t" />

      {/* Prateleiras */}
      <div className="flex flex-col gap-0">
        {shelves.map((shelfBooks, shelfIdx) => (
          <Shelf
            key={shelfIdx}
            books={shelfBooks}
            onSelect={onSelect}
            isLast={shelfIdx === shelves.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

function Shelf({
  books,
  onSelect,
  isLast,
}: {
  books: Book[]
  onSelect?: (id: string) => void
  isLast: boolean
}) {
  return (
    <div className="shelf relative">
      {/* Leito da prateleira (fundo escuro recessado) */}
      <div
        className="relative flex items-end gap-[3px] px-2"
        style={{
          height: 138,
          background:
            'linear-gradient(to bottom, oklch(0.1 0.02 38) 0%, oklch(0.14 0.02 38) 100%)',
          boxShadow:
            'inset 0 8px 16px oklch(0.05 0 0 / 0.7), inset 0 -2px 4px oklch(0.05 0 0 / 0.5)',
          borderBottom: '2px solid oklch(0.08 0.01 30)',
        }}
      >
        {/* Tom de fundo da prateleira (sombra traseira) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, oklch(0.05 0 0 / 0.6) 0%, transparent 8%, transparent 92%, oklch(0.05 0 0 / 0.6) 100%)',
          }}
        />

        <AnimatePresence mode="popLayout">
          {books.map((b, i) => (
            <ShelfSpine key={b.id} book={b} index={i} onSelect={onSelect} />
          ))}
        </AnimatePresence>

        {/* Estado vazio da prateleira */}
        {books.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-body text-xs italic text-parchment/25">
              prateleira vazia
            </span>
          </div>
        )}
      </div>

      {/* Tábua da prateleira (borda de madeira embaixo) */}
      <div
        className="shelf-board relative h-2 w-full"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.3 0.04 45) 0%, oklch(0.2 0.03 38) 60%, oklch(0.12 0.02 32) 100%)',
          boxShadow:
            '0 3px 6px oklch(0.05 0 0 / 0.6), inset 0 1px 0 oklch(0.4 0.05 55 / 0.4)',
        }}
      >
        {/* Veio da madeira */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'repeating-linear-gradient(90deg, transparent 0px, oklch(0.15 0.02 30 / 0.3) 2px, transparent 5px, oklch(0.25 0.03 40 / 0.2) 8px, transparent 12px)',
          }}
        />
      </div>

      {/* Sombra projetada pela tábua na prateleira de baixo */}
      {!isLast && (
        <div
          className="h-3 w-full"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.05 0 0 / 0.5), transparent)',
          }}
        />
      )}
    </div>
  )
}

function ShelfSpine({
  book,
  index,
  onSelect,
}: {
  book: Book
  index: number
  onSelect?: (id: string) => void
}) {
  const color = spineColorFor(book.id)
  const highlight = spineHighlightFor(book.id)
  const shadow = spineShadowFor(book.id)
  const height = spineHeightFor(book.id)
  const width = spineWidthFor(book.id)

  // Título truncado para a lombada.
  const title =
    book.title.length > 32 ? book.title.slice(0, 30) + '…' : book.title

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect?.(book.id)}
      title={`${book.title}${book.author ? ` — ${book.author}` : ''}`}
      aria-label={`Tomo na estante: ${book.title}`}
      initial={{ opacity: 0, y: -40, scaleY: 0.3, rotateZ: -8 }}
      animate={{ opacity: 1, y: 0, scaleY: 1, rotateZ: 0 }}
      exit={{ opacity: 0, y: -30, scaleY: 0.4, transition: { duration: 0.35 } }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 20,
        delay: Math.min(index * 0.04, 0.3),
      }}
      whileHover={{
        y: -10,
        rotateZ: -2,
        filter: 'brightness(1.15)',
        transition: { duration: 0.2 },
      }}
      className="group relative shrink-0 cursor-pointer rounded-sm"
      style={{
        width,
        height,
        background: `linear-gradient(to right, ${shadow} 0%, ${color} 12%, ${highlight} 50%, ${color} 88%, ${shadow} 100%)`,
        boxShadow: `inset 1px 0 2px oklch(0.05 0 0 / 0.6), inset -1px 0 2px oklch(0.05 0 0 / 0.6), 0 2px 6px oklch(0.05 0 0 / 0.5)`,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Filete dourado superior */}
      <div
        className="absolute left-1 right-1 top-2 h-px"
        style={{ background: 'oklch(0.7 0.12 75 / 0.7)' }}
      />
      <div
        className="absolute left-1.5 right-1.5 top-3 h-px"
        style={{ background: 'oklch(0.6 0.1 70 / 0.4)' }}
      />
      {/* Filete dourado inferior */}
      <div
        className="absolute bottom-2 left-1 right-1 h-px"
        style={{ background: 'oklch(0.7 0.12 75 / 0.7)' }}
      />
      <div
        className="absolute bottom-3 left-1.5 right-1.5 h-px"
        style={{ background: 'oklch(0.6 0.1 70 / 0.4)' }}
      />

      {/* Título vertical */}
      <span
        className="absolute inset-0 flex items-center justify-center px-1 font-display text-[0.6rem] font-semibold uppercase tracking-wide text-parchment/90"
        style={{
          writingMode: 'vertical-rl',
          textShadow: '0 1px 1px oklch(0.05 0 0 / 0.7)',
          overflow: 'hidden',
        }}
      >
        <span className="line-clamp-1">{title}</span>
      </span>

      {/* Brilho de hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, oklch(0.9 0.1 75 / 0.18) 50%, transparent 100%)',
        }}
      />
    </motion.button>
  )
}

/** Estado vazio decorativo da estante inteira. */
export function EmptyBookshelf() {
  return (
    <div className="bookshelf relative w-full overflow-hidden rounded-[var(--radius)] p-6 text-center">
      <div className="shelf-cornice mb-2 h-3 w-full rounded-t" />
      <div className="flex h-40 flex-col items-center justify-center gap-2">
        <Library className="h-8 w-8 text-gold/30" />
        <p className="font-body text-sm italic text-parchment/40">
          A estante aguarda seus primeiros tomos selados...
        </p>
      </div>
    </div>
  )
}
