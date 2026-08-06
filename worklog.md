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

---
Task ID: 2
Agent: Z.ai Code (main)
Task: Adicionar animações e efeitos visuais de livros sendo adicionados à estante ou retirados, e os que estão em leitura sendo empilhados em uma mesa à frente da estante.

Work Log:
- Lido o worklog da Task 1 para entender o estado atual (biblioteca monástica funcional com estatísticas, formulário, crônica e cards).
- Criado utilitário compartilhado `src/lib/book-colors.ts` com: spineColorFor, spineHighlightFor, spineShadowFor (gradientes de lombada), spineTiltFor (rotação pseudo-aleatória estável), spineHeightFor e spineWidthFor (dimensões variadas realistas).
- Criado componente `src/components/monastery/book-shelf.tsx`:
  - Estante de madeira com cornija ornamental e múltiplas prateleiras (9 tomos por prateleira).
  - Cada lombada (ShelfSpine) é um motion.button com gradiente de couro, filetes dourados duplos, título vertical (writing-mode: vertical-rl), hover com "pull-out" (y: -10 + brilho).
  - Animações: initial (cai de cima com scaleY) + exit (sobe e encolhe) via AnimatePresence popLayout.
  - Cada prateleira tem fundo recessado com sombra interna + tábua de madeira com veios.
  - Estado vazio com ícone e mensagem "A estante aguarda...".
- Criado componente `src/components/monastery/reading-desk.tsx`:
  - Mesa de leitor com tampo em perspectiva (perspective + rotateX), pés/cavaletes decorativos, sombra no chão.
  - Pilha de tomos deitados (DeskBook): cada tomo tem lombada colorida à esquerda, capa com título, páginas listradas à direita, rotação leve natural.
  - Animação de entrada: tomo cai do topo (y: -180 → 0) com spring/bounce; o tomo do topo quica mais.
  - Animação de saída: tomo sobe e some (y: -120, opacity 0) — sugere "voar para a estante".
  - Marcador de página (fita carmesim) no tomo do topo da pilha.
  - AnimatePresence popLayout + layout prop para reorganização suave quando o meio da pilha muda.
- Adicionadas classes CSS em `src/app/globals.css`: .bookshelf (fundo de madeira com veios), .shelf-cornice (cornija com ornamentos ::before/::after), .reading-desk (perspective), .desk-top (tampo em rotateX com veios).
- Atualizado `src/app/page.tsx`:
  - Adicionada seção visual "O Scriptório" entre o header e as estatísticas: estante de fundo + mesa de leitor sobreposta em um wood-panel, com luz de vela decorativa.
  - Adicionado estado `highlightId` e handler `focusTome(id)` que faz scrollIntoView no card detalhado + destaca com ring-gold por 1.8s.
  - Passado `highlighted` prop para todos os TomeCards (Em Leitura e Crônica).
  - Import de useCallback/useState corrigido (havia duplicação de useMemo que causou erro de build inicial).
- Atualizado `src/components/monastery/tome-card.tsx`:
  - Adicionada prop `highlighted` que aplica ring-2 ring-gold + glow shadow + scale 1.01 via animate condicional.
  - Adicionado `id={`tome-${book.id}`}` para âncora de scroll e classe `scroll-mt-24` para offset.
- Corrigido bug de hidratação em `src/components/monastery/dust-particles.tsx`: partículas com Math.random() eram geradas no useMemo durante SSR, divergindo do cliente. Movido para useState + useEffect (geração apenas no cliente após montagem).
- `bun run lint` passou sem erros.
- Verificação com Agent Browser (todas as animações testadas):
  - Página carrega sem erros de console/hidratação.
  - Adicionar livro em leitura → tomo cai na pilha da mesa (animate drop com bounce).
  - "Selar como concluído" → tomo sai da mesa (sobe e some) e lombada entra na estante (animate enter).
  - "Reabrir leitura" → lombada sai da estante e tomo volta a cair na mesa.
  - Remover → tomo desaparece com animação de exit.
  - Clicar numa lombada da estante → rola até o card detalhado e destaca com ring-gold (verificado hasRing:true).
  - Clicar num tomo da mesa → mesma interação de destaque.
  - Responsivo: testado em 390px (mobile) e 1440px (desktop) sem erros.
  - VLM confirmou: estante com lombadas coloridas + filetes dourados + títulos verticais visíveis; mesa com pilha de tomos deitados; atmosfera medieval coerente.

