'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Feather, Library, ScrollText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { OrnateDivider } from './ornate-divider'
import { ParchmentCard } from './parchment-card'
import { useClientOnly } from '@/hooks/use-client-only'
import type { BookStatus } from '@/hooks/use-library'

interface AddBookFormProps {
  onAdd: (input: {
    title: string
    author?: string
    status?: BookStatus
    startedAt?: string
    notes?: string
  }) => Promise<void>
}

function todayISO(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60_000)
  return local.toISOString().slice(0, 10)
}

export function AddBookForm({ onAdd }: AddBookFormProps) {
  // Data de hoje gerada apenas no cliente para evitar mismatch de hidratação
  // (o servidor pode estar em timezone diferente do cliente).
  const today = useClientOnly('add-book-today', todayISO, '')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [finished, setFinished] = useState(false)
  const [startedAt, setStartedAt] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Quando a data de hoje chega do cliente, preenche o campo se estiver vazio.
  useEffect(() => {
    if (today && !startedAt) {
      setStartedAt(today)
    }
  }, [today, startedAt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onAdd({
        title: title.trim(),
        author: author.trim() || undefined,
        status: finished ? 'finished' : 'reading',
        startedAt: new Date(startedAt || today).toISOString(),
        notes: notes.trim() || undefined,
      })
      setTitle('')
      setAuthor('')
      setNotes('')
      setFinished(false)
      setStartedAt(today)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ParchmentCard className="relative">
      <div className="mb-4 flex items-center gap-3">
        <Feather className="h-5 w-5 text-wax" />
        <h2 className="font-display text-xl font-semibold text-[var(--ink)] md:text-2xl">
          Registrar Novo Tomo
        </h2>
      </div>
      <p className="mb-4 font-body text-sm italic text-[var(--ink)]/60">
        &ldquo;Todo livro lido é uma alma resgatada do esquecimento.&rdquo;
      </p>

      <OrnateDivider className="mb-5 text-[var(--gold-dark)]" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="font-display text-xs uppercase tracking-wider text-[var(--ink)]/70">
              Título do Tomo *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: A Cidade de Deus"
              required
              className="border-[var(--parchment-dark)] bg-[var(--parchment)]/60 font-body text-[var(--ink)] placeholder:text-[var(--ink)]/30 focus-visible:ring-[var(--gold-dark)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="author" className="font-display text-xs uppercase tracking-wider text-[var(--ink)]/70">
              Autor (opcional)
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex.: Santo Agostinho"
              className="border-[var(--parchment-dark)] bg-[var(--parchment)]/60 font-body text-[var(--ink)] placeholder:text-[var(--ink)]/30 focus-visible:ring-[var(--gold-dark)]"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startedAt" className="font-display text-xs uppercase tracking-wider text-[var(--ink)]/70">
              Data de Início
            </Label>
            <Input
              id="startedAt"
              type="date"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="border-[var(--parchment-dark)] bg-[var(--parchment)]/60 font-body text-[var(--ink)] focus-visible:ring-[var(--gold-dark)]"
            />
          </div>

          <div className="flex items-end gap-3 pb-1">
            <div className="flex items-center gap-2">
              <Switch
                id="finished"
                checked={finished}
                onCheckedChange={setFinished}
              />
              <Label htmlFor="finished" className="flex cursor-pointer items-center gap-1.5 font-display text-xs uppercase tracking-wider text-[var(--ink)]/70">
                <ScrollText className="h-3.5 w-3.5" />
                Já concluí a leitura
              </Label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes" className="font-display text-xs uppercase tracking-wider text-[var(--ink)]/70">
            Anotações Marginais (opcional)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reflexões, citações, impressões..."
            className="min-h-[70px] border-[var(--parchment-dark)] bg-[var(--parchment)]/60 font-body text-[var(--ink)] placeholder:text-[var(--ink)]/30 focus-visible:ring-[var(--gold-dark)]"
          />
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            disabled={submitting || !title.trim()}
            className="w-full bg-wax font-display text-sm uppercase tracking-wider text-parchment hover:bg-wax-dark disabled:opacity-50"
          >
            <Library className="mr-2 h-4 w-4" />
            {submitting ? 'Selando no catálogo...' : 'Adicionar à Biblioteca'}
          </Button>
        </motion.div>
      </form>
    </ParchmentCard>
  )
}
