'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  BookMarked,
  BookOpen,
  Calendar,
  Hourglass,
  Library,
  Loader2,
  Scroll,
  Sparkles,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useLibrary, type Book } from '@/hooks/use-library'
import { toast } from '@/hooks/use-toast'
import { DustParticles } from '@/components/monastery/dust-particles'
import { CandleGlow } from '@/components/monastery/candle-glow'
import { WaxSeal } from '@/components/monastery/wax-seal'
import { OrnateDivider } from '@/components/monastery/ornate-divider'
import { ParchmentCard } from '@/components/monastery/parchment-card'
import { MonasteryEmblem } from '@/components/monastery/monastery-emblem'
import { TomeCard } from '@/components/monastery/tome-card'
import { AddBookForm } from '@/components/monastery/add-book-form'
import { BookShelf } from '@/components/monastery/book-shelf'
import { ReadingDesk } from '@/components/monastery/reading-desk'
import { MonasteryScene } from '@/components/monastery/monastery-scene'
import { AmbientSound } from '@/components/monastery/ambient-sound'
import { formatMonthYear, MONTHS_SHORT } from '@/lib/dates'

export default function Home() {
  const { books, stats, loading, error, addBook, updateBook, deleteBook } =
    useLibrary()

  const [highlightId, setHighlightId] = useState<string | null>(null)

  // Rola até o card detalhado de um tomo (clicado na estante ou na mesa) e o destaca.
  const focusTome = useCallback((id: string) => {
    const el = document.getElementById(`tome-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightId(id)
      window.setTimeout(() => setHighlightId((cur) => (cur === id ? null : cur)), 1800)
    }
  }, [])

  const readingBooks = useMemo(
    () => books.filter((b) => b.status === 'reading'),
    [books],
  )
  const finishedBooks = useMemo(
    () => books.filter((b) => b.status === 'finished'),
    [books],
  )

  // Agrupar tomos concluídos por mês/ano (ordenado do mais recente ao mais antigo).
  const groupedFinished = useMemo(() => {
    const map = new Map<string, Book[]>()
    finishedBooks.forEach((b) => {
      if (!b.finishedAt) return
      const d = new Date(b.finishedAt)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(b)
    })
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  }, [finishedBooks])

  // ---- Handlers com toast ----
  const handleAdd = async (input: {
    title: string
    author?: string
    status?: 'reading' | 'finished'
    startedAt?: string
    notes?: string
  }) => {
    try {
      await addBook(input)
      toast({
        title: 'Tomo registrado',
        description: `“${input.title}” foi adicionado ao scriptorium.`,
      })
    } catch (e) {
      toast({
        title: 'Falha ao registrar',
        description: e instanceof Error ? e.message : 'Erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleMarkFinished = async (id: string) => {
    try {
      await updateBook(id, { status: 'finished' })
      toast({
        title: 'Leitura selada',
        description: 'O tomo foi marcado como concluído na crônica.',
      })
    } catch (e) {
      toast({
        title: 'Falha',
        description: e instanceof Error ? e.message : 'Erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleReopen = async (id: string) => {
    try {
      await updateBook(id, { status: 'reading' })
      toast({
        title: 'Leitura reaberta',
        description: 'O tomo voltou para a mesa de leitura.',
      })
    } catch (e) {
      toast({
        title: 'Falha',
        description: e instanceof Error ? e.message : 'Erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id)
      toast({
        title: 'Tomo removido',
        description: 'O registro foi apagado dos arquivos.',
      })
    } catch (e) {
      toast({
        title: 'Falha',
        description: e instanceof Error ? e.message : 'Erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = async (
    id: string,
    data: { title: string; author: string; notes: string },
  ) => {
    try {
      await updateBook(id, {
        title: data.title,
        author: data.author || null,
        notes: data.notes || null,
      })
      toast({ title: 'Tomo atualizado', description: 'As anotações foram seladas.' })
    } catch (e) {
      toast({
        title: 'Falha',
        description: e instanceof Error ? e.message : 'Erro desconhecido.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Cena 3D do mosteiro ao fundo (janelas, luz, vento, sino, incenso) */}
      <MonasteryScene />
      <DustParticles count={32} />

      {/* Velas nos cantos (apenas telas grandes) */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <CandleGlow className="left-4 top-24 hidden lg:block" size={50} />
        <CandleGlow className="right-4 top-24 hidden lg:block" size={50} />
        <CandleGlow className="bottom-4 left-1/2 hidden -translate-x-1/2 xl:block" size={44} />
      </div>

      {/* Player de música ambient bardcore */}
      <AmbientSound />

      {/* ===== HEADER ===== */}
      <header className="relative z-10 px-4 pb-8 pt-12 text-center md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-4 flex justify-center"
        >
          <MonasteryEmblem className="h-24 w-24 drop-shadow-[0_0_20px_oklch(0.6_0.12_60/0.4)] md:h-28 md:w-28" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gold-glow font-gothic text-5xl leading-tight md:text-7xl"
          style={{ fontFamily: 'var(--font-gothic), serif' }}
        >
          Scriptorium
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-2 font-display text-xs uppercase tracking-[0.4em] text-gold/80 md:text-sm"
        >
          Biblioteca Monástica
        </motion.p>

        <motion.p
          initial={{ opacity: 0, fontStyle: 'italic' }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mt-4 max-w-xl font-body text-sm italic text-parchment/60 md:text-base"
        >
          &ldquo;Lectio est oratio&rdquo; — ler é rezar. Aqui jaz o registro de
          cada tomo que atravessou estas mãos, à luz trêmula das velas.
        </motion.p>

        <OrnateDivider className="mx-auto mt-6 max-w-md" symbol="fleur" />
      </header>

      {/* ===== MAIN ===== */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-20">
        {error && (
          <ParchmentCard className="mb-8 border-wax/40">
            <div className="flex items-center gap-3 text-[var(--ink)]">
              <AlertCircle className="h-5 w-5 shrink-0 text-wax" />
              <p className="font-body text-sm">
                {error}{' '}
                <button
                  onClick={() => window.location.reload()}
                  className="underline decoration-dotted underline-offset-2 hover:text-wax"
                >
                  Recarregar o scriptorium
                </button>
              </p>
            </div>
          </ParchmentCard>
        )}

        {/* ===== Scriptório: a cena física (estante + mesa) ===== */}
        <ScriptoriumScene
          readingBooks={readingBooks}
          finishedBooks={finishedBooks}
          loading={loading}
          onFocusTome={focusTome}
        />

        {/* ===== Painel de Estatísticas ===== */}
        <StatsPanel stats={stats} loading={loading} />

        {/* ===== Formulário de Registro ===== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 mt-12"
        >
          <AddBookForm onAdd={handleAdd} />
        </motion.section>

        {/* ===== Em Leitura ===== */}
        <section className="mb-14">
          <SectionHeader
            icon={<BookOpen className="h-5 w-5" />}
            eyebrow="Mesa do Leitor"
            title="Em Leitura"
            subtitle="Tomos abertos sobre o pedestal, aguardando o selo final."
          />

          {loading ? (
            <LoadingState message="Consultando o pedestal..." />
          ) : readingBooks.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-10 w-10" />}
              title="Nenhum tomo em leitura"
              hint="Registre um livro acima e marque-o como “em leitura” para vê-lo aqui."
            />
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {readingBooks.map((b, i) => (
                  <TomeCard
                    key={b.id}
                    book={b}
                    index={i}
                    highlighted={highlightId === b.id}
                    onMarkFinished={handleMarkFinished}
                    onReopen={handleReopen}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* ===== Crônica de Leituras ===== */}
        <section className="mb-8">
          <SectionHeader
            icon={<Scroll className="h-5 w-5" />}
            eyebrow="Arquivo dos Séculos"
            title="Crônica de Leituras"
            subtitle="O pergaminho de cada leitura concluída, ordenado pelo dia do selo."
          />

          {!loading && finishedBooks.length === 0 ? (
            <EmptyState
              icon={<BookMarked className="h-10 w-10" />}
              title="A crônica aguarda seu primeiro selo"
              hint="Quando concluir uma leitura, ela será registrada aqui com data e duração."
            />
          ) : (
            <div className="space-y-10">
              {groupedFinished.map(([key, groupBooks]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-4 flex items-baseline gap-3">
                    <Calendar className="h-4 w-4 text-gold/70" />
                    <h3 className="font-display text-lg font-semibold tracking-wide text-gold md:text-xl">
                      {formatMonthYear(groupBooks[0].finishedAt!)}
                    </h3>
                    <span className="font-body text-xs uppercase tracking-wider text-parchment/50">
                      {groupBooks.length}{' '}
                      {groupBooks.length === 1 ? 'tomo selado' : 'tomos selados'}
                    </span>
                    <div className="gold-divider h-px flex-1" />
                  </div>
                  <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                      {groupBooks.map((b, i) => (
                        <TomeCard
                          key={b.id}
                          book={b}
                          index={i}
                          highlighted={highlightId === b.id}
                          onMarkFinished={handleMarkFinished}
                          onReopen={handleReopen}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ===== FOOTER (sticky) ===== */}
      <footer className="relative z-10 mt-auto border-t border-gold/20 bg-[var(--background)]/85 px-4 py-6 text-center backdrop-blur-sm">
        <OrnateDivider className="mx-auto mb-4 max-w-xs" symbol="cross" />
        <p className="font-body text-xs italic text-parchment/50">
          Scriptorum custodita ad perpetuam — &ldquo;Que os escritos sejam
          guardados para sempre&rdquo;
        </p>
        <p className="mt-2 font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold/50">
          Anno Domini {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

/* ===================== Subcomponentes locais ===================== */

function ScriptoriumScene({
  readingBooks,
  finishedBooks,
  loading,
  onFocusTome,
}: {
  readingBooks: Book[]
  finishedBooks: Book[]
  loading: boolean
  onFocusTome: (id: string) => void
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14 mt-10"
    >
      <div className="mb-5 flex items-center gap-3">
        <Library className="h-5 w-5 text-gold" />
        <span className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-gold/70">
          O Scriptório
        </span>
        <div className="gold-divider h-px flex-1" />
      </div>

      {/* Cena: estante ao fundo + mesa à frente (sobreposta, à direita em desktop) */}
      <div className="relative">
        {/* Estante de fundo */}
        <BookShelf books={finishedBooks} onSelect={onFocusTome} />

        {/* Mesa de leitor sobreposta, à frente da estante */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto mt-8 max-w-3xl"
        >
          <div
            className="relative overflow-hidden rounded-[var(--radius)] border border-gold/25 p-5 sm:p-8"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 30%, oklch(0.22 0.035 40) 0%, oklch(0.16 0.025 35) 70%, oklch(0.12 0.02 32) 100%)',
              boxShadow:
                'inset 0 0 40px oklch(0.05 0 0 / 0.6), 0 10px 30px oklch(0.05 0 0 / 0.5)',
            }}
          >
            {/* Cabeçalho da mesa */}
            <div className="mb-4 flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gold/70" />
                <span className="font-display text-[0.7rem] uppercase tracking-[0.35em] text-gold/80">
                  Mesa do Leitor
                </span>
                <BookOpen className="h-4 w-4 -scale-x-100 text-gold/70" />
              </div>
              <p className="font-body text-xs italic text-parchment/45">
                O tomo aberto no púlpito é a leitura ativa; os demais aguardam na pilha.
              </p>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-gold" />
                <span className="font-body text-sm italic text-parchment/60">
                  Dispondo os tomos sobre a mesa...
                </span>
              </div>
            ) : (
              <ReadingDesk books={readingBooks} onSelect={onFocusTome} />
            )}
          </div>
        </motion.div>

        {/* Luz de vela decorativa sobre a cena (apenas telas grandes) */}
        <div
          className="pointer-events-none absolute -top-4 left-1/2 z-20 hidden h-32 w-64 -translate-x-1/2 lg:block"
          style={{
            background:
              'radial-gradient(ellipse at center top, oklch(0.6 0.12 60 / 0.18), transparent 70%)',
          }}
        />
      </div>

      <p className="mt-4 text-center font-body text-xs italic text-parchment/40">
        Clique no livro aberto, numa lombada da estante ou num tomo da pilha para localizar seu registro.
      </p>
    </motion.section>
  )
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        <span className="text-gold">{icon}</span>
        <span className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-gold/70">
          {eyebrow}
        </span>
        <div className="gold-divider h-px flex-1" />
      </div>
      <h2 className="mt-2 font-display text-2xl font-bold text-parchment md:text-3xl">
        {title}
      </h2>
      <p className="mt-1 font-body text-sm italic text-parchment/55">{subtitle}</p>
    </motion.div>
  )
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="wood-panel flex items-center justify-center gap-3 rounded-[var(--radius)] p-10">
      <Loader2 className="h-5 w-5 animate-spin text-gold" />
      <span className="font-body text-sm italic text-parchment/70">{message}</span>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode
  title: string
  hint: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="wood-panel flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] p-10 text-center"
    >
      <div className="text-gold/40">{icon}</div>
      <p className="font-display text-lg text-parchment/80">{title}</p>
      <p className="max-w-sm font-body text-sm italic text-parchment/50">{hint}</p>
    </motion.div>
  )
}

function StatsPanel({
  stats,
  loading,
}: {
  stats: ReturnType<typeof useLibrary>['stats']
  loading: boolean
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="wood-panel relative overflow-hidden rounded-[var(--radius)] p-6 md:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-gold" />
        <h2 className="font-display text-sm uppercase tracking-[0.3em] text-gold/80 md:text-base">
          Crônica do Leitor
        </h2>
        <div className="gold-divider h-px flex-1" />
      </div>

      {loading || !stats ? (
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
          <span className="font-body text-sm italic text-parchment/60">
            Compilando os pergaminhos...
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            <WaxSeal
              value={stats.totalFinished}
              label="Total Lidos"
              variant="gold"
              delay={0.1}
            />
            <WaxSeal
              value={stats.thisYear}
              label={`Em ${new Date().getFullYear()}`}
              variant="crimson"
              delay={0.2}
            />
            <WaxSeal
              value={stats.thisMonth}
              label={MONTHS_SHORT[new Date().getMonth()]}
              variant="wine"
              delay={0.3}
            />
            <WaxSeal
              value={stats.currentlyReading}
              label="Em Leitura"
              variant="moss"
              delay={0.4}
            />
            <WaxSeal
              value={stats.avgReadingDays > 0 ? stats.avgReadingDays : '—'}
              label="Dias/Tomo"
              variant="gold"
              delay={0.5}
            />
          </div>

          {/* Atividade mensal do ano */}
          <MonthlyActivity activity={stats.monthlyActivity} />
        </>
      )}
    </motion.section>
  )
}

function MonthlyActivity({ activity }: { activity: number[] }) {
  const max = Math.max(1, ...activity)
  const currentMonth = new Date().getMonth()
  const total = activity.reduce((a, b) => a + b, 0)

  if (total === 0) return null

  return (
    <div className="mt-8 border-t border-gold/15 pt-6">
      <div className="mb-3 flex items-center gap-2">
        <Hourglass className="h-3.5 w-3.5 text-gold/60" />
        <span className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-gold/70">
          Atividade de {new Date().getFullYear()}
        </span>
      </div>
      <div className="flex h-20 items-end justify-between gap-1">
        {activity.map((count, i) => {
          const height = (count / max) * 100
          const isCurrent = i === currentMonth
          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 font-display text-[0.6rem] text-gold/70 opacity-0 transition-opacity group-hover:opacity-100">
                {count > 0 ? count : ''}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(count > 0 ? 6 : 2, height)}%` }}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
                className={`w-full rounded-t-sm ${
                  count > 0
                    ? isCurrent
                      ? 'bg-gradient-to-t from-wax to-gold'
                      : 'bg-gradient-to-t from-gold-dark to-gold/80'
                    : 'bg-gold/10'
                }`}
                style={{ minHeight: count > 0 ? 4 : 2 }}
              />
              <span className="mt-1 font-body text-[0.55rem] uppercase text-parchment/40">
                {MONTHS_SHORT[i][0]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
