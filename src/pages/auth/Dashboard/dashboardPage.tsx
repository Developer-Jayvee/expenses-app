import useDashboardHook from "@c/hooks/useDashboardHook";
import MonthlyExpensesChart from "./components/monthlyExpensesChart";
import BillsByCategoryChart from "./components/billsByCategoryChart";
import UpcomingBillsTable from "./components/upcomingBillsTable";
import DashboardSkeleton from "./components/dashboardSkeleton";
import { Button } from "@c/lib/shadcn/components/ui/button";

export default function DashboardPage() {
  const { summary, isLoading, isError, refresh } = useDashboardHook();

  if (isLoading && !summary) {
    return <DashboardSkeleton />;
  }

  if (isError && !summary) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-center">
        <span className="text-sm font-semibold">
          Couldn&apos;t load the dashboard
        </span>
        <Button type="button" variant="outline" onClick={() => refresh()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!summary) return null;

  const year = summary.year ?? new Date().getFullYear();
  const monthlyExpenses = summary.monthly_expenses ?? [];
  const billsByCategory = summary.bills_by_category ?? [];
  const upcomingBills = summary.upcoming_bills ?? [];

  return (
    <div className="flex w-full flex-col gap-4 p-4 sm:gap-5 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Spending overview for {year}.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => refresh()}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <MonthlyExpensesChart data={monthlyExpenses} year={year} />
        <BillsByCategoryChart data={billsByCategory} />
      </div>

      <UpcomingBillsTable bills={upcomingBills} />
    </div>
  );
}
