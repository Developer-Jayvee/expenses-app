import { useMemo, useState } from "react";
import type { DailyBudgetI } from "@c/types/dailyExpenseTypes";

export default function useDailyExpensesListHook(
  budgetList: Array<DailyBudgetI>,
) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");

  const onQueryChange = (value: string) => setQuery(value);
  const onDateChange = (value: string) => setDate(value);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return budgetList.filter((budget) => {
      const matchesQuery = term
        ? budget.name.toLowerCase().includes(term)
        : true;
      const matchesDate = date ? budget.budget_date === date : true;
      return matchesQuery && matchesDate;
    });
  }, [budgetList, query, date]);

  return {
    query,
    onQueryChange,
    date,
    onDateChange,
    filtered,
  };
}
