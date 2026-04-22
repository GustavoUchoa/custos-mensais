import type { Expense } from "../types";
import { exportToCsv } from "../utils/exportCsv";

type ExportButtonProps = {
  expenses: Expense[];
  referenceMonth: string;
};

export function ExportButton({ expenses, referenceMonth }: ExportButtonProps) {
  return (
    <button
      className="export-btn"
      type="button"
      onClick={() => exportToCsv(expenses, referenceMonth)}
    >
      Exportar CSV
    </button>
  );
}
