'use client'

import { useCallback, useEffect, useState } from 'react'

export type BookStatus = 'reading' | 'finished'

export interface Book {
  id: string
  title: string
  author: string | null
  status: BookStatus
  startedAt: string
  finishedAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface LibraryStats {
  totalBooks: number
  totalFinished: number
  thisYear: number
  thisMonth: number
  currentlyReading: number
  avgReadingDays: number
  monthlyActivity: number[]
}

interface NewBookInput {
  title: string
  author?: string
  status?: BookStatus
  startedAt?: string
  notes?: string
}

interface UpdateBookInput {
  title?: string
  author?: string
  status?: BookStatus
  startedAt?: string
  finishedAt?: string
  notes?: string
}

/**
 * Hook que gerencia o estado da biblioteca monástica: livros, estatísticas
 * e mutações (adicionar, atualizar, excluir). Revalida automaticamente após
 * cada mutação para que a UI reflita imediatamente o banco de dados.
 */
export function useLibrary() {
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const [booksRes, statsRes] = await Promise.all([
        fetch('/api/books', { cache: 'no-store' }),
        fetch('/api/stats', { cache: 'no-store' }),
      ])
      if (!booksRes.ok || !statsRes.ok) {
        throw new Error('Falha ao consultar o scriptorium.')
      }
      const booksData = await booksRes.json()
      const statsData = await statsRes.json()
      setBooks(booksData.books ?? [])
      setStats(statsData)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addBook = useCallback(
    async (input: NewBookInput) => {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Não foi possível registrar o tomo.')
      }
      await refresh()
    },
    [refresh],
  )

  const updateBook = useCallback(
    async (id: string, input: UpdateBookInput) => {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Não foi possível atualizar o tomo.')
      }
      await refresh()
    },
    [refresh],
  )

  const deleteBook = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Não foi possível remover o tomo.')
      }
      await refresh()
    },
    [refresh],
  )

  return {
    books,
    stats,
    loading,
    error,
    refresh,
    addBook,
    updateBook,
    deleteBook,
  }
}
