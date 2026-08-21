import http from "@c/configs/axiosHttp";
import type {
  BillCategoryTotalI,
  DashboardExpensesI,
  DashboardSummaryI,
  ExpensePointI,
  ExpensesPeriodT,
  MonthlyExpenseI,
  UpcomingBillI,
} from "@c/types/dashboardTypes";

const toNumber = (value: unknown, fallback = 0): number => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeMonthlyExpense = (
  item: Partial<MonthlyExpenseI> | null | undefined,
  index: number,
): MonthlyExpenseI => ({
  month: typeof item?.month === "number" ? item.month : index + 1,
  label: item?.label ?? "",
  total: toNumber(item?.total),
});

const normalizeCategoryTotal = (
  item: Partial<BillCategoryTotalI> | null | undefined,
): BillCategoryTotalI => ({
  category: item?.category ?? "uncategorized",
  label: item?.label ?? "Uncategorized",
  total: toNumber(item?.total),
});

const normalizeUpcomingBill = (
  item: Partial<UpcomingBillI> | null | undefined,
  index: number,
): UpcomingBillI => ({
  id: typeof item?.id === "number" ? item.id : index,
  name: item?.name ?? "Untitled bill",
  amount: toNumber(item?.amount),
  category: item?.category ?? null,
  category_label: item?.category_label ?? null,
  due_date: item?.due_date ?? "",
  status: item?.status ?? "active",
});

export const normalizeDashboardSummary = (
  data: Partial<DashboardSummaryI> | null | undefined,
): DashboardSummaryI => ({
  year: typeof data?.year === "number" ? data.year : new Date().getFullYear(),
  monthly_expenses: Array.isArray(data?.monthly_expenses)
    ? data.monthly_expenses.map(normalizeMonthlyExpense)
    : [],
  bills_by_category: Array.isArray(data?.bills_by_category)
    ? data.bills_by_category.map(normalizeCategoryTotal)
    : [],
  upcoming_bills: Array.isArray(data?.upcoming_bills)
    ? data.upcoming_bills.map(normalizeUpcomingBill)
    : [],
});

const normalizeExpensePoint = (
  item: Partial<ExpensePointI> | null | undefined,
): ExpensePointI => ({
  label: item?.label ?? "",
  total: toNumber(item?.total),
});

export const normalizeDashboardExpenses = (
  period: ExpensesPeriodT,
  data: Partial<DashboardExpensesI> | null | undefined,
): DashboardExpensesI => ({
  period: data?.period ?? period,
  data: Array.isArray(data?.data) ? data.data.map(normalizeExpensePoint) : [],
});

export const dashboardSummary_API = async (): Promise<DashboardSummaryI> => {
  const response = await http.get("dashboard/summary");
  return normalizeDashboardSummary(response?.data);
};

export const dashboardExpenses_API = async (
  period: ExpensesPeriodT,
): Promise<DashboardExpensesI> => {
  const response = await http.get("dashboard/expenses", { params: { period } });
  return normalizeDashboardExpenses(period, response?.data);
};
