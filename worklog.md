---
Task ID: 1
Agent: Z.ai Code (main)
Task: Criar site de biblioteca monástica medieval com animações ricas, registro de tomos (em leitura e concluídos), banco de dados local (SQLite via Prisma, sem Neon/Supabase), log de leituras com datas, e estatísticas (total, ano, mês, em leitura, média de dias, atividade mensal).

Work Log:
- Lido o scaffold do projeto (Next.js 16 + Prisma + shadcn/ui + framer-motion já instalados).
- Definido o modelo `Book` em `prisma/schema.prisma` com campos: id, title, author, status (reading|finished), startedAt, finishedAt, notes, createdAt, updatedAt + índices em status e finishedAt.
- Executado `bun run db:push` para sincronizar o schema com o SQLite local (`db/custom.db`).
- Criadas API routes:
  - `src/app/api/books/route.ts` — GET (lista, filtro por status) e POST (cria).
  - `src/app/api/books/[id]/route.ts` — PATCH (atualiza, incluindo transição de status finished/reading com finishedAt) e DELETE.
  - `src/app/api/stats/route.ts` — GET com totalFinished, thisYear, thisMonth, currentlyReading, avgReadingDays, monthlyActivity (array de 12 posições).
- Criado hook `src/hooks/use-library.ts` que gerencia estado de books+stats, com refresh automático após cada mutação.
- Criado utilitário `src/lib/dates.ts` com formatação em pt-BR (datas completas, curtas, mês/ano, relativas, duração de leitura).
- Atualizado `src/app/layout.tsx` com fontes medievais do Google: Cinzel (display), EB Garamond (corpo), UnifrakturMaguntia (gótico); metadados em pt-BR com título "Scriptorium — Biblioteca Monástica".
- Reescrito `src/app/globals.css` com tema monástico completo: paleta pergaminho/madeira escura/dourado/carmesim, texturas (parchment, wood-panel, book-spine), scrollbar estilizada, e keyframes (candle-flicker, flame-glow, dust-rise, wax-pulse, gold-shimmer, parchment-unfurl, fade-rise) com suporte a prefers-reduced-motion.
- Criados componentes temáticos em `src/components/monastery/`:
  - `dust-particles.tsx` — partículas de poeira dourada flutuando.
  - `candle-glow.tsx` — vela com chama tremulante e halo de luz.
  - `wax-seal.tsx` — selo de cera com pulso, 4 variantes de cor (crimson/gold/moss/wine).
  - `ornate-divider.tsx` — divisor ornamental com símbolos (diamond/cross/fleur/star).
  - `parchment-card.tsx` — wrapper de pergaminho com animação de "desenrolar".
  - `monastery-emblem.tsx` — escudo SVG com cruz, livro aberto e raios.
  - `tome-card.tsx` — card de livro com lombada encadernada colorida, datas, duração, notas expansíveis, ações (selar concluído/reabrir/editar/remover com AlertDialog).
  - `add-book-form.tsx` — formulário em pergaminho (título, autor, data início, switch "já concluí", notas).
- Construída `src/app/page.tsx` orquestrando: DustParticles + velas nos cantos, header com emblema + título gótico "Scriptorium" + lema em latim, painel de estatísticas com 5 WaxSeals + gráfico de atividade mensal, formulário de registro, seção "Em Leitura", "Crônica de Leituras" agrupada por mês/ano (timeline), e footer sticky (mt-auto).
- Corrigido erro de lint no `ornate-divider.tsx` (componente criado durante render → extraído para função `DividerSymbol`).
- `bun run lint` passou sem erros.
- Verificação com Agent Browser:
  - Página carrega com título "Scriptorium — Biblioteca Monástica".
  - Adicionar livro via formulário → aparece em "Em Leitura" + toast de confirmação.
  - "Selar como concluído" → livro migra para "Crônica de Leituras" sob cabeçalho do mês correto + toast.
  - Estatísticas atualizam em tempo real (Total Lidos, Em 2026, mês atual, Em Leitura, Dias/Tomo).
  - Delete com AlertDialog de confirmação funcionando.
  - Estrutura de sticky footer validada (wrapper min-h-screen flex flex-col + footer mt-auto).
  - Sem erros no console; todas as rotas API retornam 200.
  - VLM avaliou o screenshot final como "design excelente e altamente coeso", confirmando tema medieval, atmosfera de vela, e elementos animados visíveis.
- Populados 5 livros de demonstração (1 em leitura + 4 concluídos em meses/anos diferentes) via API para mostrar o agrupamento e o gráfico de atividade.

Stage Summary:
- Aplicação completa e funcional de biblioteca monástica medieval, single-page em `/`.
- Banco SQLite local via Prisma (sem dependência de Neon/Supabase/Redis).
- Animações ricas: poeira flutuante, velas tremulantes, selos de cera pulsantes, pergaminho desenrolando, transições Framer Motion em cards/seções.
- Funcionalidades: adicionar tomo (em leitura ou já concluído), marcar como concluído (registra finishedAt), reabrir leitura, editar, remover (com confirmação).
- Estatísticas: total lidos, no ano, no mês, em leitura, média de dias por tomo, e gráfico de atividade mensal do ano corrente.
- Crônica de leituras agrupada por mês/ano, com datas de início, conclusão, duração e tempo relativo.
- Footer sticky validado; design responsivo (mobile 390px e desktop 1440px verificados).
- Artefatos: schema prisma, 3 API routes, hook use-library, 8 componentes monastery, página única, tema CSS completo.
