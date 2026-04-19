import type { Expense, ExpensePayload, ExpenseStatus, Filters, MonthlySummary } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5236/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "A API retornou um erro.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getExpenses(month: string, filters: Filters) {
  const params = new URLSearchParams({ month });

  if (filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  return request<Expense[]>(`/expenses?${params.toString()}`);
}

export async function getSummary(month: string) {
  return request<MonthlySummary>(`/expenses/summary?month=${encodeURIComponent(month)}`);
}

export async function createExpense(payload: ExpensePayload) {
  return request<Expense>("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateExpense(id: string, payload: ExpensePayload) {
  return request<Expense>(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateExpenseStatus(id: string, status: ExpenseStatus) {
  return request<Expense>(`/expenses/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteExpense(id: string) {
  return request<void>(`/expenses/${id}`, {
    method: "DELETE",
  });
}