Stage Summary:
- Cena física do scriptório implementada: estante de prateleiras (concluídos) + mesa de leitor à frente (em leitura, com pilha de tomos).
- Animações de adicionar/remover/selar/reabrir com framer-motion (spring, bounce, layout animations, AnimatePresence popLayout).
- Interação: clicar em lombada da estante ou tomo da mesa rola até o card detalhado e o destaca.
- Bug de hidratação (Math.random no SSR) corrigido.
- Artefatos novos: book-colors.ts, book-shelf.tsx, reading-desk.tsx; atualizações em page.tsx, tome-card.tsx, dust-particles.tsx, globals.css.

---
Task ID: 3
Agent: Z.ai Code (main)
Task: Corrigir erro de hidratação no <body> causado por extensão do navegador (atributos bis_status, bis_frame_id, __processed_* injetados antes do React hidratar).

Work Log:
- Diagnosticado o erro: o diff de hidratação mostrava atributos como `bis_status="ok"`, `bis_frame_id="766"`, `__processed_0b912ab0-...="true"` sendo adicionados ao <body> por uma extensão do navegador ANTES da hidratação do React. A própria mensagem do React indica essa causa: "It can also happen if the client has a browser extension installed which messes with the HTML before React loaded." Não era um bug do código da aplicação.
- O <html> já tinha suppressHydrationWarning, mas o <body> não. Adicionado `suppressHydrationWarning` ao <body> em src/app/layout.tsx para silenciar divergências de atributos causadas por extensões.
- O lint (React 19, regra react-hooks/set-state-in-effect) passou a acusar a correção anterior de hidratação do DustParticles (setState síncrono em useEffect). Refatorado dust-particles.tsx para usar `useSyncExternalStore` — a forma canônica de ler dados que diferem entre servidor e cliente sem mismatch de hidratação:
  - Snapshot do servidor: lista vazia.
  - Snapshot do cliente: partículas geradas com Math.random() (com cache por contagem).
  - Subscribe vazio (dados estáticos após geração).
- `bun run lint` passou sem erros.
- Verificação com Agent Browser: página carrega, **console 100% limpo** (nenhum error/warning/hydration), e a cena visual (estante + mesa) continua renderizando corretamente (4 lombadas na estante + 1 tomo na mesa).

Stage Summary:
- Erro de hidratação do <body> resolvido com suppressHydrationWarning (causa: extensão do navegador, não código da app).
- DustParticles refatorado para useSyncExternalStore (compatível com React 19 strict hooks).
- Console do navegador limpo; funcionalidade preservada.

---
Task ID: 4
Agent: Z.ai Code (main)
Task: Adicionar background 3D de mosteiro (luz e vento entrando por janelas medievais), música ambient bardcore de fundo e outros efeitos de ambiente.

Work Log:
- Adicionados keyframes e classes CSS em globals.css para a cena 3D: god-ray-sway (luz tremulando), window-glow (brilho dos vitrais), bell-sway (sino balançando), smoke-rise (fumaça de incenso em espiral), wind-gust (rajadas), star-twinkle (estrelas), cloud-drift (nuvens diante da lua), bird-fly (pássaros). Classes utilitárias: .monastery-scene (perspective), .monastery-layer (preserve-3d), .stone-floor, .wooden-ceiling, .stone-pillar.
- Criado componente `src/components/monastery/monastery-scene.tsx` — cena 3D em camadas (CSS transforms + perspective, sem WebGL):
  - Camada fundo (z=-400): céu noturno com gradiente, lua brilhante com halo, 40 estrelas cintilantes, nuvem passando diante da lua.
  - Camada janelas (z=-250): 3 janelas arqueadas com moldura de pedra, vitral âmbar brilhante com bordas em chumbo (padrão diagonal) e cruz central.
  - Camada god rays (z=-200): 3 raios de luz volumétrica diagonal descendo das janelas, com mixBlendMode screen, tremulando (animate-god-ray).
  - Camada pilares (z=-120): 2 pilares de pedra laterais com capitéis.
  - Camada campanário (z=-80): estrutura com sino dourado balançando (animate-bell-sway).
  - Camada teto (z=-60): vigas de madeira em perspective rotateX.
  - Camada chão (z=-30): pedra em perspective rotateX.
  - Incensário pendurado com brasa brilhante e 5 partículas de fumaça subindo em espiral.
  - 2 pássaros atravessando a cena ocasionalmente (animate-bird-fly).
  - Vinheta global sutil para atmosfera.
