import type { Expense } from "../types";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDateToBR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function exportToCsv(expenses: Expense[], referenceMonth: string): void {
  const BOM = "﻿";
  const SEP = "sep=,";
  const HEADER = "Descrição,Valor,Categoria,Vencimento,Mês de Referência,Status,Forma de Pagamento,Observações";

  const rows = expenses.map((expense) => {
    const fields = [
      expense.description,
      expense.amount.toFixed(2),
      expense.category,
      formatDateToBR(expense.dueDate),
      expense.referenceMonth,
      expense.status === "paid" ? "Pago" : "Pendente",
      expense.paymentMethod ?? "",
      expense.notes ?? "",
    ];
    return fields.map(escapeCsvField).join(",");
  });

  const content = [SEP, HEADER, ...rows].join("\n");
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `gastos-${referenceMonth}.csv`;
  anchor.click();

  URL.revokeObjectURL(url);
}
