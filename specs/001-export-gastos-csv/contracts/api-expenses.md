# Contract: GET /api/expenses

**Tipo**: REST API (existente — sem alterações)
**Consumido por**: ExportButton (frontend)

---

## Endpoint

```
GET /api/expenses?month={YYYY-MM}&category={string?}&status={0|1?}&search={string?}
```

**Parâmetros**:

| Param      | Tipo     | Obrigatório | Descrição                          |
|------------|----------|-------------|------------------------------------|
| `month`    | `string` | Sim         | Mês de referência no formato YYYY-MM |
| `category` | `string` | Não         | Filtra por categoria               |
| `status`   | `0\|1`   | Não         | `0` = pending, `1` = paid         |
| `search`   | `string` | Não         | Busca em descrição e observações   |

**Resposta** `200 OK`:

```json
[
  {
    "id": "uuid",
    "description": "string",
    "amount": 0.00,
    "category": "string",
    "dueDate": "YYYY-MM-DD",
    "referenceMonth": "YYYY-MM",
    "status": "paid | pending",
    "paymentMethod": "string | null",
    "notes": "string | null",
    "isOverdue": false,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

---

## Contrato do ExportButton (frontend)

**Props**:

```typescript
interface ExportButtonProps {
  expenses: Expense[]    // tipo frontend (equivale ao ExpenseResponse do backend)
  referenceMonth: string // ex: "2026-04" — usado para nomear o arquivo
}
```

**Comportamento**:
- Recebe os dados já filtrados; não faz nova chamada à API
- Gera CSV e aciona download do browser imediatamente ao clique
- Nome do arquivo: `gastos-{referenceMonth}.csv`
