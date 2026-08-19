import type { BillStatusT, FrequencyTypes } from "@c/types/billsTypes";
import type { DailyBudgetStatusT } from "@c/types/dailyExpenseTypes";

const BILL_STATUS_PILL_CLASSES: Record<BillStatusT, string> = {
  active: "text-blue-600 bg-blue-200",
  ongoing: "text-yellow-600 bg-yellow-200",
  completed: "text-green-600 bg-green-200",
  inactive: "text-gray-600 bg-gray-200",
};

export const bill_status_pill_class = (status?: BillStatusT | null) =>
  status ? BILL_STATUS_PILL_CLASSES[status] : BILL_STATUS_PILL_CLASSES.active;

const DAILY_BUDGET_STATUS_PILL_CLASSES: Record<DailyBudgetStatusT, string> = {
  active: "text-blue-600 bg-blue-200",
  done: "text-green-600 bg-green-200",
  cancelled: "text-gray-600 bg-gray-200",
};

export const daily_budget_status_pill_class = (
  status?: DailyBudgetStatusT | null,
) =>
  status
    ? DAILY_BUDGET_STATUS_PILL_CLASSES[status]
    : DAILY_BUDGET_STATUS_PILL_CLASSES.active;

export const date_formatter = (data: Date) => {
  const date = new Date(data);

  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const today_date = () => new Date().toISOString().split("T")[0];

export const add_days = (date: string, days: number): string => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
};

export const add_months = (date: string, months: number): string => {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().split("T")[0];
};

export const add_years = (date: string, years: number): string => {
  const d = new Date(date);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().split("T")[0];
};

/**
 * Mirrors the backend's DateHelper::getFutureDate — advances `date` by
 * `count` steps of `frequency`. "once" (and any unrecognized frequency)
 * returns `date` unchanged, same as the backend's default case.
 */
export const get_future_date = (
  date: string,
  count: number,
  frequency: FrequencyTypes,
): string => {
  switch (frequency) {
    case "daily":
      return add_days(date, count);
    case "monthly":
      return add_months(date, count);
    case "yearly":
      return add_years(date, count);
    default:
      return date;
  }
};

/**
 * Which frequencies are selectable for a given start/end date pair.
 * Tomorrow -&gt; once only. &lt;1 month -&gt; daily. &lt;1 year -&gt; monthly/daily.
 * &gt;=1 year -&gt; monthly/yearly/daily. Invalid range -&gt; none.
 */
export const get_frequency_options_for_range = (
  startDate: string,
  endDate: string,
): FrequencyTypes[] => {
  if (!startDate || !endDate || endDate <= startDate) return [];

  const tomorrow = add_days(startDate, 1);
  const oneMonth = add_months(startDate, 1);
  const oneYear = add_years(startDate, 1);

  if (endDate === tomorrow) return ["once"];
  if (endDate < oneMonth) return ["daily"];
  if (endDate < oneYear) return ["monthly", "daily"];
  return ["monthly", "yearly", "daily"];
};

export const currency_formatter = (amount: number | string) => {
  const value =
    Number(typeof amount === "string" ? amount.replace(/,/g, "") : amount) || 0;

  return `₱${value.toLocaleString("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const AVATAR_TINT_PALETTE = [
  {
    bg: "bg-blue-100 dark:bg-blue-500/15",
    fg: "text-blue-700 dark:text-blue-400",
  },
  {
    bg: "bg-violet-100 dark:bg-violet-500/15",
    fg: "text-violet-700 dark:text-violet-400",
  },
  {
    bg: "bg-amber-100 dark:bg-amber-500/15",
    fg: "text-amber-700 dark:text-amber-400",
  },
  {
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
    fg: "text-emerald-700 dark:text-emerald-400",
  },
  {
    bg: "bg-rose-100 dark:bg-rose-500/15",
    fg: "text-rose-700 dark:text-rose-400",
  },
  {
    bg: "bg-cyan-100 dark:bg-cyan-500/15",
    fg: "text-cyan-700 dark:text-cyan-400",
  },
];

export const avatar_tint = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash + name.charCodeAt(i)) % 997;
  return AVATAR_TINT_PALETTE[hash % AVATAR_TINT_PALETTE.length];
};

export const get_initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
};

export const url_search = (
  url: string | null = null,
  term: string | null = null,
) => {
  if (!url || !term) return false;

  const url_arr = url.split("/");
  return url_arr.find((uri) => uri === term);
};
