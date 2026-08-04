'use client'

import { motion } from 'framer-motion'
import { BookMarked, BookOpen, Check, Clock, Trash2, Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Book } from '@/hooks/use-library'
import { formatFullDate, formatRelative, readingDuration } from '@/lib/dates'

// Paleta de lombadas (tons medievais: couro, joia, cera).
const SPINE_COLORS = [
  'oklch(0.4 0.14 25)',   // carmesim
  'oklch(0.42 0.1 130)',  // verde-musgo
  'oklch(0.4 0.12 340)',  // vinho
  'oklch(0.38 0.1 55)',   // couro
  'oklch(0.45 0.13 75)',  // dourado-escuro
  'oklch(0.35 0.12 20)',  // bordô
  'oklch(0.4 0.09 160)',  // esmeralda escuro
  'oklch(0.38 0.11 300)', // ameixa
]

function spineColorFor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return SPINE_COLORS[hash % SPINE_COLORS.length]
}

interface TomeCardProps {
  book: Book
  index?: number
  onMarkFinished: (id: string) => void
  onReopen: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, data: { title: string; author: string; notes: string }) => void
}

export function TomeCard({
  book,
  index = 0,
  onMarkFinished,
  onReopen,
  onDelete,
  onEdit,
}: TomeCardProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author ?? '')
  const [notes, setNotes] = useState(book.notes ?? '')
  const [expanded, setExpanded] = useState(false)

  const spine = spineColorFor(book.id)
  const isFinished = book.status === 'finished'

  const saveEdit = () => {
    onEdit(book.id, { title, author, notes })
    setEditing(false)
  }

  const cancelEdit = () => {
    setTitle(book.title)
    setAuthor(book.author ?? '')
    setNotes(book.notes ?? '')
    setEditing(false)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
      transition={{ delay: Math.min(index * 0.05, 0.4), type: 'spring', stiffness: 120, damping: 18 }}
      whileHover={{ y: -4 }}
      className="wood-panel group relative flex gap-0 overflow-hidden rounded-[var(--radius)]"
    >
      {/* Lombada encadernada */}
      <div
        className="book-spine relative w-3 shrink-0 sm:w-4"
        style={{ background: `linear-gradient(90deg, ${spine} 0%, ${spine} 100%)` }}
        aria-hidden="true"
      >
        {/* Filete dourado horizontal */}
        <div className="absolute left-0 right-0 top-1/4 h-px bg-gold/40" />
        <div className="absolute left-0 right-0 bottom-1/4 h-px bg-gold/40" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4 sm:p-5">
        {editing ? (
          <div className="flex flex-col gap-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do tomo"
              className="border-[var(--parchment-dark)] bg-[var(--parchment)] text-[var(--ink)]"
            />
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Autor (opcional)"
              className="border-[var(--parchment-dark)] bg-[var(--parchment)] text-[var(--ink)]"
            />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações marginais..."
              className="min-h-[80px] border-[var(--parchment-dark)] bg-[var(--parchment)] text-[var(--ink)]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit} className="bg-gold text-ink hover:bg-gold-dark">
                <Check className="mr-1 h-3.5 w-3.5" /> Selar
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-parchment hover:bg-white/10">
                <X className="mr-1 h-3.5 w-3.5" /> Descartar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {isFinished ? (
                    <BookMarked className="h-4 w-4 shrink-0 text-gold" />
                  ) : (
                    <BookOpen className="h-4 w-4 shrink-0 animate-gold-shimmer text-gold" />
                  )}
                  <h3
                    className="font-display text-lg font-semibold leading-tight text-parchment sm:text-xl"
                    style={{ fontFamily: 'var(--font-gothic), var(--font-display), serif' }}
                  >
                    {book.title}
                  </h3>
                </div>
                {book.author && (
                  <p className="mt-1 font-body text-sm italic text-parchment/70">
                    por {book.author}
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 border ${
                  isFinished
                    ? 'border-gold/50 bg-gold/15 text-gold'
                    : 'border-wax/50 bg-wax/15 text-parchment'
                }`}
              >
                {isFinished ? 'Concluído' : 'Em Leitura'}
              </Badge>
            </div>

            {/* Datas */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-xs text-parchment/60">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Iniciado em <strong className="font-medium text-parchment/80">{formatFullDate(book.startedAt)}</strong>
              </span>
              {isFinished && book.finishedAt && (
                <>
                  <span className="text-gold/50">✦</span>
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-gold" />
                    Concluído em <strong className="font-medium text-gold/90">{formatFullDate(book.finishedAt)}</strong>
                  </span>
                  <span className="text-gold/50">✦</span>
                  <span className="italic">
                    {readingDuration(book.startedAt, book.finishedAt)} de leitura
                  </span>
                  <span className="text-gold/50">·</span>
                  <span className="italic">{formatRelative(book.finishedAt)}</span>
                </>
              )}
            </div>

            {/* Notas marginais */}
            {book.notes && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="font-body text-xs uppercase tracking-wider text-gold/70 transition-colors hover:text-gold"
                >
                  {expanded ? '− Recolher anotações' : '+ Ver anotações marginais'}
                </button>
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 border-l-2 border-gold/30 pl-3 font-body text-sm italic text-parchment/75"
                  >
                    &ldquo;{book.notes}&rdquo;
                  </motion.p>
                )}
              </div>
            )}

            {/* Ações */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {isFinished ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReopen(book.id)}
                  className="border-gold/40 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Reabrir leitura
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onMarkFinished(book.id)}
                  className="bg-wax text-parchment hover:bg-wax-dark"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Selar como concluído
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
                className="text-parchment/70 hover:bg-white/10 hover:text-parchment"
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-wax/80 hover:bg-wax/15 hover:text-wax"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remover
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="parchment border-[var(--parchment-dark)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-lg text-[var(--ink)]">
                      Remover este tomo do catálogo?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-body text-[var(--ink)]/70">
                      &ldquo;{book.title}&rdquo; será apagado dos arquivos do scriptorium.
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-[var(--parchment-dark)] bg-transparent text-[var(--ink)] hover:bg-[var(--parchment-dark)]/30">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(book.id)}
                      className="bg-wax text-parchment hover:bg-wax-dark"
                    >
                      Remover definitivamente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>
    </motion.article>
  )
}
