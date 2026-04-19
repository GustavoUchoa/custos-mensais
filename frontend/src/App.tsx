import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getSummary,
  updateExpense,
  updateExpenseStatus,
} from "./api/expensesApi";
import type { Expense, ExpenseFormData, Filters, MonthlySummary } from "./types";
import {
  categories,
  currentMonth,
  emptyForm,
  formatCurrency,
  formatDate,
  formatMonth,
  parseCurrencyInput,
  paymentMethods,
  toFormData,
  toPayload,
} from "./utils";

const initialFilters: Filters = {
  category: "all",
  status: "all",
  search: "",
};

const emptySummary: MonthlySummary = {
  totalMonth: 0,
  totalPaid: 0,
  totalPending: 0,
  paidPercentage: 0,
  topCategory: "Sem dados",
  count: 0,
  totalsByCategory: {},
};

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<MonthlySummary>(emptySummary);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [form, setForm] = useState<ExpenseFormData>(() => emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [expensesResult, summaryResult] = await Promise.all([
        getExpenses(selectedMonth, filters),
        getSummary(selectedMonth),
      ]);
      setExpenses(expensesResult);
      setSummary(summaryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setForm((current) => ({ ...current, referenceMonth: selectedMonth }));
  }, [selectedMonth]);

  const pieSlices = useMemo(() => {
    const total = Object.values(summary.totalsByCategory).reduce((sum, v) => sum + v, 0);
    if (total === 0) return [];

    const colors = ["#1a4731", "#2d7b5a", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#b7e4c7"];
    const cx = 100, cy = 100, r = 80;
    let angle = -Math.PI / 2;

    return Object.entries(summary.totalsByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([category, value], i) => {
        const sweep = (value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        angle += sweep;
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const largeArc = sweep > Math.PI ? 1 : 0;
        return {
          category,
          value,
          color: colors[i % colors.length],
          path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`,
        };
      });
  }, [summary.totalsByCategory]);

  const updateForm = (field: keyof ExpenseFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm(), referenceMonth: selectedMonth });
    setEditingId(null);
  };

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2600);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const amount = parseCurrencyInput(form.amount);
    if (!form.description.trim() || !form.category || !form.referenceMonth || !form.dueDate) {
      showMessage("Preencha nome, categoria, vencimento e mês de referência.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Informe um valor maior que zero.");
      return;
    }

    try {
      const payload = toPayload(form);
      if (editingId) {
        await updateExpense(editingId, payload);
        showMessage("Custo atualizado.");
      } else {
        await createExpense(payload);
        showMessage("Custo cadastrado.");
      }

      setSelectedMonth(form.referenceMonth);
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o custo.");
    }
  };

  const toggleStatus = async (expense: Expense) => {
    const nextStatus = expense.status === "paid" ? "pending" : "paid";

    try {
      await updateExpenseStatus(expense.id, nextStatus);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o status.");
    }
  };

  const editExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setForm(toFormData(expense));
    setFormOpen(true);
    showMessage("Editando custo selecionado.");
  };

  const removeExpense = async (expense: Expense) => {
    const confirmed = window.confirm(`Excluir "${expense.description}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(expense.id);
      if (editingId === expense.id) {
        resetForm();
      }
      showMessage("Custo excluído.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir o custo.");
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">React + ASP.NET Core</p>
          <h1>Custos Mensais</h1>
        </div>

        <label className="month-picker">
          <span>Mês</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />
        </label>
      </header>

      <section className="summary-grid" aria-label="Resumo financeiro">
        <SummaryCard label="Total do mês" value={formatCurrency(summary.totalMonth)} />
        <SummaryCard label="Pago" value={formatCurrency(summary.totalPaid)} accent="green" />
        <SummaryCard label="Pendente" value={formatCurrency(summary.totalPending)} accent="red" />
        <SummaryCard label="Já pago" value={`${summary.paidPercentage}%`} />
        <SummaryCard label="Custos" value={String(summary.count)} />
        <SummaryCard label="Maior categoria" value={summary.topCategory} />
      </section>

      {message && <p className="toast">{message}</p>}
      {error && <p className="error-banner">{error}</p>}

      <button
        className="fab"
        type="button"
        aria-label="Novo custo"
        onClick={() => setFormOpen(true)}
      >
        +
      </button>

      <section className="workspace">
        <form className={`expense-form${formOpen ? " is-open" : ""}`} onSubmit={handleSubmit}>
          <div className="section-title">
            <p>{editingId ? "Editar custo" : "Novo custo"}</p>
            <div className="form-title-actions">
              {editingId && (
                <button className="ghost-button" type="button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
              <button
                className="ghost-button form-close-btn"
                type="button"
                onClick={() => { resetForm(); setFormOpen(false); }}
                aria-label="Fechar formulário"
              >
                ✕
              </button>
            </div>
          </div>

          <label>
            Nome
            <input
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              placeholder="Ex.: Internet"
            />
          </label>

          <div className="form-row">
            <label>
              Valor
              <input
                inputMode="decimal"
                value={form.amount}
                onChange={(event) => updateForm("amount", event.target.value)}
                placeholder="149,90"
              />
            </label>

            <label>
              Categoria
              <select
                value={form.category}
                onChange={(event) => updateForm("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Vencimento
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => updateForm("dueDate", event.target.value)}
              />
            </label>

            <label>
              Mês de referência
              <input
                type="month"
                value={form.referenceMonth}
                onChange={(event) => updateForm("referenceMonth", event.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Status
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value)}
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
              </select>
            </label>

            <label>
              Forma de pagamento
              <select
                value={form.paymentMethod}
                onChange={(event) => updateForm("paymentMethod", event.target.value)}
              >
                <option value="">Não informado</option>
                {paymentMethods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Observação
            <textarea
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              placeholder="Detalhes úteis para lembrar depois"
              rows={3}
            />
          </label>

          <button className="primary-button" type="submit">
            {editingId ? "Salvar alterações" : "Cadastrar custo"}
          </button>
        </form>

        <div className="main-panel">
          <section className="filters" aria-label="Filtros">
            <label>
              Buscar
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, search: event.target.value }))
                }
                placeholder="Nome ou observação"
              />
            </label>

            <label>
              Categoria
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, category: event.target.value }))
                }
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value as Filters["status"],
                  }))
                }
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="paid">Pagos</option>
              </select>
            </label>
          </section>

          <section className="chart-panel" aria-label="Gastos por categoria">
            <div className="section-title">
              <p>Gastos por categoria</p>
              <span>{formatMonth(selectedMonth)}</span>
            </div>

            {pieSlices.length > 0 ? (
              <div className="pie-wrap">
                <svg viewBox="0 0 200 200" className="pie-svg">
                  {pieSlices.map((s) => (
                    <path key={s.category} d={s.path} fill={s.color} stroke="#fff" strokeWidth="1.5" />
                  ))}
                </svg>
                <ul className="pie-legend">
                  {pieSlices.map((s) => (
                    <li key={s.category}>
                      <span className="pie-dot" style={{ background: s.color }} />
                      <span className="pie-cat">{s.category}</span>
                      <strong>{formatCurrency(s.value)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState text="Cadastre um custo para ver as categorias do mês." />
            )}
          </section>

          <section className="expense-list" aria-label="Lista de custos">
            <div className="section-title">
              <p>Custos cadastrados</p>
              <span>{isLoading ? "Carregando" : `${expenses.length} encontrados`}</span>
            </div>

            {expenses.length > 0 ? (
              <div className="expense-table">
                <div className="table-head">
                  <span>Descrição</span>
                  <span>Categoria</span>
                  <span>Vencimento</span>
                  <span>Valor</span>
                  <span>Status</span>
                  <span>Ações</span>
                </div>

                {expenses.map((expense) => (
                  <article
                    className={`expense-row ${expense.isOverdue ? "is-overdue" : ""}`}
                    key={expense.id}
                  >
                    <div>
                      <strong>{expense.description}</strong>
                      {(expense.paymentMethod || expense.notes) && (
                        <small>
                          {[expense.paymentMethod, expense.notes].filter(Boolean).join(" · ")}
                        </small>
                      )}
                    </div>
                    <span>{expense.category}</span>
                    <span>{formatDate(expense.dueDate)}</span>
                    <strong>{formatCurrency(expense.amount)}</strong>
                    <button
                      className={`status-pill ${expense.status}`}
                      type="button"
                      onClick={() => toggleStatus(expense)}
                    >
                      {expense.status === "paid" ? "Pago" : "Pendente"}
                    </button>
                    <div className="row-actions">
                      <button type="button" onClick={() => editExpense(expense)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => removeExpense(expense)}>
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhum custo encontrado. Ajuste os filtros ou cadastre uma nova despesa." />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  accent?: "green" | "red";
};

function SummaryCard({ label, value, accent }: SummaryCardProps) {
  return (
    <article className={`summary-card ${accent ?? ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}

export default App;
