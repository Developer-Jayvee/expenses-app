import { IoSearchOutline } from "react-icons/io5";
import useDailyExpensesListHook from "@c/hooks/useDailyExpensesListHook";
import { Input } from "@c/lib/shadcn/components/ui/input";
import { Badge } from "@c/lib/shadcn/components/ui/badge";
import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@c/lib/shadcn/components/ui/table";
import DailyBudgetCard from "../components/dailyBudgetCard";
import type { DailyBudgetI } from "@c/types/dailyExpenseTypes";
import {
  currency_formatter,
  daily_budget_display_status,
  daily_budget_display_status_label,
  daily_budget_status_pill_class,
  date_formatter,
} from "@c/utils/utilities.util";

interface DailyBudgetsListI {
  budgetList: Array<DailyBudgetI>;
  onView: (id: string | number) => void;
  onContinue?: (budget: DailyBudgetI) => void;
  onCloseTransaction?: (budget: DailyBudgetI) => void;
  onDeleteTransaction?: (budget: DailyBudgetI) => void;
}

export default function DailyBudgetsList({
  budgetList,
  onView,
  onContinue,
  onCloseTransaction,
  onDeleteTransaction,
}: DailyBudgetsListI) {
  const { query, onQueryChange, date, onDateChange, filtered } =
    useDailyExpensesListHook(budgetList);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <IoSearchOutline
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            size={15}
          />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search past transactions…"
            className="h-10 w-full pl-9"
          />
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="h-10 w-full sm:w-auto"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-16 text-center">
          <span className="text-sm font-semibold">No past transactions</span>
          <span className="text-sm text-muted-foreground">
            Try a different search or date.
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 p-4 sm:hidden">
            {filtered.map((budget) => (
              <DailyBudgetCard
                key={budget.id}
                budget={budget}
                onView={onView}
                onContinue={onContinue}
                onCloseTransaction={onCloseTransaction}
                onDeleteTransaction={onDeleteTransaction}
              />
            ))}
          </div>
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Transaction</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((budget) => {
                  const isInProgress =
                    daily_budget_display_status(budget) === "in_progress";
                  return (
                    <TableRow
                      key={budget.id}
                      className={isInProgress ? "" : "cursor-pointer"}
                      onClick={
                        isInProgress ? undefined : () => onView(budget.id)
                      }
                    >
                      <TableCell className="font-semibold">
                        {budget.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {date_formatter(new Date(budget.budget_date))}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {currency_formatter(budget.budget_amount)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {currency_formatter(budget.total_spent)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={daily_budget_status_pill_class(
                            daily_budget_display_status(budget),
                          )}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {daily_budget_display_status_label(budget)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {isInProgress && (
                          <div
                            className="flex justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onContinue?.(budget)}
                            >
                              Continue
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onCloseTransaction?.(budget)}
                            >
                              Close
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onDeleteTransaction?.(budget)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
