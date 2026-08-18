import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@c/lib/shadcn/components/ui/card";
import type { BillCategoryTotalI } from "@c/types/dashboardTypes";
import { currency_formatter } from "@c/utils/utilities.util";

interface BillsByCategoryChartI {
  data: BillCategoryTotalI[];
}

/**
 * The categorical palette's first 3 hues are the only slots that stay
 * colorblind-safe when every slice is visible at once (all-pairs, not just
 * adjacent) — see the dataviz skill's palette notes. Past 3, categories fold
 * into "Other" rather than reach for a 4th hue.
 */
const SLICE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];
const OTHER_COLOR = "var(--chart-other)";
const MAX_SLICES = 3;

interface SliceI extends BillCategoryTotalI {
  percent: number;
  color: string;
}

function buildSlices(data: BillCategoryTotalI[]): SliceI[] {
  const total = data.reduce((sum, item) => sum + item.total, 0);
  if (total <= 0) return [];

  const top = data.slice(0, MAX_SLICES);
  const rest = data.slice(MAX_SLICES);
  const otherTotal = rest.reduce((sum, item) => sum + item.total, 0);

  const slices: SliceI[] = top.map((item, index) => ({
    ...item,
    percent: item.total / total,
    color: SLICE_COLORS[index] ?? OTHER_COLOR,
  }));

  if (otherTotal > 0) {
    slices.push({
      category: "uncategorized",
      label: rest.length === 1 ? (rest[0]?.label ?? "Other") : "Other",
      total: otherTotal,
      percent: otherTotal / total,
      color: OTHER_COLOR,
    });
  }

  return slices;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const slice = payload[0]?.payload as SliceI | undefined;
  if (!slice) return null;

  return (
    <div className="rounded-lg bg-card px-3 py-2 text-xs ring-1 ring-foreground/10">
      <div className="font-semibold text-foreground">{slice.label}</div>
      <div className="mt-0.5 text-muted-foreground">
        {currency_formatter(slice.total)} &middot;{" "}
        {(slice.percent * 100).toFixed(0)}%
      </div>
    </div>
  );
}

export default function BillsByCategoryChart({ data }: BillsByCategoryChartI) {
  const slices = useMemo(() => buildSlices(data), [data]);
  const total = slices.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills by Category</CardTitle>
        <CardDescription>
          Share of total bill amount &middot; {currency_formatter(total)} across{" "}
          {data.length} {data.length === 1 ? "category" : "categories"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {slices.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No bills yet.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey="total"
                    nameKey="label"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={2}
                    stroke="var(--chart-surface)"
                    strokeWidth={2}
                    label={({ percent }) =>
                      (percent ?? 0) >= 0.08
                        ? `${Math.round((percent ?? 0) * 100)}%`
                        : ""
                    }
                    labelLine={false}
                  >
                    {slices.map((slice) => (
                      <Cell key={slice.category} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => <ChartTooltip {...props} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full space-y-2 sm:w-1/2">
              {slices.map((slice) => (
                <li
                  key={slice.category}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate">{slice.label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground">
                    {currency_formatter(slice.total)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
