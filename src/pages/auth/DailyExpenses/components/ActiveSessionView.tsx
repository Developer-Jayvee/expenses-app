import { CiTrash } from "react-icons/ci";
import { BiPlus } from "react-icons/bi";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { Card } from "@c/lib/shadcn/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";
import type { DailyBudgetI, DailyExpenseI } from "@c/types/dailyExpenseTypes";
import { currency_formatter, date_formatter } from "@c/utils/utilities.util";

interface StatCellI {
  label: string;
  value: string;
  valueClassName?: string;
}

const StatCell = ({ label, value, valueClassName }: StatCellI) => (
  <div className="px-6 py-4">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div
      className={`mt-1.5 font-mono text-xl font-semibold tracking-tight ${valueClassName ?? ""}`}
    >
      {value}
    </div>
  </div>
);

interface ActiveSessionViewI {
  budget: DailyBudgetI;
  readOnly?: boolean;
  onAddExpense?: () => void;
  onDeleteExpense?: (expense: DailyExpenseI) => void;
  onDone?: () => void;
  onCancel?: () => void;
}

export default function ActiveSessionView({
  budget,
  readOnly = false,
  onAddExpense,
  onDeleteExpense,
  onDone,
  onCancel,
}: ActiveSessionViewI) {
  const isNegative = Number(budget.remaining_budget) < 0;
  const canCancel =
    Number(budget.remaining_budget) === Number(budget.budget_amount);
  const expenses = [...(budget.expenses ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="flex flex-col gap-5">
      <Card className="gap-0 overflow-hidden rounded-2xl py-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{budget.name}</h2>
            <p className="text-xs text-muted-foreground">
              {date_formatter(new Date(budget.budget_date))}
            </p>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!canCancel}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={onDone}>
                Done
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <StatCell
            label="Allotted"
            value={currency_formatter(budget.budget_amount)}
          />
          <StatCell
            label="Spent"
            value={currency_formatter(budget.total_spent)}
          />
          <StatCell
            label="Remaining"
            value={currency_formatter(budget.remaining_budget)}
            valueClassName={isNegative ? "text-destructive" : ""}
          />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Expenses · {expenses.length.toLocaleString()}
        </h3>
        {!readOnly && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAddExpense}
          >
            <BiPlus size={16} />
            Add Expense
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-14 text-center">
            <span className="text-sm font-semibold">
              No expenses logged yet
            </span>
            <span className="text-sm text-muted-foreground">
              {readOnly
                ? "This transaction has no logged expenses."
                : "Add your first expense to start tracking."}
            </span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Expense</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {!readOnly && <TableHead className="w-10" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {expense.type_label}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {expense.payment_type_label}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">
                    {currency_formatter(expense.amount)}
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Delete expense"
                        onClick={() => onDeleteExpense?.(expense)}
                      >
                        <CiTrash size={16} />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