- Criado hook `src/hooks/use-client-only.ts` com useSyncExternalStore para gerar dados aleatórios (estrelas, fumaça) apenas no cliente, evitando mismatch de hidratação.
- Criado componente `src/components/monastery/ambient-sound.tsx` — trilha ambient bardcore PROCEDURAL via Web Audio API (sem arquivos externos, 100% royalty-free):
  - Drone de organum: 3 osciladores sine (D2 + A2 + D3) com detune leve e lowpass, evocando canto gregoriano.
  - Sopro de vento: ruído branco filtrado (bandpass) com 2 LFOs modulando frequência (rajadas) e amplitude.
  - Arpejos de harpa: osciladores triangle em escala dórica de Ré, com envelope ADSR e delay/feedback para eco, em intervalos aleatórios (1.8-4.4s).
  - Sino de mosteiro: síntese FM (carrier sine + modulator na razão 2.76), a cada 18-40s.
  - Master gain com fade in/out (2s / 0.6s) para evitar clicks.
  - Botão flutuante (fixed bottom-right) com ícone Music/Music2, anel pulsante quando tocando, aria-pressed para acessibilidade.
  - Inicia apenas após interação do usuário (política de autoplay dos browsers).
  - Limpeza completa de osciladores/timers no unmount.
- Integrado no page.tsx: MonasteryScene como background fixo (z-0), AmbientSound como botão flutuante (z-50), velas movidas para z-[1] para não conflitar.
- Ajustes de visibilidade após primeira análise VLM: aumentado brilho das janelas (opacidade 0.92-0.98, boxShadow duplo), god rays mais intensos (0.6 + mixBlendMode screen), lua maior e mais brilhante (80px, halo 160px, boxShadow triplo), vinheta mais suave (0.25/0.5 ao invés de 0.35/0.6).
- `bun run lint` passou sem erros.
- Verificação com Agent Browser:
  - Console 100% limpo (sem erros, warnings ou hydration mismatch).
  - Cena 3D renderiza: VLM confirmou "três janelas góticas iluminadas (vitrais âmbar), god rays descendo, estrelas, velas, colunas laterais" e "conteúdo principal perfeitamente legível".
  - Botão de música: toggle on/off/on testado — aria-pressed muda false→true→false→true, label muda "Tocar"→"Silenciar", sem erros de áudio no console.
  - Funcionalidade principal preservada: adicionar livro → cai na mesa + toast.
  - Responsivo: mobile (390px) e desktop (1440px) sem erros.

Stage Summary:
- Background 3D de mosteiro implementado em CSS 3D (camadas em perspectiva): janelas arqueadas com vitrais, god rays volumétricos, pilares, teto de vigas, chão de pedra, campanário com sino, incensário com fumaça, lua + estrelas + nuvens, pássaros.
- Música ambient bardcore procedural (Web Audio API): drone organum + vento + harpa dórica + sino FM, com toggle mute/unmute.
- Hook useClientOnly (useSyncExternalStore) resolve hydration mismatch de Math.random.
- Artefatos novos: monastery-scene.tsx, ambient-sound.tsx, use-client-only.ts; atualizações em page.tsx e globals.css.

---
Task ID: 5
Agent: Z.ai Code (main)
Task: Aprimorar a experiência, UI e design da mesa do leitor (em leitura) — torná-la uma verdadeira mesa de scriptorium com livro aberto sobre púlpito, pilha de tomos fechados detalhados e acessórios de mosteiro.

