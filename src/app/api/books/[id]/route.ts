import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/books/[id]
// Body opcional: { title?, author?, status?, startedAt?, finishedAt?, notes? }
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, author, status, startedAt, finishedAt, notes } = body || {}

    const existing = await db.book.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Tomo não encontrado nos arquivos.' },
        { status: 404 },
      )
    }

    const data: Record<string, unknown> = {}

    if (typeof title === 'string' && title.trim().length > 0) {
      data.title = title.trim()
    }
    if (author !== undefined) {
      data.author = typeof author === 'string' && author.trim() ? author.trim() : null
    }
    if (notes !== undefined) {
      data.notes = typeof notes === 'string' && notes.trim() ? notes.trim() : null
    }
    if (startedAt !== undefined) {
      data.startedAt = startedAt ? new Date(startedAt) : existing.startedAt
    }

    // Transição de status: marcar como terminado ou reabrir leitura.
    if (status === 'finished') {
      data.status = 'finished'
      data.finishedAt = finishedAt ? new Date(finishedAt) : new Date()
    } else if (status === 'reading') {
      data.status = 'reading'
      data.finishedAt = null
    }

    const updated = await db.book.update({ where: { id }, data })
    return NextResponse.json({ book: updated })
  } catch (error) {
    console.error('[PATCH /api/books/[id]]', error)
    return NextResponse.json(
      { error: 'Não foi possível atualizar o tomo.' },
      { status: 500 },
    )
  }
}

// DELETE /api/books/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const existing = await db.book.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Tomo não encontrado nos arquivos.' },
        { status: 404 },
      )
    }

    await db.book.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/books/[id]]', error)
    return NextResponse.json(
      { error: 'Não foi possível remover o tomo.' },
      { status: 500 },
    )
  }
}
