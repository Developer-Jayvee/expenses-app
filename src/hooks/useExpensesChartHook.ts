import { useEffect, useState } from "react";
import { dashboardExpenses_API } from "./api/dashboard-api";
import type {
  ExpensePointI,
  ExpensesPeriodT,
  MonthlyExpenseI,
} from "@c/types/dashboardTypes";

interface UseExpensesChartHookI {
  monthlyData: MonthlyExpenseI[];
}

export default function useExpensesChartHook({
  monthlyData,
}: UseExpensesChartHookI) {
  const [period, setPeriod] = useState<ExpensesPeriodT>("monthly");
  const [weeklyData, setWeeklyData] = useState<ExpensePointI[] | null>(null);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);

  useEffect(() => {
    if (period !== "weekly" || weeklyData) return;

    let cancelled = false;
    setIsLoadingWeekly(true);
    dashboardExpenses_API("weekly")
      .then((response) => {
        if (!cancelled) setWeeklyData(response.data);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingWeekly(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, weeklyData]);

  return {
    period,
    setPeriod,
    data: period === "weekly" ? (weeklyData ?? []) : monthlyData,
    isLoadingWeekly: period === "weekly" && isLoadingWeekly,
  };
}
