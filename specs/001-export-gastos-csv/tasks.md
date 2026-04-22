---
description: "Task list for: Exportar Gastos do Mês em CSV"
---

# Tasks: Exportar Gastos do Mês em CSV

**Input**: Design documents from `specs/001-export-gastos-csv/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/ ✅, research.md ✅

**Tests**: Não solicitados na especificação — omitidos.

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a tarefa pertence (US1, US2)
- Caminhos de arquivo absolutos a partir da raiz do repositório

---

## Phase 1: Setup

**Purpose**: Nenhuma tarefa de setup necessária — projeto React+Vite já configurado, sem
novas dependências nem alterações de configuração.

*(Fase vazia — prosseguir direto para Foundational)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Função utilitária de geração de CSV — bloqueante para todas as user stories.

**⚠️ CRITICAL**: Nenhuma user story pode ser implementada antes desta fase.

- [x] T001 Create `frontend/src/utils/exportCsv.ts` — função pura `exportToCsv(expenses: Expense[], referenceMonth: string): void` que: (1) serializa os campos Description, Amount, Category, DueDate, ReferenceMonth, Status, PaymentMethod, Notes no formato CSV com cabeçalho em português; (2) formata Amount com `toFixed(2)`, DueDate como `DD/MM/YYYY`, status `paid`→`"Pago"` / `pending`→`"Pendente"`; (3) escapa campos com vírgula ou aspas (RFC 4180); (4) adiciona `sep=,` como primeira linha do conteúdo (antes do cabeçalho) para compatibilidade com Excel PT-BR; (5) cria Blob UTF-8 com BOM (`﻿`); (6) aciona download via `URL.createObjectURL` + `<a download>` + `revokeObjectURL`; (7) nomeia o arquivo `gastos-{referenceMonth}.csv`

**Checkpoint**: Função utilitária pronta e testável isoladamente — user stories podem começar.

---

## Phase 3: User Story 1 — Exportar todos os gastos do mês (Priority: P1) 🎯 MVP

**Goal**: O usuário clica em "Exportar CSV" e recebe o download do arquivo com todos os
gastos do mês atual.

**Independent Test**: Acessar qualquer mês com gastos cadastrados → clicar no botão
"Exportar CSV" → verificar que o browser inicia download de `gastos-YYYY-MM.csv` com
cabeçalho e uma linha por gasto.

### Implementation for User Story 1

- [x] T002 [P] [US1] Create `frontend/src/components/ExportButton.tsx` — componente com props `{ expenses: Expense[], referenceMonth: string }` que chama `exportToCsv` ao clique; botão sempre habilitado (inclusive com lista vazia — nesse caso exporta arquivo com apenas o cabeçalho, conforme spec US1 Cenário 2); (depende T001)
- [x] T003 [US1] Integrate `ExportButton` in `frontend/src/App.tsx` — importar e renderizar `<ExportButton expenses={expenses} referenceMonth={currentMonth} />` próximo ao cabeçalho da listagem; `expenses` aqui é o array já carregado da API (depende T002)

**Checkpoint**: User Story 1 completamente funcional — download acontece ao clicar no botão.

---

## Phase 4: User Story 2 — Exportar com filtros aplicados (Priority: P2)

**Goal**: Quando filtros de categoria e/ou status estão ativos, o CSV exportado contém
apenas os registros visíveis na tela.

**Independent Test**: Aplicar filtro "Categoria: Alimentação" → clicar "Exportar CSV" →
abrir o arquivo e confirmar que contém somente gastos de Alimentação.

### Implementation for User Story 2

- [x] T004 [US2] Update `frontend/src/App.tsx` — garantir que `ExportButton` recebe o array `expenses` já filtrado (pós-aplicação dos filtros de categoria, status e busca), não a lista bruta da API; verificar que a mesma variável de estado usada para renderizar a listagem é passada ao `ExportButton` (depende T003)

**Checkpoint**: User Stories 1 e 2 funcionando — exportação com e sem filtros validada.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes visuais e de UX que afetam ambas as user stories.

- [x] T005 [P] Update `frontend/src/styles.css` — adicionar estilos para o botão ExportButton consistentes com o design atual da aplicação (botão outline ou secondary)
- [ ] T006 [P] [ACCEPTANCE] Manual validation — abrir `gastos-YYYY-MM.csv` no Excel (Windows), Google Sheets e LibreOffice Calc; confirmar: (1) encoding correto sem caracteres corrompidos, (2) colunas separadas corretamente, (3) datas no formato DD/MM/YYYY, (4) download inicia em menos de 3 segundos para um mês com muitos gastos (SC-001)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: Nenhuma dependência — começar imediatamente
- **User Story 1 (Phase 3)**: Depende de T001 (função utilitária)
- **User Story 2 (Phase 4)**: Depende de T003 (integração em App.tsx)
- **Polish (Phase 5)**: Depende de T003 (componente integrado)

### Within Each User Story

- T001 antes de T002 (ExportButton importa exportToCsv)
- T002 antes de T003 (App.tsx importa ExportButton)
- T003 antes de T004 (T004 ajusta o que T003 fez)

### Parallel Opportunities

- T002 pode começar assim que T001 estiver completo
- T005 e T006 são independentes entre si (podem rodar em paralelo na fase Polish)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar T001 (função CSV)
2. Completar T002 (botão)
3. Completar T003 (integração)
4. **PARAR e VALIDAR**: baixar CSV, abrir no Excel, confirmar dados corretos
5. Se validado → prosseguir para US2

### Incremental Delivery

1. T001 → T002 → T003: MVP funcional (US1)
2. T004: Filtros respeitados (US2)
3. T005 → T006: Polish final

---

## Notes

- [P] = arquivos diferentes, sem dependências entre si
- T004 pode ser trivial se App.tsx já passar o array filtrado em T003 — verificar antes de implementar
- Não há novos endpoints no backend; nenhuma alteração em `backend/`
- Não há novas dependências npm; não rodar `npm install`
