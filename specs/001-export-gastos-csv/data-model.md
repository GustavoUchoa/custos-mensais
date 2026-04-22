# Data Model: Exportar Gastos do Mês em CSV

**Feature**: 001-export-gastos-csv
**Date**: 2026-04-21

---

## Entidades Envolvidas

Nenhuma nova entidade é introduzida. A feature opera sobre a entidade `Expense` existente.

---

## Expense (existente — leitura apenas)

| Campo           | Tipo       | Obrigatório | Exportado | Coluna CSV             | Formato no CSV        |
|-----------------|------------|-------------|-----------|------------------------|-----------------------|
| `id`            | `Guid`     | Sim         | Não       | —                      | —                     |
| `description`   | `string`   | Sim         | Sim       | `Descrição`            | Texto                 |
| `amount`        | `decimal`  | Sim         | Sim       | `Valor`                | `1500.00`             |
| `category`      | `string`   | Sim         | Sim       | `Categoria`            | Texto                 |
| `dueDate`       | `DateOnly` | Sim         | Sim       | `Vencimento`           | `DD/MM/YYYY`          |
| `referenceMonth`| `string`   | Sim         | Sim       | `Mês de Referência`    | `YYYY-MM`             |
| `status`        | `enum`     | Sim         | Sim       | `Status`               | `Pago` / `Pendente`   |
| `paymentMethod` | `string?`  | Não         | Sim       | `Forma de Pagamento`   | Texto ou vazio        |
| `notes`         | `string?`  | Não         | Sim       | `Observações`          | Texto ou vazio        |
| `createdAt`     | `DateTime` | Sim         | Não       | —                      | —                     |
| `updatedAt`     | `DateTime` | Sim         | Não       | —                      | —                     |

---

## Schema do CSV

**Ordem das colunas** (linha de cabeçalho):
```
Descrição,Valor,Categoria,Vencimento,Mês de Referência,Status,Forma de Pagamento,Observações
```

**Regras de formatação**:
- Primeira linha: `sep=,` (diretiva de separador para compatibilidade com Excel PT-BR)
- Segunda linha: cabeçalho com nomes das colunas em português
- Separador: vírgula (`,`)
- Encoding: UTF-8 com BOM (`﻿`)
- Campos que contêm vírgula, aspas ou quebra de linha DEVEM ser envolvidos em aspas duplas
- Aspas dentro de campos DEVEM ser escapadas dobrando: `"` → `""`
- Quebras de linha (`\n`, `\r\n`) dentro de campos DEVEM ser preservadas dentro das aspas (RFC 4180)
- Linhas do CSV terminadas por `\n`
- `status`: `paid` → `"Pago"`, `pending` → `"Pendente"`
- `amount`: `toFixed(2)` com ponto decimal
- `dueDate`: `DD/MM/YYYY`
- Campos opcionais nulos/undefined: célula vazia (sem texto)

**Nome do arquivo**: `gastos-YYYY-MM.csv` onde `YYYY-MM` é o `referenceMonth` do mês exibido.

---

## Estado e Filtros

A exportação opera sobre o estado React já carregado no componente de listagem:
- `expenses: ExpenseResponse[]` — lista filtrada retornada pela API
- `currentMonth: string` — mês de referência atual (`YYYY-MM`)

Nenhum estado novo é necessário — a exportação é uma operação síncrona derivada do estado existente.
