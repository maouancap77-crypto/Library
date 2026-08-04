import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/books?status=reading|finished
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')

    const books = await db.book.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ finishedAt: 'desc' }, { startedAt: 'desc' }],
    })

    return NextResponse.json({ books })
  } catch (error) {
    console.error('[GET /api/books]', error)
    return NextResponse.json(
      { error: 'Falha ao buscar os tomos da biblioteca.' },
      { status: 500 },
    )
  }
}

// POST /api/books
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, author, status, startedAt, notes } = body || {}

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'O título do tomo é obrigatório.' },
        { status: 400 },
      )
    }

    const finalStatus = status === 'finished' ? 'finished' : 'reading'

    const book = await db.book.create({
      data: {
        title: title.trim(),
        author: author?.trim() ? author.trim() : null,
        status: finalStatus,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        finishedAt:
          finalStatus === 'finished' ? new Date() : null,
        notes: notes?.trim() ? notes.trim() : null,
      },
    })

    return NextResponse.json({ book }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/books]', error)
    return NextResponse.json(
      { error: 'Não foi possível registrar o tomo.' },
      { status: 500 },
    )
  }
}
