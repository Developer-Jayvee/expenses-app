import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@c/lib/shadcn/components/ui/card";
import type { MonthlyExpenseI } from "@c/types/dashboardTypes";
import { currency_formatter } from "@c/utils/utilities.util";

interface MonthlyExpensesChartI {
  data: MonthlyExpenseI[];
  year: number;
}

const short_currency = (value: number) =>
  value >= 1_000_000
    ? `₱${(value / 1_000_000).toFixed(1)}M`
    : value >= 1_000
      ? `₱${(value / 1_000).toFixed(1)}k`
      : `₱${Math.round(value)}`;

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as MonthlyExpenseI | undefined;
  if (!point) return null;

  return (
    <div className="rounded-lg bg-card px-3 py-2 text-xs ring-1 ring-foreground/10">
      <div className="font-semibold text-foreground">{point.label}</div>
      <div className="mt-0.5 text-muted-foreground">
        {currency_formatter(point.total)}
      </div>
    </div>
  );
}

export default function MonthlyExpensesChart({
  data,
  year,
}: MonthlyExpensesChartI) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Total transactions per month, Jan–Dec {year} &middot;{" "}
          {currency_formatter(total)} year to date
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--chart-grid)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={48}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value: number) => short_currency(value)}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                content={(props) => <ChartTooltip {...props} />}
              />
              <Bar
                dataKey="total"
                name="Expenses"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
