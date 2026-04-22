# Research: Exportar Gastos do Mês em CSV

**Feature**: 001-export-gastos-csv
**Date**: 2026-04-21

---

## Decision 1: Geração de CSV no Frontend vs. Backend

**Decision**: Geração no frontend, sem novo endpoint no backend.

**Rationale**: Os dados já estão carregados na tela de listagem (fetch já realizado com filtros
aplicados). Gerar o CSV no frontend elimina uma chamada extra ao servidor, simplifica a
implementação e está alinhado ao Princípio II (Simplicity First) da constituição.
Nenhuma lógica de negócio nova é introduzida — é apenas uma transformação de dados já
presentes no estado React.

**Alternatives considered**:
- Novo endpoint `GET /api/expenses/export?month=...` retornando `text/csv` — rejeitado por
  ser desnecessariamente complexo para uma operação puramente de formatação de dados já
  carregados.

---

## Decision 2: Biblioteca para geração de CSV

**Decision**: Sem dependência externa. Função utilitária TypeScript pura.

**Rationale**: A geração de CSV para este caso é trivial — escapa campos com vírgulas/aspas,
une com `\n`. Uma função de ~30 linhas cobre todos os requisitos (FR-002 a FR-008). Adicionar
uma biblioteca (como `papaparse`) para esta tarefa viola o Princípio II (YAGNI).

**Alternatives considered**:
- `papaparse` — robusto, mas superdimensionado para exportação simples sem parsing.
- `xlsx` — para formato Excel nativo, fora do escopo (spec define CSV apenas).

---

## Decision 3: Encoding e compatibilidade com Excel

**Decision**: UTF-8 com BOM (`﻿`) + vírgula como separador.

**Rationale**: Excel no Windows interpreta corretamente arquivos UTF-8 apenas quando o BOM
está presente. Sem o BOM, caracteres especiais (acentos, cedilha) aparecem corrompidos.
O BOM é adicionado como prefixo do Blob antes de criar a URL de download.

**Alternatives considered**:
- `windows-1252` encoding — rejeitado por não ser suportado nativamente no browser sem
  biblioteca adicional e por perder compatibilidade com Google Sheets e LibreOffice.
- Ponto-e-vírgula como separador — algumas localidades usam `;` (Excel PT-BR),
  mas vírgula é o padrão RFC 4180 e funciona em todas as ferramentas. Excel detecta
  automaticamente via BOM + formato UTF-8.

---

## Decision 4: Mecanismo de download no browser

**Decision**: Criar `Blob` → `URL.createObjectURL` → `<a download>` programático → revogar URL.

**Rationale**: Padrão amplamente suportado (todos os browsers modernos), sem dependências,
e compatível com mobile (Safari iOS, Chrome Android). A URL do blob é revogada após o clique
para evitar vazamento de memória.

**Alternatives considered**:
- `data:` URI — limitado a ~2MB em alguns browsers; blob URL é mais robusto.
- `window.open` — não garante download em todos os browsers mobile.

---

## Decision 5: Posicionamento do botão de exportação

**Decision**: Botão "Exportar CSV" posicionado junto aos controles de filtro/cabeçalho da
listagem de gastos.

**Rationale**: Proximidade com os filtros reforça visualmente que a exportação respeita os
filtros ativos (FR-004). Não requer nova tela ou modal.

---

## Summary: Approach Final

```
Frontend (TypeScript)
├── src/utils/exportCsv.ts     — função pura: Expense[] → Blob CSV
└── src/components/ExportButton.tsx — botão que chama a utility e aciona download
```

Integração: o componente existente de listagem passa o array de despesas já carregado
(com filtros aplicados) para o `ExportButton`, junto ao mês de referência para nomear o arquivo.

Nenhuma alteração no backend. Nenhuma nova dependência.