Work Log:
- Lido worklog anterior e o reading-desk.tsx atual (pilha simples de tomos deitados sem hero visual).
- Adicionados keyframes em globals.css: page-flutter (páginas fluttering), lectern-glow (halo do púlpito), candle-pool (pool de luz da vela), quill-sway (pena balançando), sand-fall (areia da ampulheta), ink-shimmer (brilho da tinta), ribbon-sway (fita marcadora), desk-mote (poeira da mesa).
- Reescrito completamente `src/components/monastery/reading-desk.tsx`:
  - **Púlpito (lectern)**: sustenta o tomo em leitura ATIVA (books[0]) mostrado como LIVRO ABERTO com duas páginas de pergaminho.
  - **OpenBook**: duas páginas (esquerda + direita) com textura de pergaminho envelhecido, manchas, linhas pautadas, borda decorativa interna, lombada central (gutter), bordas douradas (gold leaf), fita marcadora pendente (animate-ribbon-sway), capa de trás visível na cor do couro.
    - Página esquerda: ornamento superior, drop cap (capitular iluminada em fonte gótica) + título em caligrafia + autor em itálico + linhas gregas de manuscrito.
    - Página direita: data de início, dias de leitura (em numeral gótico), linhas gregas, pequeno selo de cera.
    - Animações: entrada (rotateX/scale spring), saída (sobe e some), hover (brilho).
  - **EmptyOpenBook**: livro aberto vazio com "A mesa aguarda um tomo aberto" e pena ícone.
  - **LecternStand**: duas pernas anguladas de madeira sustentando o púlpito.
  - **PileOfBooks + ClosedBook**: pilha de tomos fechados (books.slice(1)) com lombada colorida, capa, páginas, cantos de metal (cantoneiras douradas), filete dourado, fita marcadora no topo. Animações spring/bounce de entrada/saída.
  - **DeskCandle**: vela alta em castiçal de latão com chama tremulante (núcleo brilhante), gotejamento de cera, pool de luz animado.
  - **InkwellWithQuill**: tinteiro de vidro (maior) com tinta brilhante (animate-ink-shimmer), abertura, reflexos, e pena de ganso SVG detalhada (pluma com barbas) balançando (animate-quill-sway).
  - **Hourglass**: ampulheta em moldura de madeira com colunas, duas ampolas (clip-path), areia no topo + monte no fundo + fio caindo (sand-fall animation), reflexo no vidro.
  - **DeskDust**: 14 partículas de poeira dourada flutuando na zona da mesa (useClientOnly para evitar hydration mismatch).
  - **Mesa**: tampo em perspectiva (desk-top), borda frontal 3D, sombra no chão, runner de veludo sob os objetos.
- Layout da superfície: grid responsivo (2 colunas no mobile, 4 no desktop) com acessórios bem espaçados e centralizados em cada célula.
- Atualizado ScriptoriumScene no page.tsx: painel mais largo (max-w-3xl), moldura com gradiente radial e border-gold, cabeçalho com dois BookOpen espelhados, texto contextual "O tomo aberto no púlpito é a leitura ativa; os demais aguardam na pilha."
- Primeira análise VLM revelou acessórios pequenos/comprimidos. Ajustes: aumentei todos os acessórios (vela h-14, tinteiro h-12, ampulheta h-20, pilha thickness 20px width 150px+), mudei layout de flex-wrap para grid de 4 colunas, dei altura mínima de 130px aos containers.
- `bun run lint` passou sem erros.
- Verificação com Agent Browser:
  - Console 100% limpo.
  - VLM confirmou TODOS os elementos visíveis e bem proporcionados: "livro aberto no topo, pilha de livros fechados com lombadas coloridas, vela com castiçal, tinteiro com pena de ganso, ampulheta com areia... bem espaçados, sem compressão/corte, atmosfera medieval imersiva".
  - Fluxo testado: adicionar novo livro → vira livro ABERTO no púlpito (leitura ativa), livros anteriores descem para a pilha.
  - Selar livro ativo → sai do púlpito (animado), vai para a estante; próximo da pilha sobe para o púlpito.
  - Mobile (390px): grid 2 colunas, sem cortes problemáticos, legível.

Stage Summary:
- Mesa do leitor transformada em scriptorium completo: púlpito com livro aberto (hero), pilha de tomos fechados detalhados, acessórios (vela em castiçal, tinteiro com pena de ganso, ampulheta).
- Livro aberto mostra título/autor/datas em caligrafia sobre pergaminho envelhecido com drop cap iluminada.
- Animações ricas: flutter de páginas, halo do púlpito, pool de luz da vela, pena balançando, areia caindo, brilho da tinta, fita marcadora, poeira flutuante.
- Transições animadas: adicionar → livro cai no púlpito; selar → livro aberto voa para a estante e próximo da pilha sobe.
- Responsivo (mobile 2 colunas, desktop 4 colunas); console limpo.

---
Task ID: 6
Agent: Z.ai Code (main)
Task: Repassar o projeto para deploy no Vercel com Supabase — mudar Prisma de SQLite para PostgreSQL, garantir que só definir DATABASE_URL no Vercel faça tudo funcionar.

Work Log:
- Diagnosticado o erro 500 no Vercel: `Can't reach database server at db.xxx.supabase.co:5432` — o schema Prisma estava com `provider = "sqlite"`, mas o Supabase é PostgreSQL. O Prisma não consegue usar uma connection string Postgres com provider sqlite (e vice-versa).
- Atualizado `prisma/schema.prisma`:
  - `provider = "sqlite"` → `provider = "postgresql"`
  - Adicionado `directUrl = env("DATABASE_URL")` (uma única variável serve para runtime E migrations/push).
