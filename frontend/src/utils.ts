import type { Expense, ExpenseFormData, ExpensePayload } from "./types";

export const categories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Assinaturas",
  "Lazer",
  "Cartão de crédito",
  "Outros",
];

export const paymentMethods = [
  "Pix",
  "Cartão de crédito",
  "Cartão de débito",
  "Boleto",
  "Dinheiro",
  "Transferência",
];

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const currentMonth = () => new Date().toISOString().slice(0, 7);

export const emptyForm = (): ExpenseFormData => ({
  description: "",
  amount: "",
  category: categories[0],
  dueDate: todayIso(),
  referenceMonth: currentMonth(),
  status: "pending",
  paymentMethod: "",
  notes: "",
});

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatMonth = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex - 1, 1));
};

export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month - 1, day));
};

export const parseCurrencyInput = (value: string) => {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return Number(normalized);
};

export const toFormData = (expense: Expense): ExpenseFormData => ({
  description: expense.description,
  amount: String(expense.amount).replace(".", ","),
  category: expense.category,
  dueDate: expense.dueDate,
  referenceMonth: expense.referenceMonth,
  status: expense.status,
  paymentMethod: expense.paymentMethod ?? "",
  notes: expense.notes ?? "",
});

export const toPayload = (form: ExpenseFormData): ExpensePayload => ({
  description: form.description.trim(),
  amount: parseCurrencyInput(form.amount),
  category: form.category,
  dueDate: form.dueDate,
  referenceMonth: form.referenceMonth,
  status: form.status,
  paymentMethod: form.paymentMethod.trim() || undefined,
  notes: form.notes.trim() || undefined,
});
