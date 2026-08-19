import { Badge } from "@c/lib/shadcn/components/ui/badge";
import type { DailyBudgetI } from "@c/types/dailyExpenseTypes";
import {
  currency_formatter,
  daily_budget_status_pill_class,
  date_formatter,
} from "@c/utils/utilities.util";

interface DailyBudgetCardI {
  budget: DailyBudgetI;
  onView: (id: string | number) => void;
}

export default function DailyBudgetCard({ budget, onView }: DailyBudgetCardI) {
  return (
    <button
      type="button"
      onClick={() => onView(budget.id)}
      className="flex flex-col gap-3 rounded-2xl border bg-card p-4 text-left"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-base font-semibold">{budget.name}</span>
        <Badge className={daily_budget_status_pill_class(budget.status)}>
          <span className="size-1.5 rounded-full bg-current" />
          {budget.status_label}
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
    </button>
  );
}
