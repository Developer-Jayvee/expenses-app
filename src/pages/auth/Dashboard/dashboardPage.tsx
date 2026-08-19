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

  return (
    <div className="flex w-full flex-col gap-5 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Spending overview for {summary.year}.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => refresh()}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <MonthlyExpensesChart
          data={summary.monthly_expenses}
          year={summary.year}
        />
        <BillsByCategoryChart data={summary.bills_by_category} />
      </div>

      <UpcomingBillsTable bills={summary.upcoming_bills} />
    </div>
  );
}
