# CSV Format Checklist: Exportar Gastos do Mês em CSV

**Purpose**: Validar qualidade, clareza e completude dos requisitos de formatação CSV antes da implementação
**Created**: 2026-04-21
**Feature**: [spec.md](../spec.md)
**Depth**: Gate pré-implementação
**Audience**: Autor (auto-revisão)
**Focus**: Requisitos de formatação de dados CSV (FR-002 a FR-008)

---

## Requirement Completeness

- [x] CHK001 — Os 8 campos exportados (FR-002) excluem explicitamente `id`, `isOverdue`, `createdAt` e `updatedAt`? Ou a exclusão está apenas implícita na listagem positiva? [Completeness, Gap, Spec §FR-002] → Listagem positiva é suficiente; exclusão implícita é prática padrão e aceitável
- [x] CHK002 — Os nomes exatos das colunas do cabeçalho (FR-007) estão definidos no spec.md, ou apenas no data-model.md? Se só no data-model, o spec está incompleto. [Completeness, Spec §FR-007] → **Resolvido**: FR-007 atualizado com nomes exatos das colunas em ordem
- [x] CHK003 — O formato de terminação de linha do CSV (LF vs CRLF) está especificado? Ausência pode causar problema no Excel Windows. [Completeness, Gap] → data-model.md especifica `\n`; Excel Windows aceita LF sem problemas
- [x] CHK004 — Há requisito definindo o comportamento quando um campo contém caractere de nova linha (`\n`)? Newlines em Notes podem quebrar o parsing. [Completeness, Gap, Edge Case] → **Resolvido**: data-model.md atualizado com regra RFC 4180 para quebras de linha dentro de campos
- [x] CHK005 — O mapeamento de `status` para labels legíveis (`paid`→`"Pago"`, `pending`→`"Pendente"`) está documentado no spec.md ou apenas no data-model.md? [Completeness, Spec §FR-002] → Definido em data-model.md e referenciado em T001; aceitável para app de uso pessoal

---

## Requirement Clarity

- [x] CHK006 — FR-008 especifica "vírgula como separador" mas define como campos contendo vírgulas devem ser tratados (ex: RFC 4180 quoting)? [Clarity, Spec §FR-008] → data-model.md define escaping RFC 4180; T001 o referencia explicitamente
- [x] CHK007 — FR-005 especifica "ponto como separador decimal" — isso se aplica a todos os locales do browser, ou apenas ao locale padrão da aplicação? [Clarity, Spec §FR-005] → Decisão deliberada: sempre usar `.` independente de locale; é exportação de dados, não formatação de exibição
- [x] CHK008 — FR-003 define o nome do arquivo como `gastos-YYYY-MM.csv` — está claro que `YYYY-MM` é o `referenceMonth` do mês *exibido*, não a data atual? [Clarity, Spec §FR-003] → FR-003 usa "mês de referência selecionado" e o prop `referenceMonth` é explícito no contrato
- [x] CHK009 — FR-008 exige "UTF-8 com BOM" — o spec define o que é o BOM (`﻿`) de forma que qualquer dev possa implementar sem pesquisa adicional? [Clarity, Spec §FR-008] → data-model.md define BOM com o caractere literal (`﻿`); T001 instrui criar Blob com esse prefixo
- [x] CHK010 — FR-006 define formato de data como `DD/MM/YYYY` — está claro que se aplica apenas ao campo `DueDate` exportado, não ao `referenceMonth` (que permanece `YYYY-MM`)? [Clarity, Spec §FR-006] → data-model.md explicita: `dueDate: DD/MM/YYYY` e `referenceMonth: YYYY-MM` separadamente

---

## Requirement Consistency

- [x] CHK011 — A ordem das colunas em FR-002 é idêntica à ordem do cabeçalho definida em data-model.md? [Consistency, Spec §FR-002] → Verificado: mesma ordem nos dois artefatos
- [x] CHK012 — O formato de data `DD/MM/YYYY` (FR-006) é consistente com o formato exibido nas demais telas da aplicação, ou é exclusivo do CSV? [Consistency, Spec §FR-006] → Exclusivo do CSV; a aplicação usa ISO na API; escolha intencional para legibilidade na planilha
- [x] CHK013 — SC-002 exige compatibilidade com Excel/Google Sheets/LibreOffice — o requisito FR-008 (UTF-8 BOM + vírgula + `sep=,`) é suficiente para garantir SC-002? [Consistency, Spec §FR-008, SC-002] → Sim; `sep=,` + BOM cobre todos os três — resolvido após CHK021
- [x] CHK014 — FR-004 (filtros aplicados) e SC-003 (CSV = registros visíveis) são consistentes: SC-003 inclui o filtro de busca textual além de categoria e status? [Consistency, Spec §FR-004, SC-003] → FR-004 lista explicitamente "categoria, status, busca"; SC-003 usa "registros visíveis" que os engloba

---

## Acceptance Criteria Quality

- [x] CHK015 — SC-002 ("abre corretamente... sem erros de encoding ou formatação") é mensurável objetivamente? Quais são os critérios de "correto"? [Measurability, Spec §SC-002] → Para app pessoal single-user, critério manual é aceitável; T006 cobre a validação
- [x] CHK016 — SC-001 (<3s para 500 registros) tem uma tarefa de verificação explícita nas tasks? A performance está coberta por T006 com critério claro? [Measurability, Spec §SC-001] → Resolvido: T006 atualizado com critério explícito de <3s

---

## Scenario Coverage (Edge Cases)

- [x] CHK017 — Há requisito definindo comportamento quando `Notes` ou `Description` contém texto muito longo (ex: >500 chars)? [Edge Case, Gap] → Não é preocupação real: CSV aceita campos longos; Excel trunca na exibição mas preserva os dados; aceitável
- [x] CHK018 — O requisito para `amount = 0` está coberto? `0.00` é o formato esperado? [Edge Case, Spec §FR-005] → FR-005 + `toFixed(2)` produz `0.00`; coberto implicitamente
- [x] CHK019 — Há requisito para quando todos os filtros ativos resultam em zero registros? [Edge Case, Spec §FR-001, SC-004] → US1 Cenário 2 e SC-004 cobrem explicitamente: exporta apenas cabeçalho

---

## Dependencies & Assumptions

- [x] CHK020 — A compatibilidade de UTF-8 BOM com diferentes versões do Excel (2013, 2016, 365, Mac) é assumida ou validada? [Assumption, Spec §FR-008] → Assumida; app de uso pessoal com usuário e versão Excel conhecidos; aceitável
- [x] CHK021 — A escolha de vírgula como separador (FR-008) é validada para Excel em locales que usam ponto-e-vírgula como separador padrão (ex: Excel PT-BR)? [Assumption, Gap, Spec §FR-008] → **Resolvido**: adicionada diretiva `sep=,` como primeira linha do CSV (FR-008 atualizado)
- [x] CHK022 — A dependência da Blob API do browser para o download está documentada como premissa no spec ou apenas no research.md? [Assumption, Gap] → Documentada em research.md (Decision 4); todos os browsers modernos suportam; aceitável para app pessoal

---

## Notes

- Todos os 22 itens revisados e resolvidos em 2026-04-21
- Gaps reais corrigidos: CHK002 (FR-007 com nomes de colunas), CHK004 (newlines em campos), CHK021 (`sep=,`)
- Itens aceitos como-está por contexto de app pessoal single-user: CHK015, CHK017, CHK020, CHK022
