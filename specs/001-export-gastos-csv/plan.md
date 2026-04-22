# Implementation Plan: Exportar Gastos do Mês em CSV

**Branch**: `001-export-gastos-csv` | **Date**: 2026-04-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-export-gastos-csv/spec.md`

## Summary

Adicionar exportação de gastos mensais em CSV gerada no frontend, respeitando os filtros
ativos no momento da exportação. Os dados já estão carregados no estado React — a feature
é uma transformação síncrona sem novo endpoint no backend.

## Technical Context

**Language/Version**: TypeScript (React 19) + C# .NET 10 — apenas frontend será modificado
**Primary Dependencies**: React 19, Vite — sem novas dependências externas
**Storage**: SQLite via Entity Framework Core — sem alterações
**Testing**: N/A — não solicitado na spec
**Target Platform**: Web browser (desktop e mobile)
**Project Type**: Web application fullstack — modificação exclusiva no `frontend/`
**Performance Goals**: Download em menos de 3 segundos para até 500 registros
**Constraints**: Sem novo endpoint backend; sem novas dependências npm; CSV gerado via
  Blob API nativa do browser
**Scale/Scope**: Aplicação de uso pessoal, single user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Observação |
|-----------|--------|------------|
| I. API-First Design | ✅ PASS | Nenhuma lógica de negócio no frontend — CSV é formatação de dados já validados pela API |
| II. Simplicity First | ✅ PASS | Função utilitária pura ~30 linhas, sem bibliotecas externas |
| III. Frontend/Backend Separation | ✅ PASS | Nenhuma alteração no backend; frontend continua consumindo apenas a API REST |
| IV. Data Integrity | ✅ PASS | Feature apenas lê dados existentes; não altera nenhum registro |
| V. Deployment Parity | ✅ PASS | Mudança puramente frontend; nenhuma variável de ambiente nova |

**Resultado: APROVADO — sem violações.**

## Project Structure

### Documentation (this feature)

```text
specs/001-export-gastos-csv/
├── plan.md              # Este arquivo
├── research.md          # Decisões técnicas (Phase 0)
├── data-model.md        # Schema CSV e campos exportados (Phase 1)
├── contracts/
│   └── api-expenses.md  # Contrato do endpoint e do componente (Phase 1)
└── tasks.md             # Gerado pelo /speckit-tasks
```

### Source Code (modificações)

```text
frontend/src/
├── utils/
│   └── exportCsv.ts      # NOVO — função pura: Expense[] → Blob + aciona download
├── components/
│   └── ExportButton.tsx  # NOVO — botão de exportação
└── App.tsx               # MODIFICADO — integrar ExportButton com expenses + currentMonth
```

**Structure Decision**: Apenas `frontend/` é modificado. A função utilitária fica em
`frontend/src/utils/` (ao lado do `utils.ts` existente) e o componente em
`frontend/src/components/` (novo diretório).

## Complexity Tracking

> Nenhuma violação de constituição identificada. Tabela não aplicável.
