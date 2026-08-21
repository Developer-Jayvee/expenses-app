import { Badge } from "@c/lib/shadcn/components/ui/badge";
import { Button } from "@c/lib/shadcn/components/ui/button";
import type { DailyBudgetI } from "@c/types/dailyExpenseTypes";
import {
  currency_formatter,
  daily_budget_display_status,
  daily_budget_display_status_label,
  daily_budget_status_pill_class,
  date_formatter,
} from "@c/utils/utilities.util";

interface DailyBudgetCardI {
  budget: DailyBudgetI;
  onView: (id: string | number) => void;
  onContinue?: (budget: DailyBudgetI) => void;
  onCloseTransaction?: (budget: DailyBudgetI) => void;
  onDeleteTransaction?: (budget: DailyBudgetI) => void;
}

const CardBody = ({ budget }: { budget: DailyBudgetI }) => (
  <>
    <div className="flex items-center justify-between gap-3">
      <span className="truncate text-base font-semibold">{budget.name}</span>
      <Badge
        className={daily_budget_status_pill_class(
          daily_budget_display_status(budget),
        )}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {daily_budget_display_status_label(budget)}
      </Badge>
    </div>
    <div className="text-xs text-muted-foreground">
      {date_formatter(new Date(budget.budget_date))}
    </div>
    <div className="flex gap-2">
      <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
        <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
          Budget
        </div>
        <div className="mt-0.5 font-mono text-sm font-semibold">
          {currency_formatter(budget.budget_amount)}
        </div>
      </div>
      <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
        <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
          Spent
        </div>
        <div className="mt-0.5 font-mono text-sm font-semibold text-muted-foreground">
          {currency_formatter(budget.total_spent)}
        </div>
      </div>
    </div>
  </>
);

export default function DailyBudgetCard({
  budget,
  onView,
  onContinue,
  onCloseTransaction,
  onDeleteTransaction,
}: DailyBudgetCardI) {
  const isInProgress = daily_budget_display_status(budget) === "in_progress";

  if (isInProgress) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 text-left">
        <CardBody budget={budget} />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onContinue?.(budget)}
          >
            Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onCloseTransaction?.(budget)}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDeleteTransaction?.(budget)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onView(budget.id)}
      className="flex flex-col gap-3 rounded-2xl border bg-card p-4 text-left"
    >
      <CardBody budget={budget} />
    </button>
  );
}
