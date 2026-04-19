export type ExpenseStatus = "paid" | "pending";

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  dueDate: string;
  referenceMonth: string;
  status: ExpenseStatus;
  paymentMethod?: string;
  notes?: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExpensePayload = {
  description: string;
  amount: number;
  category: string;
  dueDate: string;
  referenceMonth: string;
  status: ExpenseStatus;
  paymentMethod?: string;
  notes?: string;
};

export type ExpenseFormData = {
  description: string;
  amount: string;
  category: string;
  dueDate: string;
  referenceMonth: string;
  status: ExpenseStatus;
  paymentMethod: string;
  notes: string;
};

export type Filters = {
  category: string;
  status: "all" | ExpenseStatus;
  search: string;
};

export type MonthlySummary = {
  totalMonth: number;
  totalPaid: number;
  totalPending: number;
  paidPercentage: number;
  topCategory: string;
  count: number;
  totalsByCategory: Record<string, number>;
};
