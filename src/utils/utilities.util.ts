import type { BillStatusT, FrequencyTypes } from "@c/types/billsTypes";
import type {
  DailyBudgetI,
  DailyBudgetStatusT,
} from "@c/types/dailyExpenseTypes";

const BILL_STATUS_PILL_CLASSES: Record<BillStatusT, string> = {
  active: "text-blue-600 bg-blue-200",
  ongoing: "text-yellow-600 bg-yellow-200",
  completed: "text-green-600 bg-green-200",
  inactive: "text-gray-600 bg-gray-200",
};

export const bill_status_pill_class = (status?: BillStatusT | null) =>
  status ? BILL_STATUS_PILL_CLASSES[status] : BILL_STATUS_PILL_CLASSES.active;

const DAILY_BUDGET_STATUS_PILL_CLASSES: Record<
  DailyBudgetStatusT | "in_progress",
  string
> = {
  active: "text-blue-600 bg-blue-200",
  in_progress: "text-orange-600 bg-orange-200",
  done: "text-green-600 bg-green-200",
  cancelled: "text-gray-600 bg-gray-200",
};

export const daily_budget_status_pill_class = (
  status?: DailyBudgetStatusT | "in_progress" | null,
) =>
  status
    ? DAILY_BUDGET_STATUS_PILL_CLASSES[status]
    : DAILY_BUDGET_STATUS_PILL_CLASSES.active;

export const daily_budget_display_status = (budget: {
  status: DailyBudgetStatusT;
  is_overdue?: boolean;
}): DailyBudgetStatusT | "in_progress" =>
  budget.status === "active" && budget.is_overdue
    ? "in_progress"
    : budget.status;

export const daily_budget_display_status_label = (budget: {
  status: DailyBudgetStatusT;
  status_label: string;
  is_overdue?: boolean;
}): string =>
  budget.status === "active" && budget.is_overdue
    ? "In Progress"
    : budget.status_label;

/**
 * A budget only represents "today's" active session if it's both active
 * and not overdue — an overdue active budget is rendered as a row in the
 * past-transactions list (with Continue/Close/Delete actions) instead of
 * the full active-session view. Narrows `budget` to non-null on `true`.
 */
export const daily_budget_is_same_day_session = (
  budget: DailyBudgetI | null,
): budget is DailyBudgetI => !!budget && !budget.is_overdue;

export const date_formatter = (data: Date) => {
  const date = new Date(data);

  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const today_date = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
 * Safety ceiling on how many billing periods a single "log payment" action
 * can cover at once (mirrors the backend's `periods` validation max).
 */
export const MAX_LOGGABLE_PERIODS = 60;

/**
 * The valid transaction-date window for logging a payment against a bill:
 * from the current billing period's due date out to whichever comes first
 * of the bill's `end_date` or `MAX_LOGGABLE_PERIODS` periods ahead, so a
 * user can pick a date that skips several unpaid periods (see
 * `get_periods_for_date`). "once" bills have exactly one valid date, since
 * there is no next period to skip into.
 */
export const get_transaction_date_bounds = (
  billingDate: string,
  paymentsCount: number,
  frequency: FrequencyTypes,
  endDate: string,
): { min: string; max: string } => {
  const dueDate = get_future_date(billingDate, paymentsCount, frequency);

  let periodEnd: string;
  switch (frequency) {
    case "monthly":
    case "yearly":
    case "daily":
      // Anchored off `billingDate` (not `dueDate`) so this matches the same
      // due-date math used elsewhere for this period, instead of compounding
      // add_months/add_years' end-of-month rollover on top of an already
      // rolled-over `dueDate`.
      periodEnd = add_days(
        get_future_date(
          billingDate,
          paymentsCount + MAX_LOGGABLE_PERIODS,
          frequency,
        ),
        -1,
      );
      break;
    case "once":
    default:
      periodEnd = dueDate;
      break;
  }

  const max = endDate && endDate < periodEnd ? endDate : periodEnd;
  const min = dueDate > max ? max : dueDate;
  return { min, max };
};

/**
 * How many billing periods (including any skipped/unpaid ones) a selected
 * `transactionDate` covers, counting forward from the bill's current due
 * date. 1 when the date falls in the current period; higher when it falls
 * in a later one (e.g. picking a date 2 months out on an unpaid monthly
 * bill returns 2).
 */
export const get_periods_for_date = (
  billingDate: string,
  paymentsCount: number,
  frequency: FrequencyTypes,
  transactionDate: string,
): number => {
  if (frequency === "once" || frequency === "") return 1;

  let periods = 1;
  while (
    periods < MAX_LOGGABLE_PERIODS &&
    get_future_date(billingDate, paymentsCount + periods, frequency) <=
      transactionDate
  ) {
    periods += 1;
  }
  return periods;
};

const PERIOD_UNIT_LABELS: Partial<Record<FrequencyTypes, [string, string]>> = {
  monthly: ["month", "months"],
  yearly: ["year", "years"],
  daily: ["date", "dates"],
};

/** Human label for `periods` billing periods of the given frequency (e.g. "3 months"). */
export const period_unit_label = (
  frequency: FrequencyTypes,
  periods: number,
): string => {
  const [singular, plural] = PERIOD_UNIT_LABELS[frequency] ?? [
    "payment",
    "payments",
  ];
  return periods === 1 ? singular : plural;
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
