# Feature Specification: Exportar Gastos do Mês em CSV

**Feature Branch**: `001-export-gastos-csv`
**Created**: 2026-04-21
**Status**: Draft
**Input**: User description: "Quero exportar os gastos do mês em CSV"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exportar todos os gastos do mês (Priority: P1)

O usuário está visualizando os gastos de um determinado mês e deseja baixar um arquivo CSV
com todos os registros daquele mês para análise em planilha (Excel, Google Sheets, etc.).

**Why this priority**: É o caso de uso principal e entrega valor imediato — permite ao usuário
levar os dados para fora da aplicação sem nenhum pré-requisito adicional.

**Independent Test**: O usuário acessa o mês de abril/2026, clica em "Exportar CSV" e recebe
o download de um arquivo `gastos-2026-04.csv` com todos os gastos daquele mês. O arquivo abre
corretamente em uma planilha com colunas legíveis.

**Acceptance Scenarios**:

1. **Given** o usuário está na tela do mês de referência com gastos cadastrados,
   **When** clica no botão "Exportar CSV",
   **Then** o browser inicia o download de um arquivo nomeado `gastos-YYYY-MM.csv`
   contendo todos os gastos do mês com cabeçalho e uma linha por gasto.

2. **Given** o usuário está em um mês sem nenhum gasto cadastrado,
   **When** clica em "Exportar CSV",
   **Then** o download ocorre normalmente e o arquivo contém apenas a linha de cabeçalho.

---

### User Story 2 - Exportar gastos com filtros aplicados (Priority: P2)

O usuário está visualizando gastos filtrados por categoria e/ou status e deseja exportar
apenas os registros visíveis no momento.

**Why this priority**: Aumenta a utilidade da exportação sem exigir nova infraestrutura —
reutiliza os filtros já existentes na tela.

**Independent Test**: O usuário filtra por categoria "Alimentação" e status "Pendente",
depois clica em "Exportar CSV". O arquivo baixado contém somente os gastos que passaram
pelos filtros, não todos os gastos do mês.

**Acceptance Scenarios**:

1. **Given** o usuário aplicou filtro de categoria "Alimentação" e está visualizando
   resultados filtrados,
   **When** clica em "Exportar CSV",
   **Then** o CSV exportado contém apenas os gastos da categoria "Alimentação" daquele mês.

2. **Given** o usuário aplicou filtro de status "Pago",
   **When** clica em "Exportar CSV",
   **Then** o CSV contém apenas os gastos com status "Pago".

---

### Edge Cases

- O que acontece quando o mês não tem gastos? → Exporta apenas o cabeçalho (arquivo válido).
- O que acontece com campos opcionais vazios (PaymentMethod, Notes)? → Células ficam em branco no CSV.
- O que acontece se a exportação falhar? → Uma mensagem de erro é exibida ao usuário.
- Como valores decimais são representados? → Com ponto como separador decimal (ex: `150.00`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o usuário baixe um arquivo CSV com todos os gastos
  do mês de referência selecionado.
- **FR-002**: O CSV MUST conter as seguintes colunas em ordem: Descrição, Valor, Categoria,
  Vencimento, Mês de Referência, Status, Forma de Pagamento, Observações.
- **FR-003**: O nome do arquivo MUST seguir o padrão `gastos-YYYY-MM.csv`, onde `YYYY-MM`
  corresponde ao mês de referência exibido.
- **FR-004**: O sistema MUST aplicar os filtros ativos (categoria, status, busca) na exportação,
  de modo que o CSV reflita exatamente os registros visíveis na tela.
- **FR-005**: Valores monetários MUST ser formatados com 2 casas decimais e ponto como
  separador decimal (ex: `1500.00`).
- **FR-006**: Datas MUST ser formatadas no padrão `DD/MM/YYYY` no arquivo exportado.
- **FR-007**: A primeira linha do CSV MUST ser um cabeçalho com os seguintes nomes de colunas
  em português, nesta ordem: `Descrição,Valor,Categoria,Vencimento,Mês de Referência,Status,Forma de Pagamento,Observações`.
- **FR-008**: O CSV MUST usar vírgula (`,`) como separador de campos e UTF-8 com BOM como
  encoding. A primeira linha do arquivo MUST ser `sep=,` (antes do cabeçalho) para garantir
  compatibilidade com Excel em todos os locales, incluindo PT-BR que usa `;` por padrão.

### Key Entities

- **Expense**: Registro de gasto — campos exportados: Description, Amount, Category,
  DueDate, ReferenceMonth, Status, PaymentMethod, Notes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue baixar o CSV em menos de 3 segundos para qualquer mês com
  até 500 gastos cadastrados.
- **SC-002**: O arquivo CSV abre corretamente no Excel (Windows), Google Sheets e LibreOffice
  Calc sem erros de encoding ou formatação de colunas.
- **SC-003**: O CSV exportado com filtros ativos contém exatamente os mesmos registros
  visíveis na tela no momento da exportação (0 registros a mais ou a menos).
- **SC-004**: Campos opcionais ausentes aparecem como células vazias sem quebrar a estrutura
  do arquivo.

## Assumptions

- A exportação é gerada no frontend (browser) via download direto, sem necessidade de
  endpoint adicional no backend — os dados já estão carregados na tela.
- Não há limite de linhas no CSV para esta versão (máximo prático é o que a API já retorna).
- Não há necessidade de exportação em outros formatos (PDF, XLSX) nesta versão.
- O botão de exportação fica na mesma tela de listagem de gastos, próximo aos filtros.
- Mobile também deve suportar a exportação (o download é iniciado pelo browser nativo).
