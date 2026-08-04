import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats
// Retorna estatísticas da biblioteca monástica:
//  - totalFinished: total de tomos concluídos
//  - thisYear: concluídos no ano atual
//  - thisMonth: concluídos no mês atual
//  - currentlyReading: em leitura ativa
//  - totalBooks: todos os registros
//  - avgReadingDays: média de dias entre início e fim
//  - monthlyActivity: mapa mês -> contagem (ano atual)
export async function GET() {
  try {
    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [allBooks, finished, finishedThisYear, finishedThisMonth, reading] =
      await Promise.all([
        db.book.findMany(),
        db.book.findMany({ where: { status: 'finished' } }),
        db.book.findMany({
          where: {
            status: 'finished',
            finishedAt: { gte: yearStart },
          },
        }),
        db.book.findMany({
          where: {
            status: 'finished',
            finishedAt: { gte: monthStart },
          },
        }),
        db.book.findMany({ where: { status: 'reading' } }),
      ])

    // Tempo médio de leitura (em dias) para os tomos concluídos.
    let avgReadingDays = 0
    if (finished.length > 0) {
      const totalDays = finished.reduce((acc, b) => {
        if (b.startedAt && b.finishedAt) {
          const ms = b.finishedAt.getTime() - b.startedAt.getTime()
          return acc + Math.max(1, ms / (1000 * 60 * 60 * 24))
        }
        return acc
      }, 0)
      avgReadingDays = Math.round((totalDays / finished.length) * 10) / 10
    }

    // Atividade mensal do ano atual (índice 0..11).
    const monthlyActivity = Array.from({ length: 12 }, () => 0)
    finishedThisYear.forEach((b) => {
      if (b.finishedAt) {
        const m = b.finishedAt.getMonth()
        monthlyActivity[m] += 1
      }
    })

    return NextResponse.json({
      totalBooks: allBooks.length,
      totalFinished: finished.length,
      thisYear: finishedThisYear.length,
      thisMonth: finishedThisMonth.length,
      currentlyReading: reading.length,
      avgReadingDays,
      monthlyActivity,
    })
  } catch (error) {
    console.error('[GET /api/stats]', error)
    return NextResponse.json(
      { error: 'Falha ao compilar os pergaminhos de estatística.' },
      { status: 500 },
    )
  }
}