- Atualizado `package.json`:
  - Adicionado `"postinstall": "prisma generate"` — garante que o client Prisma seja gerado no Vercel após `bun install` (crítico para o build serverless).
  - Simplificado `"build"`: removidos os `cp -r .next/static .next/standalone/...` (eram para self-hosting standalone; no Vercel são desnecessários e poderiam falhar). Agora: `"prisma generate && next build"`.
- Atualizado `.env` com placeholder da connection string Supabase (direta, porta 5432) e comentários explicando as duas opções (direta vs pooler).
- Criado `.env.example` com formato documentado (sem credenciais reais) para servir de referência no GitHub.
- Ajustado `.gitignore`: `.env*` continua ignorado, mas adicionado `!.env.example` para que o arquivo de exemplo seja commitado.
- Executado `bun run db:generate` — client Prisma gerado com sucesso para provider postgresql.
- `bun run lint` passou sem erros.
- Verificado com Agent Browser: a UI continua renderizando normalmente (o dev server local ainda usa o client SQLite em cache do processo, mas no Vercel o build gerará o client PostgreSQL correto).

Stage Summary:
- Projeto pronto para Vercel + Supabase com UMA variável de ambiente (DATABASE_URL).
- Schema Prisma em PostgreSQL; client gerado automaticamente no build/postinstall.
- Build script limpo e Vercel-friendly.
- .env.example documentado e versionável; .env real continua ignorado.
- Passos de deploy documentados para o usuário (ver mensagem final).

---
Task ID: 7
Agent: Z.ai Code (main)
Task: Diagnosticar e corrigir erro de hidratação reportado ("erro do node") — atributos bis_size injetados por extensão de navegador em todos os divs.

Work Log:
- Lido o arquivo de erro enviado pelo usuário. O diff de hidratação mostrava atributos `bis_size="{...}"` sendo injetados em TODOS os divs da página (metadata wrapper, root div, MonasteryScene, monastery-layer, NightSky, etc.). O prefixo `bis_` é de uma extensão de navegador (Bitdefender TrafficLight ou similar) que mede tamanhos de elementos e injeta atributos antes do React hidratar. A própria mensagem do React cita essa causa: "It can also happen if the client has a browser extension installed which messes with the HTML before React loaded." NÃO é um erro do Node nem do código da aplicação.
- Embora o erro principal seja da extensão, aproveitei para auditar o código em busca de fontes REAIS de mismatch de hidratação (new Date() / Math.random() no caminho de renderização). Encontrei e corrigi:
  1. **add-book-form.tsx**: `todayISO()` (com `new Date()`) era chamado no `useState` inicial → o valor do input de data poderia diferir entre servidor e cliente em timezones diferentes. Corrigido com `useClientOnly('add-book-today', todayISO, '')` + `useEffect` que preenche o campo quando a data do cliente chega.
  2. **reading-desk.tsx (PageRightContent)**: `new Date().toISOString()` no cálculo de "dias de leitura" → servidor e cliente poderiam computar dias diferentes em boundary de timezone. Corrigido com `useClientOnly('desk-now', () => new Date().toISOString(), book.startedAt)` (no SSR usa startedAt como fallback, dando 0 dias; no cliente usa o agora real).
  3. **page.tsx (footer)**: `new Date().getFullYear()` em "Anno Domini {ano}" → adicionado `suppressHydrationWarning` no <p>.
  4. **page.tsx (StatsPanel)**: `new Date().getFullYear()` e `new Date().getMonth()` em labels de WaxSeal e MonthlyActivity → extraído para `useClientOnly('stats-now', ...)` retornando {year, month}; passado como props para MonthlyActivity.
- `bun run lint` passou sem erros.
- Verificação com Agent Browser: console limpo (sem erros além dos artefatos `bis_` da extensão), página renderiza normalmente, campo de data populado corretamente (2026-08-06), todos os tomos visíveis.

Stage Summary:
- Erro de hidratação `bis_size` diagnosticado como artefato de extensão de navegador (não é bug do código, não afeta produção no Vercel).
- Corrigidas fontes reais de mismatch de hidratação: todayISO no formulário, dias de leitura no púlpito, ano/mês nas estatísticas.
- Código agora impecável quanto a hidratação; qualquer aviso restante no dev console é exclusivamente da extensão do navegador do usuário.
